/**
 * 03-feature-based/src/users/user.routes.ts
 *
 * User routes - Route definitions
 */

import http from 'http';
import { UserController } from './user.controller';

export async function handleUserRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string
): Promise<boolean> {
  const method = req.method || 'GET';

  if (method === 'GET' && pathname === '/users') {
    await UserController.getAll(req, res);
    return true;
  }

  const idMatch = pathname.match(/^\/users\/(\d+)$/);
  if (idMatch) {
    const id = parseInt(idMatch[1], 10);

    if (method === 'GET') {
      await UserController.getById(req, res, id);
      return true;
    }
    if (method === 'PUT') {
      await UserController.update(req, res, id);
      return true;
    }
    if (method === 'DELETE') {
      await UserController.delete(req, res, id);
      return true;
    }
  }

  if (method === 'POST' && pathname === '/users') {
    await UserController.create(req, res);
    return true;
  }

  return false;
}
