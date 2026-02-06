/**
 * 02-layer-based/src/routes/user.routes.ts
 *
 * Route definitions cho User
 * Map URL patterns với Controller methods
 */

import http from 'http';
import { UserController } from '../controllers/user.controller';

/**
 * Xử lý tất cả user-related routes
 * @returns true nếu route được handle, false nếu không match
 */
export async function handleUserRoutes(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string
): Promise<boolean> {
  const method = req.method || 'GET';

  // GET /users - Lấy tất cả users
  if (method === 'GET' && pathname === '/users') {
    await UserController.getAll(req, res);
    return true;
  }

  // Pattern matching cho /users/:id
  const userIdMatch = pathname.match(/^\/users\/(\d+)$/);

  if (userIdMatch) {
    const id = parseInt(userIdMatch[1], 10);

    // GET /users/:id
    if (method === 'GET') {
      await UserController.getById(req, res, id);
      return true;
    }

    // PUT /users/:id
    if (method === 'PUT') {
      await UserController.update(req, res, id);
      return true;
    }

    // DELETE /users/:id
    if (method === 'DELETE') {
      await UserController.delete(req, res, id);
      return true;
    }
  }

  // POST /users - Tạo user mới
  if (method === 'POST' && pathname === '/users') {
    await UserController.create(req, res);
    return true;
  }

  // Không match route nào
  return false;
}
