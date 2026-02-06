/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     04 - ROUTER PATTERN DEMO                                 ║
 * ║                     ⭐⭐⭐ PHẦN QUAN TRỌNG NHẤT ⭐⭐⭐                        ║
 * ║                     Hay hỏi phỏng vấn: "Tự build router như thế nào?"        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Mục tiêu:
 * - Xây dựng Router từ đầu (không dùng Express)
 * - Hiểu cách Express.js hoạt động bên trong
 * - Method-based routing (GET, POST, PUT, DELETE cùng 1 URL)
 *
 * Cách chạy:
 *   node 04-router-pattern.js
 */

import http from "http";

const PORT = 3003;

// ════════════════════════════════════════════════════════════════════════════════
// FAKE DATABASE
// ════════════════════════════════════════════════════════════════════════════════

let users = [
  { id: 1, name: "Leminho", email: "leminho@example.com" },
  { id: 2, name: "Alice", email: "alice@example.com" },
];

let nextId = 3; // ID cho user mới

// ════════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

// Gửi JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data, null, 2));
}

// Parse body từ POST/PUT request
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    // Lắng nghe data chunks
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    // Khi nhận xong toàn bộ data
    req.on("end", () => {
      try {
        // Parse JSON string thành object
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });

    req.on("error", reject);
  });
}

// ════════════════════════════════════════════════════════════════════════════════
// HANDLER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

