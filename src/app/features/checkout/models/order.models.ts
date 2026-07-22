import { Address } from '../../../core/models/common.models';

export type OrderStatus = 'CREATED' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
export type AggregateOrderStatus =
  | 'EN_PROCESO'
  | 'PARCIALMENTE_COMPLETADA'
  | 'COMPLETADA'
  | 'CANCELADA';

export interface OrderItemResponse {
  itemId: string;
  title: string;
  unitPriceAtPurchase: number;
  quantity: number;
  subtotal: number;
}

export interface SubOrderResponse {
  id: string;
  associateId: string;
  storeName: string;
  status: OrderStatus;
  total: number;
  items: OrderItemResponse[];
}

export interface OrderResponse {
  id: string;
  aggregateStatus: AggregateOrderStatus;
  total: number;
  shippingAddress: Address | null;
  createdAt: string;
  subOrders: SubOrderResponse[];
}

export interface AssociateOrderResponse {
  id: string;
  parentOrderId: string;
  status: OrderStatus;
  createdAt: string;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
  };
  shippingAddress: Address | null;
  items: OrderItemResponse[];
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  CREATED: 'Creada',
  PAID: 'Pagada',
  PROCESSING: 'En preparación',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada',
};

export const AGGREGATE_STATUS_LABELS: Record<AggregateOrderStatus, string> = {
  EN_PROCESO: 'En proceso',
  PARCIALMENTE_COMPLETADA: 'Parcialmente completada',
  COMPLETADA: 'Completada',
  CANCELADA: 'Cancelada',
};

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

export interface CheckoutRequest {
  addressId?: string;
}
