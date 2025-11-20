import prisma from "../../../prisma/prisma.client";
import { ListProductsDTO } from "../types/product-list.dto";

/**
 * Service para listar produtos com paginação
 * @param params - Parâmetros de paginação (page e limit)
 * @returns Objeto com produtos, total de itens e informações de paginação
 */
export async function listProductsService(params: ListProductsDTO) {
  try {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const skip = (page - 1) * limit;

    // Busca produtos com paginação
    const productsRaw = await prisma.product.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc", // Produtos mais recentes primeiro
      },
    });

    // Formata produtos com prévia da descrição (máximo 100 caracteres)
    const products = productsRaw.map((product) => ({
      id: product.id,
      name: product.name,
      description:
        product.description.length > 100
          ? product.description.substring(0, 100) + "..."
          : product.description,
      price: product.price,
      stock: product.stock,
    }));

    // Conta o total de produtos
    const total = await prisma.product.count();

    // Calcula informações de paginação
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      products,
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
    console.error("Erro ao listar produtos:", error);
    throw new Error("Erro ao listar produtos no banco de dados");
  }
}
