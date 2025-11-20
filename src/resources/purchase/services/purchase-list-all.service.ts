import prisma from "../../../prisma/prisma.client";
import { ListAllPurchasesDTO } from "../types/purchase-list-all.dto";

/**
 * Service para listar todas as compras (apenas admin)
 * Suporta filtros por status, usuário e intervalo de datas
 * @param params - Parâmetros de filtro e paginação
 * @returns Objeto com compras, total de itens e informações de paginação
 */
export async function listAllPurchasesService(params: ListAllPurchasesDTO) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // Constrói o objeto de filtros dinamicamente
    const where: any = {};

    // Filtro por status
    if (params.status) {
      where.status = params.status;
    }

    // Filtro por usuário
    if (params.userId) {
      where.userId = params.userId;
    }

    // Filtro por intervalo de datas
    if (params.startDate || params.endDate) {
      where.createdAt = {};

      if (params.startDate) {
        where.createdAt.gte = new Date(params.startDate);
      }

      if (params.endDate) {
        where.createdAt.lte = new Date(params.endDate);
      }
    }

    // Busca compras com filtros e paginação
    const purchases = await prisma.purchase.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc", // Mais recente primeiro
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
            totalPrice: true,
          },
        },
      },
    });

    // Formata as compras para dashboard
    const formattedPurchases = purchases.map((purchase: any) => {
      return {
        id: purchase.id,
        user: {
          id: purchase.user.id,
          name: purchase.user.name,
          email: purchase.user.email,
        },
        totalAmount: purchase.totalAmount,
        itemCount: purchase.items.length,
        status: purchase.status,
        createdAt: purchase.createdAt,
        updatedAt: purchase.updatedAt,
      };
    });

    // Conta o total de compras com os filtros aplicados
    const total = await prisma.purchase.count({
      where,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      purchases: formattedPurchases,
      pagination: {
        currentPage: page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  } catch (error) {
    console.error("Erro ao listar todas as compras:", error);
    throw new Error("Erro ao listar compras");
  }
}
