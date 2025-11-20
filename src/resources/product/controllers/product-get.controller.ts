import { Request, Response } from "express";
import { getProductByIdService } from "../services/product-get.service";

/**
 * Controller para buscar um produto específico por ID
 */
export async function getProductByIdController(
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

    const product = await getProductByIdService(productId);

    return res.status(200).json({
      message: "Produto encontrado com sucesso",
      data: product,
    });
  } catch (error: any) {
    console.error("Erro no controller de busca de produto:", error);

    if (error.message === "Produto não encontrado") {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Erro interno do servidor ao buscar produto",
    });
  }
}
