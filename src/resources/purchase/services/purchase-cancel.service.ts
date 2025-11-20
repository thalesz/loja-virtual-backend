import prisma from "../../../prisma/prisma.client";

/**
 * Service para cancelar uma compra
 * Valida permissões: apenas o dono pode cancelar
 * Valida status: apenas PENDING ou PROCESSING podem ser cancelados
 * Devolve o estoque dos produtos
 * @param purchaseId - ID da compra
 * @param userId - ID do usuário que está fazendo a requisição
 * @returns Resultado da operação
 */
export async function cancelPurchaseService(
  purchaseId: number,
  userId: number,
) {
  try {
    // Busca a compra com os itens
    const purchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId,
      },
      include: {
        items: true,
      },
    });

    // Se a compra não existe
    if (!purchase) {
      return {
        success: false,
        error: "Compra não encontrada",
        statusCode: 404,
      };
    }

    // Validação de permissão: apenas o dono pode cancelar
    if (purchase.userId !== userId) {
      return {
        success: false,
        error: "Você não tem permissão para cancelar esta compra",
        statusCode: 403,
      };
    }

    // Validação de status: apenas PENDING ou PROCESSING podem ser cancelados
    const purchaseStatus = (purchase as any).status;
    if (purchaseStatus !== "PENDING" && purchaseStatus !== "PROCESSING") {
      return {
        success: false,
        error: `Compra com status ${purchaseStatus} não pode ser cancelada. Apenas compras com status PENDING ou PROCESSING podem ser canceladas.`,
        statusCode: 400,
      };
    }

    // Cancela a compra e devolve o estoque em uma transação
    const cancelledPurchase = await prisma.$transaction(async (tx) => {
      // Atualiza o status da compra para CANCELLED
      const updated = await (tx.purchase.update as any)({
        where: {
          id: purchaseId,
        },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      // Devolve o estoque de cada produto
      for (const item of purchase.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      return updated;
    });

    // Calcula o total da compra
    const purchaseData = cancelledPurchase as any;
    const totalAmount = purchaseData.items.reduce(
      (sum: number, item: any) => sum + item.totalPrice,
      0,
    );

    // Formata a resposta
    const formattedPurchase = {
      id: purchaseData.id,
      items: purchaseData.items.map((item: any) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
        },
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      })),
      totalAmount,
      status: purchaseData.status,
      cancelledAt: purchaseData.cancelledAt,
      createdAt: purchaseData.createdAt,
      updatedAt: purchaseData.updatedAt,
    };

    return {
      success: true,
      data: formattedPurchase,
    };
  } catch (error) {
    console.error("Erro ao cancelar compra:", error);
    return {
      success: false,
      error: "Erro ao cancelar compra",
      statusCode: 500,
    };
  }
}
