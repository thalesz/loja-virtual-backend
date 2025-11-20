import { Request, Response } from "express";
import { listProductsService } from "../services/product-list.service";
import { ListProductsDTO } from "../types/product-list.dto";

/**
 * Controller para listar produtos com paginação
 * Query params já vêm validados pelo middleware validateQuery
 */
export async function listProductsController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    // Pega os dados validados do middleware
    const validatedQuery = (req as any).validatedQuery || {};

    const params: ListProductsDTO = {
      page: validatedQuery.page || 1,
      limit: validatedQuery.limit || 10,
    };

    const result = await listProductsService(params);

    return res.status(200).json({
      message: "Produtos listados com sucesso",
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error: any) {
    console.error("Erro no controller de listagem de produtos:", error);

    return res.status(500).json({
      message: "Erro interno do servidor ao listar produtos",
    });
  }
}
