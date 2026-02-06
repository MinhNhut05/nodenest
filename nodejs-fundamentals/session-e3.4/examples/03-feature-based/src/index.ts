/**
 * 03-feature-based/src/index.ts
 *
 * Entry point - Feature-based structure
 */

import http from 'http';
import { parse } from 'url';
import { handleUserRoutes } from './users';
import { handleProductRoutes } from './products';
import { sendError } from './shared/utils/response';

const PORT = process.env.PORT || 3001;

async function router(
  req: http.IncomingMessage,
  res: http.ServerResponse
): Promise<void> {
  const { pathname } = parse(req.url || '', true);
  const method = req.method || 'GET';

  console.log(`${method} ${pathname}`);

  // Health check
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  // Feature routes
  if (pathname?.startsWith('/users')) {
    if (await handleUserRoutes(req, res, pathname)) return;
  }

  if (pathname?.startsWith('/products')) {
    if (await handleProductRoutes(req, res, pathname)) return;
  }

  // 404
  sendError(res, 'Route not found', 404);
}

const server = http.createServer((req, res) => {
  router(req, res).catch((err) => {
    console.error('Error:', err);
    sendError(res, 'Internal Server Error', 500);
  });
});

server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║       Feature-Based Structure Demo                 ║
╠════════════════════════════════════════════════════╣
║  Server running at http://localhost:${PORT}           ║
╠════════════════════════════════════════════════════╣
║  User Endpoints:                                   ║
║  GET/POST       /users                             ║
║  GET/PUT/DELETE /users/:id                         ║
╠════════════════════════════════════════════════════╣
║  Product Endpoints:                                ║
║  GET/POST       /products                          ║
║  GET/PUT/DELETE /products/:id                      ║
╚════════════════════════════════════════════════════╝
  `);
});
