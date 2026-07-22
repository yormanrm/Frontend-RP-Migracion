export type ItemType = 'PRODUCT' | 'SERVICE';
export type DurationUnit = 'HORAS' | 'DIAS' | 'SEMANAS';
export type ServiceMode = 'PRESENCIAL' | 'REMOTO' | 'AMBOS';
export type SortBy = 'recent' | 'bestsellers' | 'price_asc' | 'price_desc';

export interface SubcategoryResponse {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
}

export interface CategoryResponse {
  id: string;
  name: string;
  subcategories: SubcategoryResponse[];
}

export interface BrandResponse {
  id: string;
  name: string;
}

export interface AssociateInfoResponse {
  id: string;
  storeName: string;
}

export interface ItemResponse {
  id: string;
  title: string;
  slug: string;
  type: ItemType;
  price: number;
  stock: number | null;
  sku: string | null;
  model: string | null;
  description: string | null;
  active: boolean;
  subcategory: SubcategoryResponse;
  brand: BrandResponse | null;
  durationValue: number | null;
  durationUnit: DurationUnit | null;
  serviceMode: ServiceMode | null;
  coverageZone: string | null;
  associateInfo: AssociateInfoResponse;
  images: string[];
}

export interface ItemSummaryResponse {
  id: string;
  title: string;
  slug: string;
  type: ItemType;
  price: number;
  subcategory: SubcategoryResponse;
  brand: BrandResponse | null;
  images: string[];
}

export interface ItemSearchRequest {
  q?: string;
  subcategoryId?: string;
  brandId?: string;
  type?: ItemType;
  priceMin?: number;
  priceMax?: number;
  sortBy?: SortBy;
  page?: number;
  size?: number;
}
