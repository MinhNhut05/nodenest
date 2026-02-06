/**
 * BÀI TẬP 2: JSON API Server
 *
 * Yêu cầu: Tạo API trả về JSON với routing
 *
 * Cách chạy: node exercises/02-json-api.js
 * Test với curl hoặc Postman:
 *   curl http://localhost:3000/api/info
 *   curl http://localhost:3000/api/time
 *   curl http://localhost:3000/unknown
 *
 * Expected output:
 * ================
 * GET /api/info → { "name": "My API", "version": "1.0.0", "author": "Leminho" }
 * GET /api/time → { "timestamp": 1234567890, "iso": "2026-01-25T..." }
 * GET /unknown  → 404 { "error": "Not Found" }
 */

import { error } from "console";
import http from "http";

// Helper function
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  console.log(`[${method}] ${path}`);

  // TODO 1: Route GET /api/info
  // Trả về: { name: "My API", version: "1.0.0", author: "Leminho" }
  // Gợi ý: if (method === 'GET' && path === '/api/info') { ... }
  if (method === "GET" && path === "/api/info") {
    sendJSON(res, 200, {
      name: "My API",
      version: "1.0.0",
      author: "Leminho",
    });
  }
  // TODO 2: Route GET /api/time
  // Trả về: { timestamp: Date.now(), iso: new Date().toISOString() }
  else if (method === "GET" && path === "/api/time") {
    sendJSON(res, 200, {
      timestamp: Date.now(),
      iso: new Date().toISOString(),
    });
  } else {
    sendJSON(res, 404, {
      error: "not found",
    });
  }

  // TODO 3: Route 404 cho các path không tồn tại
  // Trả về: { error: "Not Found" } với status 404
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log("\nTest:");
  console.log("  curl http://localhost:3000/api/info");
  console.log("  curl http://localhost:3000/api/time");
});
