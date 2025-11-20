import prisma from "../../../prisma/prisma.client";

/**
 * Service para buscar um produto específico por ID
 * @param id - ID do produto
 * @returns Produto completo com todos os detalhes
 */
export async function getProductByIdService(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    return product;
  } catch (error: any) {
    console.error("Erro ao buscar produto:", error);

    if (error.message === "Produto não encontrado") {
      throw error;
    }

    throw new Error("Erro ao buscar produto no banco de dados");
  }
}
