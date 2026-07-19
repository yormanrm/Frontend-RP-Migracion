export interface ItemCreateRequest {
  title: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: string[];
}

export interface ItemUpdateRequest {
  title: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
  images?: string[];
}
