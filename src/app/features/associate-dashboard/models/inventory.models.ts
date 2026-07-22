import { DurationUnit, ItemType, ServiceMode } from '../../storefront/models/catalog.models';

export interface ItemCreateRequest {
  title: string;
  description?: string;
  type: ItemType;
  price: number;
  stock?: number;
  sku?: string;
  model?: string;
  brandName?: string;
  subcategoryId: string;
  durationValue?: number;
  durationUnit?: DurationUnit;
  serviceMode?: ServiceMode;
  coverageZone?: string;
  images?: string[];
}

export type ItemUpdateRequest = ItemCreateRequest;
