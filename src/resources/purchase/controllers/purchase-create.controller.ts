import { Request, Response } from "express";
import { createPurchaseService } from "../services/purchase-create.service";
import { CreatePurchaseDTO } from "../types/purchase-create.dto";

/**
 * Controller para criar uma nova compra
 * Os dados já vêm validados pelo middleware validate
 */
export async function createPurchaseController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const userId = req.session.userId!;
    const purchaseData = req.body as CreatePurchaseDTO;

    const purchase = await createPurchaseService(userId, purchaseData);

    return res.status(201).json({
      message: "Compra realizada com sucesso",
      data: purchase,
    });
  } catch (error: any) {
    console.error("Erro no controller de criação de compra:", error);

    // Verifica erros conhecidos
    if (error.message.includes("Produtos não encontrados")) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (error.message.includes("Estoque insuficiente")) {
      return res.status(400).json({
        message: error.message,
      });
    }

    if (error.message.includes("não encontrado")) {
      return res.status(404).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: "Erro interno do servidor ao criar compra",
    });
  }
}
