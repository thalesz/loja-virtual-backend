import prisma from "../../../prisma/prisma.client";
import { PurchaseStatus } from "@prisma/client";
import { PurchaseReportDTO } from "../types/purchase-report.dto";

export const getPurchaseReportService =
  async (): Promise<PurchaseReportDTO> => {
    const whereCondition = {
      status: {
        not: PurchaseStatus.CANCELLED,
      },
    };

    // 1. Total de vendas e Quantidade total de compras
    const aggregates = await prisma.purchase.aggregate({
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
      where: whereCondition,
    });

    const totalRevenue = aggregates._sum.totalAmount || 0;
    const totalPurchases = aggregates._count.id || 0;
    const averageTicket =
      totalPurchases > 0 ? totalRevenue / totalPurchases : 0;

    // 2. Produtos mais vendidos (Top 5)
    // Usando queryRaw para conseguir fazer join e agregação com filtro na tabela pai de forma eficiente
    const topProductsRaw = await prisma.$queryRaw`
        SELECT 
            p.name as productName,
            pi.productId,
            SUM(pi.quantity) as totalQuantity,
            SUM(pi.totalPrice) as totalRevenue
        FROM PurchaseItem pi
        JOIN Purchase pur ON pi.purchaseId = pur.id
        JOIN Product p ON pi.productId = p.id
        WHERE pur.status != 'CANCELLED'
        GROUP BY pi.productId, p.name
        ORDER BY totalQuantity DESC
        LIMIT 5;
    `;

    const topSellingProducts = (topProductsRaw as any[]).map((item) => ({
      productId: item.productId,
      productName: item.productName,
      totalQuantity: Number(item.totalQuantity),
      totalRevenue: Number(item.totalRevenue),
    }));

    return {
      totalRevenue,
      totalPurchases,
      averageTicket,
      topSellingProducts,
    };
  };
