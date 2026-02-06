/**
 * 04-user-api/src/routes/index.ts
 *
 * Main router - combines all route modules
 */

import http from 'http';
import { parse } from 'url';
import { handleUserRoutes } from './user.routes';
import { sendSuccess, sendError, HTTP_STATUS } from '../utils/response';

/**
 * Main router
 */
export async function router(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const { pathname } = parse(req.url || '', true);
  const method = req.method || 'GET';

  // Request logging
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${pathname}`);

  // Root endpoint
  if (pathname === '/' && method === 'GET') {
    sendSuccess(res, {
      name: 'User API',
      version: '1.0.0',
      endpoints: {
        users: '/users',
        health: '/health',
      },
    });
    return;
  }

  // Health check
  if (pathname === '/health' && method === 'GET') {
    sendSuccess(res, {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // User routes
  if (pathname?.startsWith('/users')) {
    const handled = await handleUserRoutes(req, res, pathname);
    if (handled) return;
  }

  // 404 Not Found
  sendError(res, `Route ${method} ${pathname} not found`, HTTP_STATUS.NOT_FOUND);
}
