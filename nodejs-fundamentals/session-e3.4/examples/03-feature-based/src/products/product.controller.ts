/**
 * 03-feature-based/src/products/product.controller.ts
 */

import http from 'http';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './product.types';
import { sendSuccess, sendError, parseBody } from '../shared/utils/response';

export class ProductController {
  static async getAll(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      sendSuccess(res, ProductService.findAll());
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  static async getById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      sendSuccess(res, ProductService.findById(id));
    } catch (error) {
      const msg = (error as Error).message;
      sendError(res, msg, msg === 'Product not found' ? 404 : 500);
    }
  }

  static async create(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      const body = await parseBody<CreateProductDto>(req);
      if (!body.name || body.price === undefined) {
        sendError(res, 'Name and price are required', 400);
        return;
      }
      sendSuccess(res, ProductService.create(body), 201);
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  static async update(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      const body = await parseBody<UpdateProductDto>(req);
      sendSuccess(res, ProductService.update(id, body));
    } catch (error) {
      const msg = (error as Error).message;
      sendError(res, msg, msg === 'Product not found' ? 404 : 400);
    }
  }

  static async delete(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      ProductService.delete(id);
      sendSuccess(res, { message: 'Product deleted' });
    } catch (error) {
      const msg = (error as Error).message;
      sendError(res, msg, msg === 'Product not found' ? 404 : 500);
    }
  }
}
