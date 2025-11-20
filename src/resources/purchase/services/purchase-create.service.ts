import prisma from "../../../prisma/prisma.client";
import { CreatePurchaseDTO } from "../types/purchase-create.dto";

/**
 * Service para criar uma nova compra
 * @param userId - ID do usuário que está fazendo a compra
 * @param data - Dados da compra (itens)
 * @returns Compra criada com todos os detalhes
 */
export async function createPurchaseService(
  userId: number,
  data: CreatePurchaseDTO,
) {
  try {
    // Valida se todos os produtos existem e têm estoque disponível
    const productIds = data.items.map((item) => item.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    // Verifica se todos os produtos foram encontrados
    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id);
      const notFoundIds = productIds.filter((id) => !foundIds.includes(id));
      throw new Error(`Produtos não encontrados: ${notFoundIds.join(", ")}`);
    }

    // Valida estoque e calcula valores
    let totalPurchase = 0;
    const purchaseItemsData: Array<{
      productId: number;
      quantity: number;
      totalPrice: number;
    }> = [];

    for (const item of data.items) {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }

      // Verifica estoque disponível
      if (product.stock < item.quantity) {
        throw new Error(
          `Estoque insuficiente para o produto "${product.name}". Disponível: ${product.stock}, Solicitado: ${item.quantity}`,
        );
      }

      // Calcula o total do item (preço atual * quantidade)
      const itemTotal = product.price * item.quantity;
      totalPurchase += itemTotal;

      purchaseItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: product.price, // Preço unitário capturado no momento da compra
        totalPrice: itemTotal, // Preço total do item
      } as any);
    }

    // Cria a compra usando transação para garantir consistência
    const purchase = await prisma.$transaction(async (tx) => {
      // Cria a compra
      const newPurchase = await (tx.purchase.create as any)({
        data: {
          userId,
          totalAmount: totalPurchase, // Total da compra
          items: {
            create: purchaseItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  price: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // Atualiza o estoque de cada produto
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newPurchase;
    });

    // Formata a resposta apenas com informações essenciais
    const purchaseData = purchase as any;
    const formattedPurchase = {
      id: purchaseData.id,
      items: purchaseData.items.map((item: any) => ({
        productName: item.product.name,
        quantity: item.quantity,
        price: item.totalPrice / item.quantity, // Preço unitário
        subtotal: item.totalPrice,
      })),
      total: totalPurchase,
      status: (purchase as any).status,
      createdAt: purchase.createdAt,
      updatedAt: (purchase as any).updatedAt,
    };

    return formattedPurchase;
  } catch (error: any) {
    console.error("Erro ao criar compra:", error);

    // Propaga erros conhecidos
    if (
      error.message.includes("Produtos não encontrados") ||
      error.message.includes("Estoque insuficiente") ||
      error.message.includes("não encontrado")
    ) {
      throw error;
    }

    throw new Error("Erro ao criar compra no banco de dados");
  }
}