// GET / - Trang chủ
function handleHome(req, res) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <h1>🚀 Router Pattern Demo</h1>
    <p>Đây là demo xây dựng Router từ đầu, giống cách Express.js hoạt động.</p>
    <h2>API Endpoints:</h2>
    <ul>
      <li><strong>GET</strong> <a href="/api/users">/api/users</a> - Lấy tất cả users</li>
      <li><strong>GET</strong> /api/users/:id - Lấy 1 user</li>
      <li><strong>POST</strong> /api/users - Tạo user mới</li>
      <li><strong>PUT</strong> /api/users/:id - Cập nhật user</li>
      <li><strong>DELETE</strong> /api/users/:id - Xóa user</li>
    </ul>
    <p>Dùng Postman hoặc curl để test POST/PUT/DELETE</p>
  `);
}

// GET /api/users - Lấy tất cả users
function handleGetUsers(req, res) {
  sendJson(res, 200, { success: true, data: users });
}

// GET /api/users/:id - Lấy 1 user
function handleGetUserById(req, res) {
  const id = req.params.id;
  const user = users.find((u) => u.id === id);

  if (user) {
    sendJson(res, 200, { success: true, data: user });
  } else {
    sendJson(res, 404, { success: false, error: `User id=${id} không tồn tại` });
  }
}

// POST /api/users - Tạo user mới
async function handleCreateUser(req, res) {
  try {
    const body = await parseBody(req);

    if (!body.name || !body.email) {
      return sendJson(res, 400, { success: false, error: "Thiếu name hoặc email" });
    }

    const newUser = {
      id: nextId++,
      name: body.name,
      email: body.email,
    };

    users.push(newUser);
    sendJson(res, 201, { success: true, message: "Tạo user thành công", data: newUser });
  } catch (error) {
    sendJson(res, 400, { success: false, error: error.message });
  }
}

// PUT /api/users/:id - Cập nhật user
async function handleUpdateUser(req, res) {
  try {
    const id = req.params.id;
    const body = await parseBody(req);

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return sendJson(res, 404, { success: false, error: `User id=${id} không tồn tại` });
    }

    // Cập nhật user
    users[userIndex] = { ...users[userIndex], ...body };
    sendJson(res, 200, { success: true, message: "Cập nhật thành công", data: users[userIndex] });
  } catch (error) {
    sendJson(res, 400, { success: false, error: error.message });
  }
}

// DELETE /api/users/:id - Xóa user
function handleDeleteUser(req, res) {
  const id = req.params.id;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return sendJson(res, 404, { success: false, error: `User id=${id} không tồn tại` });
  }

  const deletedUser = users.splice(userIndex, 1)[0];
  sendJson(res, 200, { success: true, message: "Xóa thành công", data: deletedUser });
}

// 404 Not Found
function handleNotFound(req, res) {
  sendJson(res, 404, { success: false, error: "Route không tồn tại" });
}

// 405 Method Not Allowed
function handleMethodNotAllowed(req, res, allowedMethods) {
  res.writeHead(405, {
    "Content-Type": "application/json",
    Allow: allowedMethods.join(", "),
  });
  res.end(JSON.stringify({ success: false, error: "Method không được phép" }));
}

// ════════════════════════════════════════════════════════════════════════════════
// ROUTER OBJECT PATTERN
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Định nghĩa routes với format:
 * [method, regex, handler, paramNames]
 *
 * - method: HTTP method (GET, POST, PUT, DELETE)
 * - regex: Regular expression để match pathname
 * - handler: Function xử lý request
 * - paramNames: Tên các params trong URL (để gắn vào req.params)
 */
const routes = [
  // Static routes
  ["GET", /^\/$/, handleHome, []],
  ["GET", /^\/api\/users$/, handleGetUsers, []],
  ["POST", /^\/api\/users$/, handleCreateUser, []],

  // Dynamic routes
  // /^\/api\/users\/(\d+)$/ → match "/api/users/123", capture "123"
  ["GET", /^\/api\/users\/(\d+)$/, handleGetUserById, ["id"]],
  ["PUT", /^\/api\/users\/(\d+)$/, handleUpdateUser, ["id"]],
  ["DELETE", /^\/api\/users\/(\d+)$/, handleDeleteUser, ["id"]],
];

/**
 * ROUTER FUNCTION
 *
 * Flow hoạt động:
 * 1. Lấy method và pathname từ request
 * 2. Lặp qua từng route trong mảng routes
 * 3. Kiểm tra method có khớp không
 * 4. Kiểm tra pathname có match regex không
 * 5. Nếu match → extract params → gọi handler
 * 6. Nếu không match route nào → 404
 */
function router(req, res) {
  // 1. Parse URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const method = req.method;

  console.log(`[${method}] ${pathname}`);

  // 2. Lặp qua từng route để tìm match
  for (const [routeMethod, regex, handler, paramNames] of routes) {
    // 3. Kiểm tra pathname có match regex không
    const match = pathname.match(regex);

    if (!match) continue; // Không match → thử route tiếp theo

    // 4. Pathname match! Kiểm tra method
    if (method !== routeMethod) {
      // URL đúng nhưng method sai → tiếp tục tìm (có thể có route khác cùng URL)
      continue;
    }

    // 5. Match cả pathname và method → Extract params
    req.params = {};
    paramNames.forEach((name, index) => {
      // match[0] = toàn bộ chuỗi match
      // match[1], match[2]... = các captured groups
      const value = match[index + 1];
      req.params[name] = parseInt(value, 10) || value; // Convert số nếu được
    });

    // 6. Gắn query params vào req
    req.query = Object.fromEntries(url.searchParams);

    // 7. Gọi handler
    console.log(`  → Matched: ${routeMethod} ${regex}`);
    console.log(`  → Params:`, req.params);
    return handler(req, res);
  }

  // 8. Không tìm thấy route nào match → 404
  console.log(`  → No route matched`);
  handleNotFound(req, res);
}

// ════════════════════════════════════════════════════════════════════════════════
// CREATE SERVER
// ════════════════════════════════════════════════════════════════════════════════

const server = http.createServer(router);

server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log("---");
  console.log("📌 Test với curl hoặc Postman:");
  console.log("");
  console.log("# Lấy tất cả users");
  console.log(`curl http://localhost:${PORT}/api/users`);
  console.log("");
  console.log("# Lấy 1 user");
  console.log(`curl http://localhost:${PORT}/api/users/1`);
  console.log("");
  console.log("# Tạo user mới");
  console.log(`curl -X POST http://localhost:${PORT}/api/users -H "Content-Type: application/json" -d '{"name":"Bob","email":"bob@example.com"}'`);
  console.log("");
  console.log("# Cập nhật user");
  console.log(`curl -X PUT http://localhost:${PORT}/api/users/1 -H "Content-Type: application/json" -d '{"name":"Leminho Updated"}'`);
  console.log("");
  console.log("# Xóa user");
  console.log(`curl -X DELETE http://localhost:${PORT}/api/users/2`);
  console.log("---");
});
