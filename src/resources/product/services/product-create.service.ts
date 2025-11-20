import prisma from "../../../prisma/prisma.client";
import { CreateProductDTO } from "../types/product-create.dto";

/**
 * Service para criar um novo produto
 * @param data - Dados do produto a ser criado
 * @returns Produto criado
 */
export async function createProductService(data: CreateProductDTO) {
  try {
    // Verifica se já existe um produto com o mesmo nome
    const existingProduct = await prisma.product.findFirst({
      where: {
        name: data.name,
      },
    });

    if (existingProduct) {
      throw new Error("Produto com este nome já cadastrado");
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });

    return product;
  } catch (error: any) {
    console.error("Erro ao criar produto:", error);

    // Propaga erros conhecidos
    if (error.message === "Produto com este nome já cadastrado") {
      throw error;
    }

    throw new Error("Erro ao criar produto no banco de dados");
  }
}
