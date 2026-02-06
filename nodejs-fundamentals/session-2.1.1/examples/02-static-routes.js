/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     02 - STATIC ROUTES DEMO                                  ║
 * ║                                                                              ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Mục tiêu:
 * - Tạo server xử lý các route cố định (static routes)
 * - Tách biệt logic xử lý (Handler Functions)
 * - Trả về các loại content khác nhau (HTML, JSON, Text)
 *
 * Cách chạy:
 *   node 02-static-routes.js
 */

import http from "http";

const PORT = 3001;

// ════════════════════════════════════════════════════════════════════════════════
// PHẦN 1: HANDLER FUNCTIONS (Tách logic ra khỏi router)
// ════════════════════════════════════════════════════════════════════════════════

// 1. Home page - Trả về HTML
function handleHome(req, res) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <h1>🏠 Trang chủ</h1>
    <p>Chào mừng đến với Node.js Routing!</p>
    <ul>
      <li><a href="/about">Về chúng tôi (/about)</a></li>
      <li><a href="/api/users">Danh sách Users (JSON) (/api/users)</a></li>
      <li><a href="/contact">Liên hệ (Text) (/contact)</a></li>
      <li><a href="/not-exist">Trang không tồn tại (404)</a></li>
    </ul>
  `);
}

// 2. About page - Trả về HTML
function handleAbout(req, res) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <h1>ℹ️ Về chúng tôi</h1>
    <p>Chúng tôi là những lập trình viên đam mê Node.js.</p>
    <a href="/">Quay lại trang chủ</a>
  `);
}

// 3. API Users - Trả về JSON (thường dùng cho Backend)
function handleApiUsers(req, res) {
  const users = [
    { id: 1, name: "Leminho", role: "Developer" },
    { id: 2, name: "Claude", role: "AI Assistant" },
    { id: 3, name: "Node.js", role: "Runtime" },
  ];

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users, null, 2)); // Pretty print JSON
}

// 4. Contact page - Trả về Plain Text
function handleContact(req, res) {
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("📧 Email: contact@example.com\n📞 Phone: 0123-456-789");
}

// 5. 404 Not Found - Xử lý khi không tìm thấy route
function handleNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <h1>❌ 404 - Không tìm thấy trang</h1>
    <p>Đường dẫn <code>${req.url}</code> không tồn tại trên hệ thống.</p>
    <a href="/">Quay lại trang chủ</a>
  `);
}

// ════════════════════════════════════════════════════════════════════════════════
// PHẦN 2: CREATE SERVER & ROUTING LOGIC
// ════════════════════════════════════════════════════════════════════════════════

const server = http.createServer((req, res) => {
  // 1. Parse URL để lấy pathname
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log(`[REQUEST] ${req.method} ${pathname}`);

  // 2. Routing (Dùng if-else đơn giản cho static routes)
  if (pathname === "/") {
    handleHome(req, res);
  } else if (pathname === "/about") {
    handleAbout(req, res);
  } else if (pathname === "/api/users") {
    handleApiUsers(req, res);
  } else if (pathname === "/contact") {
    handleContact(req, res);
  } else {
    // Wildcard / Default case
    handleNotFound(req, res);
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log("---");
  console.log("👉 Thử truy cập các routes:");
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/about`);
  console.log(`   http://localhost:${PORT}/api/users`);
  console.log(`   http://localhost:${PORT}/contact`);
  console.log(`   http://localhost:${PORT}/b linh-tinh (test 404)`);
});
