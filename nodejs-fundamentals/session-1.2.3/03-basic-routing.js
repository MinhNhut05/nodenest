/**
 * SESSION 1.2.3 - http Module
 * File 03: Basic Routing - Xử lý nhiều URL
 *
 * Chạy: node 03-basic-routing.js
 * Test:
 *   curl http://localhost:3000/
 *   curl http://localhost:3000/about
 *   curl http://localhost:3000/api/users
 *   curl http://localhost:3000/api/users/123
 *   curl http://localhost:3000/unknown
 */

import http from 'http';

// ============================================
// HELPER: Gửi JSON response
// ============================================
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

// ============================================
// HELPER: Gửi HTML response
// ============================================
function sendHTML(res, statusCode, html) {
  res.writeHead(statusCode, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

// ============================================
// FAKE DATA
// ============================================
const users = [
  { id: 1, name: 'Leminho', role: 'developer' },
  { id: 2, name: 'John', role: 'designer' },
  { id: 3, name: 'Alice', role: 'manager' }
];

// ============================================
// SERVER VỚI ROUTING
// ============================================
const server = http.createServer((req, res) => {
  // Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  console.log(`[${method}] ${path}`);

  // ============================================
  // ROUTE: GET /
  // ============================================
  if (method === 'GET' && path === '/') {
    sendHTML(res, 200, `
      <html>
        <head><title>Home</title></head>
        <body>
          <h1>🏠 Home Page</h1>
          <nav>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/api/users">API: Users</a></li>
            </ul>
          </nav>
        </body>
      </html>
    `);
    return;  // QUAN TRỌNG: return để không chạy tiếp
  }

  // ============================================
  // ROUTE: GET /about
  // ============================================
  if (method === 'GET' && path === '/about') {
    sendHTML(res, 200, `
      <html>
        <head><title>About</title></head>
        <body>
          <h1>ℹ️ About Page</h1>
          <p>This is a simple Node.js HTTP server.</p>
          <p>Built without any framework!</p>
          <a href="/">← Back to Home</a>
        </body>
      </html>
    `);
    return;
  }

  // ============================================
  // ROUTE: GET /api/users - List all users
  // ============================================
  if (method === 'GET' && path === '/api/users') {
    sendJSON(res, 200, {
      success: true,
      count: users.length,
      data: users
    });
    return;
  }

  // ============================================
  // ROUTE: GET /api/users/:id - Get user by ID
  // ============================================
  if (method === 'GET' && path.startsWith('/api/users/')) {
    // Lấy ID từ URL: /api/users/123 → '123'
    const id = parseInt(path.split('/')[3]);

    // Tìm user
    const user = users.find(u => u.id === id);

    if (user) {
      sendJSON(res, 200, {
        success: true,
        data: user
      });
    } else {
      sendJSON(res, 404, {
        success: false,
        error: `User with id ${id} not found`
      });
    }
    return;
  }

  // ============================================
  // ROUTE: GET /api/time - Current time
  // ============================================
  if (method === 'GET' && path === '/api/time') {
    sendJSON(res, 200, {
      success: true,
      data: {
        timestamp: Date.now(),
        iso: new Date().toISOString(),
        local: new Date().toLocaleString()
      }
    });
    return;
  }

  // ============================================
  // 404 NOT FOUND - Không match route nào
  // ============================================
  sendJSON(res, 404, {
    success: false,
    error: 'Not Found',
    path: path,
    availableRoutes: [
      'GET /',
      'GET /about',
      'GET /api/users',
      'GET /api/users/:id',
      'GET /api/time'
    ]
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('\nAvailable routes:');
  console.log('  GET /           - Home page');
  console.log('  GET /about      - About page');
  console.log('  GET /api/users  - List users (JSON)');
  console.log('  GET /api/users/:id - Get user by ID');
  console.log('  GET /api/time   - Current time');
});
