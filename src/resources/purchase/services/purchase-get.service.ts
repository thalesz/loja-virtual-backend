import prisma from "../../../prisma/prisma.client";
import { GetPurchaseDTO } from "../types/purchase-get.dto";

/**
 * Service para buscar uma compra específica
 * Valida permissões: apenas o dono da compra ou admin pode visualizar
 * @param purchaseId - ID da compra
 * @param userId - ID do usuário que está fazendo a requisição
 * @param userTypeId - Tipo de usuário (1 = admin, 2 = cliente)
 * @returns Objeto com detalhes completos da compra
 */
export async function getPurchaseService(
  purchaseId: number,
  userId: number,
  userTypeId: number,
) {
  try {
    // Busca a compra com os detalhes necessários
    const purchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId,
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

    // Se a compra não existe
    if (!purchase) {
      return {
        success: false,
        error: "Compra não encontrada",
        statusCode: 404,
      };
    }

    // Validação de permissão: apenas o dono da compra ou admin pode visualizar
    const isAdmin = userTypeId === 1;
    const isOwner = purchase.userId === userId;

    if (!isAdmin && !isOwner) {
      return {
        success: false,
        error: "Você não tem permissão para visualizar esta compra",
        statusCode: 403,
      };
    }

    // Calcula o valor total da compra
    const totalAmount = purchase.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0,
    );

    // Formata a resposta com detalhes essenciais
    const formattedPurchase = {
      id: purchase.id,
      items: purchase.items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
        },
        quantity: item.quantity,
        unitPrice: item.totalPrice / item.quantity,
        totalPrice: item.totalPrice,
      })),
      totalAmount,
      status: (purchase as any).status,
      createdAt: purchase.createdAt,
      updatedAt: (purchase as any).updatedAt,
    };

    return {
      success: true,
      data: formattedPurchase,
    };
  } catch (error) {
    console.error("Erro ao buscar compra:", error);
    return {
      success: false,
      error: "Erro ao buscar compra",
      statusCode: 500,
    };
  }
}
