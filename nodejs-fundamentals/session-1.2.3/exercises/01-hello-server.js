/**
 * BÀI TẬP 1: Hello Server
 *
 * Yêu cầu: Tạo HTTP server đơn giản
 *
 * Cách chạy: node exercises/01-hello-server.js
 * Test: Mở browser http://localhost:3000
 *
 * Expected output:
 * ================
 * Browser hiển thị: "Hello Leminho! Server is running."
 */

import http from "http";

// TODO 1: Tạo server với http.createServer()
// Gợi ý: const server = http.createServer((req, res) => { ... })
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Context-Type": "text/plain" });
  res.end("Hello Leminho! Server is running.");
}); // ← Sửa dòng này

// Bên trong callback:
// TODO 2: Set status 200 và Content-Type là text/plain
// Gợi ý: res.writeHead(200, { 'Content-Type': 'text/plain' })

// TODO 3: Gửi response "Hello Leminho! Server is running."
// Gợi ý: res.end('Hello Leminho! Server is running.')

// TODO 4: Listen trên port 3000
// Gợi ý: server.listen(3000, () => { console.log('Server running...') })
const PORT = 3000;

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
console.log("Hoàn thành các TODO rồi chạy lại file này!");
