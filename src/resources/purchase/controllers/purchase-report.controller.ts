import { Request, Response } from "express";
import { getPurchaseReportService } from "../services/purchase-report.service";

export async function getPurchaseReportController(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const report = await getPurchaseReportService();
    return res.status(200).json(report);
  } catch (error: any) {
    console.error("Erro ao gerar relatório de vendas:", error);
    return res.status(500).json({ message: "Erro interno ao gerar relatório" });
  }
}
