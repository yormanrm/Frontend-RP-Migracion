import { Category } from './category';

/**
 * Product model - represents a product from the API
 */
export type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
};