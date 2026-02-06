/**
 * Main entry point - Khởi động server
 *
 * Chạy: node index.js
 */

import http from 'http';
import {
  handleHome,
  handleGetUsers,
  handleCreateUser,
  handleNotFound,
} from './routes.js';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  console.log(`${method} ${url}`);

  // Routing
  if (method === 'GET' && url === '/') {
    handleHome(req, res);
  } else if (method === 'GET' && url === '/api/users') {
    handleGetUsers(req, res);
  } else if (method === 'POST' && url === '/api/users') {
    handleCreateUser(req, res);
  } else {
    handleNotFound(req, res);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
