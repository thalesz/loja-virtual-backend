import { Request, Response } from "express";
import { listAllPurchasesService } from "../services/purchase-list-all.service";
import { ListAllPurchasesDTO } from "../types/purchase-list-all.dto";

/**
 * Controller para listar todas as compras (apenas admin)
 * Query params já vêm validados pelo middleware validateQuery
 */
export async function listAllPurchasesController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    // Pega os dados validados do middleware
    const validatedQuery = (req as any).validatedQuery || {};

    const params: ListAllPurchasesDTO = {
      page: validatedQuery.page || 1,
      limit: validatedQuery.limit || 10,
      status: validatedQuery.status,
      userId: validatedQuery.userId,
      startDate: validatedQuery.startDate,
      endDate: validatedQuery.endDate,
    };

    const result = await listAllPurchasesService(params);

    return res.status(200).json({
      message: "Compras listadas com sucesso",
      data: result.purchases,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Erro no controller de listagem de todas as compras:", error);

    return res.status(500).json({
      message: "Erro interno do servidor ao listar compras",
    });
  }
}
