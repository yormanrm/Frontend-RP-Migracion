export interface ItemSales {
  itemId: string;
  title: string;
  unitsSold: number;
}

export interface ItemRef {
  itemId: string;
  title: string;
}

export interface AssociateSalesReportResponse {
  totalRevenue: number;
  completedOrdersCount: number;
  bestSeller: ItemSales | null;
  worstSeller: ItemSales | null;
  totalStock: number;
  zeroSalesItems: ItemRef[];
}
