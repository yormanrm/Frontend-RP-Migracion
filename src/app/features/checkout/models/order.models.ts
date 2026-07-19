export type OrderStatus = 'CREATED' | 'PAID' | 'CANCELLED';

export interface OrderItemResponse {
  itemId: string;
  title: string;
  unitPriceAtPurchase: number;
  quantity: number;
  subtotal: number;
}

export interface OrderResponse {
  id: string;
  status: OrderStatus;
  items: OrderItemResponse[];
  total: number;
  createdAt: string;
}
