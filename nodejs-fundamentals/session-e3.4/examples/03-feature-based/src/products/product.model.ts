/**
 * 03-feature-based/src/products/product.model.ts
 */

import { Product, CreateProductDto, UpdateProductDto } from './product.types';

const products: Product[] = [
  { id: 1, name: 'Laptop', price: 999, description: 'High-end laptop', createdAt: new Date() },
  { id: 2, name: 'Mouse', price: 29, description: 'Wireless mouse', createdAt: new Date() },
];

let nextId = 3;

export class ProductModel {
  static findAll(): Product[] {
    return [...products];
  }

  static findById(id: number): Product | undefined {
    return products.find((p) => p.id === id);
  }

  static create(data: CreateProductDto): Product {
    const product: Product = {
      id: nextId++,
      name: data.name,
      price: data.price,
      description: data.description || '',
      createdAt: new Date(),
    };
    products.push(product);
    return product;
  }

  static update(id: number, data: UpdateProductDto): Product | undefined {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return undefined;
    products[index] = { ...products[index], ...data };
    return products[index];
  }

  static delete(id: number): boolean {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
  }
}
