import { Request, Response } from "express";
import { cancelPurchaseService } from "../services/purchase-cancel.service";

/**
 * Controller para cancelar uma compra
 */
export async function cancelPurchaseController(
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

    // Cancela a compra através do service
    const result = await cancelPurchaseService(purchaseId, userId);

    // Se houve erro
    if (!result.success) {
      return res.status(result.statusCode || 500).json({
        message: result.error,
      });
    }

    // Retorna os dados da compra cancelada
    return res.status(200).json({
      message: "Compra cancelada com sucesso",
      data: result.data,
    });
  } catch (error: any) {
    console.error("Erro no controller de cancelar compra:", error);

    return res.status(500).json({
      message: "Erro interno do servidor ao cancelar compra",
    });
  }
}
