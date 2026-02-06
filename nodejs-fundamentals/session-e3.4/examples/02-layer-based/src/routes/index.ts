/**
 * 02-layer-based/src/routes/index.ts
 *
 * Main router - Combine tất cả routes
 * Entry point cho routing logic
 */

import http from 'http';
import { parse } from 'url';
import { handleUserRoutes } from './user.routes';
import { sendError } from '../utils/response';

/**
 * Main router function
 * Điều hướng request đến đúng route handler
 */
export async function router(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const { pathname } = parse(req.url || '', true);
  const method = req.method || 'GET';

  // Log request
  console.log(`${method} ${pathname}`);

  // Health check endpoint
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Try user routes
  if (pathname?.startsWith('/users')) {
    const handled = await handleUserRoutes(req, res, pathname);
    if (handled) return;
  }

  // Có thể thêm các routes khác ở đây:
  // if (pathname?.startsWith('/products')) {
  //   const handled = await handleProductRoutes(req, res, pathname);
  //   if (handled) return;
  // }

  // 404 Not Found
  sendError(res, 'Route not found', 404);
}
