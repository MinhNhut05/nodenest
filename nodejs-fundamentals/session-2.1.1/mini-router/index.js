/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         MINI ROUTER - ENTRY POINT                            ║
 * ║                                                                              ║
 * ║   Đây là file khởi động server                                               ║
 * ║   Cấu trúc giống dự án thật với nhiều files                                  ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Cách chạy:
 *   cd mini-router
 *   node index.js
 *
 * Hoặc từ folder cha:
 *   node mini-router/index.js
 */

import http from "http";
import { Router } from "./router.js";
import { registerAllRoutes } from "./routes/index.js";

// ════════════════════════════════════════════════════════════════════════════════
// KHỞI TẠO
// ════════════════════════════════════════════════════════════════════════════════

const PORT = 3004;

// 1. Tạo router instance
const router = new Router();

// 2. Đăng ký tất cả routes
registerAllRoutes(router);

// 3. Tạo HTTP server
const server = http.createServer((req, res) => {
  router.handle(req, res);
});

// 4. Start server
server.listen(PORT, () => {
  console.log("╔══════════════════════════════════════════════════════════╗");
  console.log("║           🚀 MINI ROUTER SERVER                          ║");
  console.log("╚══════════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`   Server đang chạy tại: http://localhost:${PORT}`);
  console.log("");
  console.log("   📁 Cấu trúc project:");
  console.log("   mini-router/");
  console.log("   ├── index.js         ← Entry point (file này)");
  console.log("   ├── router.js        ← Router class");
  console.log("   ├── routes/          ← Định nghĩa routes");
  console.log("   ├── handlers/        ← Xử lý logic");
  console.log("   ├── data/            ← Fake database");
  console.log("   └── utils/           ← Helper functions");
  console.log("");
  console.log("   📌 Endpoints:");
  console.log(`   GET    http://localhost:${PORT}/`);
  console.log(`   GET    http://localhost:${PORT}/api/users`);
  console.log(`   GET    http://localhost:${PORT}/api/users/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/users`);
  console.log(`   PUT    http://localhost:${PORT}/api/users/:id`);
  console.log(`   DELETE http://localhost:${PORT}/api/users/:id`);
  console.log(`   GET    http://localhost:${PORT}/api/posts`);
  console.log(`   GET    http://localhost:${PORT}/api/posts/:id`);
  console.log(`   POST   http://localhost:${PORT}/api/posts`);
  console.log(`   DELETE http://localhost:${PORT}/api/posts/:id`);
  console.log(`   GET    http://localhost:${PORT}/health`);
  console.log("");
  console.log("══════════════════════════════════════════════════════════════");
});
