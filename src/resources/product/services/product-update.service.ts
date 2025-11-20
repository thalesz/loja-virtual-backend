import prisma from "../../../prisma/prisma.client";
import { UpdateProductDTO } from "../types/product-update.dto";

/**
 * Service para atualizar um produto existente
 * @param id - ID do produto a ser atualizado
 * @param data - Dados a serem atualizados (atualização parcial)
 * @returns Produto atualizado
 */
export async function updateProductService(id: number, data: UpdateProductDTO) {
  try {
    // Verifica se o produto existe
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new Error("Produto não encontrado");
    }

    // Se o nome está sendo atualizado, verifica se já existe outro produto com esse nome
    if (data.name && data.name !== existingProduct.name) {
      const duplicateProduct = await prisma.product.findFirst({
        where: {
          name: data.name,
          id: { not: id }, // Exclui o produto atual da busca
        },
      });

      if (duplicateProduct) {
        throw new Error("Já existe outro produto com este nome");
      }
    }

    // Atualiza apenas os campos fornecidos
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.stock !== undefined && { stock: data.stock }),
      },
    });

    return updatedProduct;
  } catch (error: any) {
    console.error("Erro ao atualizar produto:", error);

    // Propaga erros conhecidos
    if (
      error.message === "Produto não encontrado" ||
      error.message === "Já existe outro produto com este nome"
    ) {
      throw error;
    }

    throw new Error("Erro ao atualizar produto no banco de dados");
  }
}
