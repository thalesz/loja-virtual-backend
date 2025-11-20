import { Request, Response } from "express";
import { updateProductService } from "../services/product-update.service";
import { UpdateProductDTO } from "../types/product-update.dto";

/**
 * Controller para atualizar um produto existente
 * Os dados já vêm validados pelo middleware validate
 */
export async function updateProductController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const productId = parseInt(req.params.id, 10);

    // Valida se o ID é um número válido
    if (isNaN(productId) || productId <= 0) {
      return res.status(400).json({
        message: "ID do produto inválido",
      });
    }

    const productData = req.body as UpdateProductDTO;

    const product = await updateProductService(productId, productData);

    return res.status(200).json({
      message: "Produto atualizado com sucesso",
      data: product,
    });
  } catch (error: any) {
    console.error("Erro no controller de atualização de produto:", error);

    // Verifica erros conhecidos
    if (error.message === "Produto não encontrado") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message === "Já existe outro produto com este nome") {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Erro interno do servidor ao atualizar produto",
    });
  }
}
