import prisma from "../../../prisma/prisma.client";

/**
 * Service para deletar um produto por ID
 * @param id - ID do produto a ser deletado
 * @returns Produto deletado
 */
export async function deleteProductService(id: number) {
  try {
    // Verifica se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Produto não encontrado");
    }

    // Deleta o produto
    const deletedProduct = await prisma.product.delete({
      where: { id },
    });

    return deletedProduct;
  } catch (error: any) {
    console.error("Erro ao deletar produto:", error);

    // Propaga erros conhecidos
    if (error.message === "Produto não encontrado") {
      throw error;
    }

    // Verifica se é erro de constraint (produto sendo usado em compras)
    if (
      error.code === "P2003" ||
      error.message.includes("Foreign key constraint")
    ) {
      throw new Error(
        "Não é possível deletar o produto pois ele possui compras associadas",
      );
    }

    throw new Error("Erro ao deletar produto no banco de dados");
  }
}
