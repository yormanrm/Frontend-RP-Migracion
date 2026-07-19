export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
}

export interface AssociateInfoResponse {
  id: string;
  storeName: string;
}

export interface ItemResponse {
  id: string;
  title: string;
  slug: string;
  price: number;
  description: string | null;
  category: CategoryResponse;
  associateInfo: AssociateInfoResponse;
  images: string[];
}

export interface ItemSummaryResponse {
  id: string;
  title: string;
  slug: string;
  price: number;
  category: CategoryResponse;
  images: string[];
}

export type ItemSortBy = 'recent' | 'bestsellers' | 'price_asc' | 'price_desc';

export interface ItemSearchParams {
  priceMin?: number;
  priceMax?: number;
  categorySlug?: string;
  sortBy?: ItemSortBy;
  page?: number;
  size?: number;
}
