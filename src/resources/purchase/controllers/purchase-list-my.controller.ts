import { Request, Response } from "express";
import { listMyPurchasesService } from "../services/purchase-list-my.service";
import { ListMyPurchasesDTO } from "../types/purchase-list-my.dto";

/**
 * Controller para listar compras do usuário autenticado
 * Query params já vêm validados pelo middleware validateQuery
 */
export async function listMyPurchasesController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const userId = req.session.userId!;

    // Pega os dados validados do middleware
    const validatedQuery = (req as any).validatedQuery || {};

    const params: ListMyPurchasesDTO = {
      page: validatedQuery.page || 1,
      limit: validatedQuery.limit || 10,
    };

    const result = await listMyPurchasesService(userId, params);

    return res.status(200).json({
      message: "Compras listadas com sucesso",
      data: result.purchases,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error(
      "Erro no controller de listagem de compras do usuário:",
      error,
    );

    return res.status(500).json({
      message: "Erro interno do servidor ao listar compras",
    });
  }
}
