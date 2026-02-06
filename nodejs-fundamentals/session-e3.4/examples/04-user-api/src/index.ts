/**
 * 04-user-api/src/index.ts
 *
 * Entry Point - Start server
 * File này chỉ làm 1 việc: khởi động server
 */

import { createServer } from './app';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || 'localhost';

// Create and start server
const server = createServer();

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                     USER API v1.0.0                      ║
╠══════════════════════════════════════════════════════════╣
║  Server: http://${HOST}:${PORT}                              ║
╠══════════════════════════════════════════════════════════╣
║  Endpoints:                                              ║
║                                                          ║
║  GET     /              API info                         ║
║  GET     /health        Health check                     ║
║                                                          ║
║  GET     /users         List all users                   ║
║  GET     /users/:id     Get user by ID                   ║
║  POST    /users         Create new user                  ║
║  PUT     /users/:id     Update user                      ║
║  DELETE  /users/:id     Delete user                      ║
╠══════════════════════════════════════════════════════════╣
║  Structure: Layer-based (controllers/services/models)    ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
const shutdown = (signal: string) => {
  console.log(`\\n${signal} received. Closing server...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
