/**
 * 04-user-api/src/routes/user.routes.ts
 *
 * User route definitions
 */

import http from 'http';
import { UserController } from '../controllers/user.controller';

/**
 * Handle user routes
 * @returns true if handled, false otherwise
 */
export async function handleUserRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string
): Promise<boolean> {
  const method = req.method || 'GET';

  // GET /users - List all users
  if (method === 'GET' && pathname === '/users') {
    await UserController.getAll(req, res);
    return true;
  }

  // POST /users - Create user
  if (method === 'POST' && pathname === '/users') {
    await UserController.create(req, res);
    return true;
  }

  // Routes with :id parameter
  const idMatch = pathname.match(/^\/users\/(\d+)$/);
  if (idMatch) {
    const id = parseInt(idMatch[1], 10);

    switch (method) {
      case 'GET':
        await UserController.getById(req, res, id);
        return true;

      case 'PUT':
      case 'PATCH':
        await UserController.update(req, res, id);
        return true;

      case 'DELETE':
        await UserController.delete(req, res, id);
        return true;
    }
  }

  return false;
}
