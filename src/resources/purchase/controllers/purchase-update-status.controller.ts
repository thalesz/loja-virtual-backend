import { Request, Response } from "express";
import { updatePurchaseStatusService } from "../services/purchase-update-status.service";
import { UpdatePurchaseStatusDTO } from "../types/purchase-update-status.dto";

export async function updatePurchaseStatusController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const data = req.body as UpdatePurchaseStatusDTO;
    const purchase = await updatePurchaseStatusService(id, data);

    return res.status(200).json({
      message: "Status da compra atualizado com sucesso",
      data: purchase,
    });
  } catch (error: any) {
    console.error("Erro ao atualizar status da compra:", error);
    if (error.message === "Compra não encontrada") {
      return res.status(404).json({ message: error.message });
    }
    if (
      error.message.startsWith("Transição de status inválida") ||
      error.message.startsWith("Não é possível") ||
      error.message === "Compra já foi entregue"
    ) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
