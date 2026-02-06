/**
 * 03-feature-based/src/products/product.types.ts
 *
 * Product types
 */

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  createdAt: Date;
}

export interface CreateProductDto {
  name: string;
  price: number;
  description?: string;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
}
