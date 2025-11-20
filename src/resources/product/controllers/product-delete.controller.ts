import { Request, Response } from "express";
import { deleteProductService } from "../services/product-delete.service";

/**
 * Controller para deletar um produto
 */
export async function deleteProductController(
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

    await deleteProductService(productId);

    return res.status(200).json({
      message: "Produto deletado com sucesso",
    });
  } catch (error: any) {
    console.error("Erro no controller de deleção de produto:", error);

    // Verifica erros conhecidos
    if (error.message === "Produto não encontrado") {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error.message ===
      "Não é possível deletar o produto pois ele possui compras associadas"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Erro interno do servidor ao deletar produto",
    });
  }
}
