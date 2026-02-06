/**
 * 03-feature-based/src/products/product.routes.ts
 */

import http from 'http';
import { ProductController } from './product.controller';

export async function handleProductRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string
): Promise<boolean> {
  const method = req.method || 'GET';

  if (method === 'GET' && pathname === '/products') {
    await ProductController.getAll(req, res);
    return true;
  }

  const idMatch = pathname.match(/^\/products\/(\d+)$/);
  if (idMatch) {
    const id = parseInt(idMatch[1], 10);

    if (method === 'GET') {
      await ProductController.getById(req, res, id);
      return true;
    }
    if (method === 'PUT') {
      await ProductController.update(req, res, id);
      return true;
    }
    if (method === 'DELETE') {
      await ProductController.delete(req, res, id);
      return true;
    }
  }

  if (method === 'POST' && pathname === '/products') {
    await ProductController.create(req, res);
    return true;
  }

  return false;
}
