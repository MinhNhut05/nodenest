/**
 * 02-layer-based/src/index.ts
 *
 * Entry Point - Khởi động server
 *
 * File này chỉ làm 1 việc: start server
 * Tất cả setup đã được delegate cho các modules khác
 */

import http from 'http';
import { router } from './routes';

const PORT = process.env.PORT || 3000;

// Tạo HTTP server
const server = http.createServer((req, res) => {
  // Xử lý mọi request bằng router
  router(req, res).catch((error) => {
    console.error('Unhandled error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║         Layer-Based Structure Demo                 ║
╠════════════════════════════════════════════════════╣
║  Server running at http://localhost:${PORT}           ║
╠════════════════════════════════════════════════════╣
║  Endpoints:                                        ║
║  GET    /health         - Health check             ║
║  GET    /users          - Get all users            ║
║  GET    /users/:id      - Get user by ID           ║
║  POST   /users          - Create new user          ║
║  PUT    /users/:id      - Update user              ║
║  DELETE /users/:id      - Delete user              ║
╚════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
