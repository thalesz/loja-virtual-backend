import { Request, Response } from "express";
import { createProductService } from "../services/product-create.service";
import { CreateProductDTO } from "../types/product-create.dto";

/**
 * Controller para criar um novo produto
 * Os dados já vêm validados pelo middleware validate
 */
export async function createProductController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    // Os dados já vêm validados pelo middleware, mas fazemos uma verificação adicional
    if (!req.body) {
      return res.status(400).json({
        message: "Dados do produto não fornecidos",
      });
    }

    const productData = req.body as CreateProductDTO;

    const product = await createProductService(productData);

    return res.status(201).json({
      message: "Produto criado com sucesso",
      data: product,
    });
  } catch (error: any) {
    console.error("Erro no controller de criação de produto:", error);

    // Verifica se é erro de produto duplicado
    if (error.message === "Produto com este nome já cadastrado") {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Erro interno do servidor ao criar produto",
    });
  }
}
