/**
 * ROUTES INDEX
 * Gom tất cả routes lại và đăng ký vào router
 */

import { registerUserRoutes } from "./users.js";
import { registerPostRoutes } from "./posts.js";
import { sendJson } from "../utils/helpers.js";

/**
 * Đăng ký tất cả routes
 */
export function registerAllRoutes(router) {
  // Route trang chủ
  router.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <h1>🚀 Mini Router - Giống Express.js</h1>
      <p>Đây là router tự build từ đầu, không dùng Express!</p>

      <h2>📌 User API:</h2>
      <ul>
        <li><strong>GET</strong> <a href="/api/users">/api/users</a> - Lấy tất cả users</li>
        <li><strong>GET</strong> <a href="/api/users/1">/api/users/:id</a> - Lấy 1 user</li>
        <li><strong>POST</strong> /api/users - Tạo user mới</li>
        <li><strong>PUT</strong> /api/users/:id - Cập nhật user</li>
        <li><strong>DELETE</strong> /api/users/:id - Xóa user</li>
      </ul>

      <h2>📌 Post API:</h2>
      <ul>
        <li><strong>GET</strong> <a href="/api/posts">/api/posts</a> - Lấy tất cả posts</li>
        <li><strong>GET</strong> <a href="/api/posts/1">/api/posts/:id</a> - Lấy 1 post</li>
        <li><strong>POST</strong> /api/posts - Tạo post mới</li>
        <li><strong>DELETE</strong> /api/posts/:id - Xóa post</li>
      </ul>

      <h2>🧪 Test với curl:</h2>
      <pre>
# GET users
curl http://localhost:3004/api/users

# POST user mới
curl -X POST http://localhost:3004/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John","email":"john@example.com"}'
      </pre>
    `);
  });

  // Đăng ký routes cho từng resource
  registerUserRoutes(router);
  registerPostRoutes(router);

  // Route health check (kiểm tra server còn sống không)
  router.get("/health", (req, res) => {
    sendJson(res, 200, {
      status: "OK",
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });
}
