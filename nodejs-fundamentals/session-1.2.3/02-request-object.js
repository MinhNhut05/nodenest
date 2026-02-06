/**
 * SESSION 1.2.3 - http Module
 * File 02: Request Object - Đọc thông tin từ Client
 *
 * Chạy: node 02-request-object.js
 * Test:
 *   curl http://localhost:3000/
 *   curl http://localhost:3000/users?name=Leminho&age=25
 *   curl -X POST http://localhost:3000/api/data
 */

import http from 'http';

const server = http.createServer((req, res) => {
  console.log('\n=== New Request ===');

  // ============================================
  // 1. METHOD - GET, POST, PUT, DELETE...
  // ============================================
  console.log('Method:', req.method);
  // GET, POST, PUT, DELETE, PATCH...

  // ============================================
  // 2. URL - Đường dẫn request
  // ============================================
  console.log('URL:', req.url);
  // Ví dụ: '/users?name=Leminho&age=25'

  // ============================================
  // 3. HEADERS - Metadata từ client
  // ============================================
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  // {
  //   "host": "localhost:3000",
  //   "user-agent": "curl/7.x",
  //   "accept": "*/*",
  //   "content-type": "application/json"  // nếu có
  // }

  // Lấy header cụ thể (tên header luôn lowercase)
  console.log('User-Agent:', req.headers['user-agent']);
  console.log('Content-Type:', req.headers['content-type'] || 'N/A');

  // ============================================
  // 4. PARSE URL - Tách pathname và query params
  // ============================================

  // Cách 1: Dùng URL constructor (recommended)
  const baseURL = `http://${req.headers.host}`;
  const url = new URL(req.url, baseURL);

  console.log('\n--- Parsed URL ---');
  console.log('Pathname:', url.pathname);        // '/users'
  console.log('Search:', url.search);            // '?name=Leminho&age=25'
  console.log('SearchParams:', url.searchParams); // URLSearchParams object

  // Lấy từng query param
  const name = url.searchParams.get('name');  // 'Leminho' hoặc null
  const age = url.searchParams.get('age');    // '25' hoặc null
  console.log(`Params: name=${name}, age=${age}`);

  // ============================================
  // 5. RESPONSE
  // ============================================
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Request received!',
    method: req.method,
    pathname: url.pathname,
    params: {
      name: name || 'N/A',
      age: age || 'N/A'
    }
  }, null, 2));
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log('\nTest với các lệnh sau:');
  console.log('  curl http://localhost:3000/');
  console.log('  curl "http://localhost:3000/users?name=Leminho&age=25"');
  console.log('  curl -X POST http://localhost:3000/api/data');
});
