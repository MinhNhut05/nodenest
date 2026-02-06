/**
 * SESSION 1.2.3 - http Module
 * File 01: HTTP Server Cơ Bản
 *
 * Chạy: node 01-basic-server.js
 * Test: Mở browser http://localhost:3000
 *       Hoặc: curl http://localhost:3000
 */

import http from 'http';

// ============================================
// 1. TẠO SERVER ĐƠN GIẢN
// ============================================

console.log('=== HTTP Server Demo ===\n');

// http.createServer(callback) tạo server
// callback được gọi MỖI KHI có request đến
const server = http.createServer((req, res) => {
  // req = IncomingMessage - thông tin từ client
  // res = ServerResponse - để gửi response về client

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // ============================================
  // 2. RESPONSE OBJECT (res)
  // ============================================

  // Cách 1: Riêng lẻ
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain');
  // res.end('Hello World!');

  // Cách 2: Gộp với writeHead (phổ biến hơn)
  res.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8'
  });

  // Gửi body và KẾT THÚC response
  res.end(`
    <html>
      <head><title>Node.js Server</title></head>
      <body>
        <h1>🎉 Hello Leminho!</h1>
        <p>Server đang chạy với Node.js</p>
        <p>Method: ${req.method}</p>
        <p>URL: ${req.url}</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      </body>
    </html>
  `);

  // QUAN TRỌNG: Phải gọi res.end() để kết thúc response
  // Nếu không, client sẽ chờ mãi!
});

// ============================================
// 3. LISTEN - Bắt đầu lắng nghe
// ============================================

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server đang chạy tại: http://localhost:${PORT}/`);
  console.log('Nhấn Ctrl+C để dừng server\n');
  console.log('--- Request logs ---');
});

// ============================================
// 4. XỬ LÝ LỖI
// ============================================

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} đang được sử dụng!`);
    console.error('Hãy thử port khác hoặc dừng process đang dùng port này.');
  } else {
    console.error('Server error:', error.message);
  }
});
