import prisma from "../../../prisma/prisma.client";
import { ListMyPurchasesDTO } from "../types/purchase-list-my.dto";

/**
 * Service para listar as compras de um usuário específico com paginação
 * @param userId - ID do usuário
 * @param params - Parâmetros de paginação (page e limit)
 * @returns Objeto com compras, total de itens e informações de paginação
 */
export async function listMyPurchasesService(
  userId: number,
  params: ListMyPurchasesDTO,
) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // Busca compras do usuário com paginação
    const purchases = await prisma.purchase.findMany({
      where: {
        userId,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc", // Mais recente primeiro
      },
      include: {
        items: {
          select: {
            quantity: true,
            totalPrice: true,
          },
        },
      },
    });

    // Formata as compras para exibir apenas informações essenciais
    const formattedPurchases = purchases.map((purchase) => {
      // Calcula o total da compra somando os itens
      const total = purchase.items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );

      return {
        id: purchase.id,
        total,
        itemCount: purchase.items.length,
        status: (purchase as any).status,
        createdAt: purchase.createdAt,
        updatedAt: (purchase as any).updatedAt,
      };
    });

    // Conta o total de compras do usuário
    const total = await prisma.purchase.count({
      where: {
        userId,
      },
    });

    // Calcula informações de paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      purchases: formattedPurchases,
      pagination: {
        currentPage: page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  } catch (error: any) {
    console.error("Erro ao listar compras do usuário:", error);
    throw new Error("Erro ao listar compras no banco de dados");
  }
}
