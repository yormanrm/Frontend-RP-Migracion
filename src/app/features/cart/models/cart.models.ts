export interface CartLineResponse {
  cartItemId: string;
  itemId: string;
  title: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface CartResponse {
  id: string | null;
  items: CartLineResponse[];
  total: number;
}

export interface AddToCartRequest {
  itemId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
