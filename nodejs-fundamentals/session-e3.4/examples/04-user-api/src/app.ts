/**
 * 04-user-api/src/app.ts
 *
 * Application setup - Tạo và configure server
 * Tách riêng để có thể test dễ dàng
 */

import http from 'http';
import { router } from './routes';
import { sendError, HTTP_STATUS } from './utils/response';

/**
 * Create HTTP server với router
 */
export function createServer(): http.Server {
  const server = http.createServer(async (req, res) => {
    try {
      // CORS headers (cho development)
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      // Route request
      await router(req, res);
    } catch (error) {
      console.error('Unhandled error:', error);
      sendError(res, 'Internal Server Error', HTTP_STATUS.INTERNAL_ERROR);
    }
  });

  return server;
}
