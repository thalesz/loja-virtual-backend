import { Request, Response } from "express";
import { getPurchaseService } from "../services/purchase-get.service";

/**
 * Controller para buscar uma compra específica
 * O ID já vem validado pelo middleware validate
 */
export async function getPurchaseController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const purchaseId = parseInt(req.params.id, 10);

    // Valida se o ID é um número válido
    if (isNaN(purchaseId) || purchaseId <= 0) {
      return res.status(400).json({
        message: "ID da compra inválido",
      });
    }

    const userId = req.session.userId!;
    const userTypeId = req.session.userTypeId!;

    // Busca a compra através do service
    const result = await getPurchaseService(purchaseId, userId, userTypeId);

    // Se houve erro
    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        message: result.error,
      });
    }

    // Retorna os dados da compra
    return res.status(200).json({
      message: "Compra encontrada com sucesso",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Erro no controller de buscar compra:", error);

    return res.status(500).json({
      message: "Erro interno do servidor ao buscar compra",
    });
  }
}
