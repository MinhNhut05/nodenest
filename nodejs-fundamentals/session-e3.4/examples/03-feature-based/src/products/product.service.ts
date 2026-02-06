/**
 * 03-feature-based/src/products/product.service.ts
 */

import { ProductModel } from './product.model';
import { Product, CreateProductDto, UpdateProductDto } from './product.types';

export class ProductService {
  static findAll(): Product[] {
    return ProductModel.findAll();
  }

  static findById(id: number): Product {
    const product = ProductModel.findById(id);
    if (!product) throw new Error('Product not found');
    return product;
  }

  static create(data: CreateProductDto): Product {
    if (data.price < 0) {
      throw new Error('Price must be positive');
    }
    return ProductModel.create(data);
  }

  static update(id: number, data: UpdateProductDto): Product {
    if (data.price !== undefined && data.price < 0) {
      throw new Error('Price must be positive');
    }
    const updated = ProductModel.update(id, data);
    if (!updated) throw new Error('Product not found');
    return updated;
  }

  static delete(id: number): void {
    if (!ProductModel.delete(id)) {
      throw new Error('Product not found');
    }
  }
}
