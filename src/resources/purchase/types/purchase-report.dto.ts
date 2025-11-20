export interface TopSellingProduct {
  productId: number;
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface PurchaseReportDTO {
  totalRevenue: number;
  totalPurchases: number;
  averageTicket: number;
  topSellingProducts: TopSellingProduct[];
}
