/**
 * SESSION 1.2.3 - http Module
 * File 04: POST Request - Đọc Body từ Client
 *
 * Chạy: node 04-post-request.js
 * Test:
 *   # GET request
 *   curl http://localhost:3000/api/users
 *
 *   # POST request với JSON body
 *   curl -X POST http://localhost:3000/api/users \
 *     -H "Content-Type: application/json" \
 *     -d '{"name": "Leminho", "role": "developer"}'
 *
 *   # Hoặc dùng Postman
 */

import http from "http";

// ============================================
// HELPER FUNCTIONS
// ============================================

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

// ============================================
// IN-MEMORY DATABASE
// ============================================
let users = [{ id: 1, name: "John", role: "designer" }];
let nextId = 2;

// ============================================
// SERVER
// ============================================
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  console.log(`[${method}] ${path}`);

  // ============================================
  // GET /api/users - List all users
  // ============================================
  if (method === "GET" && path === "/api/users") {
    sendJSON(res, 200, {
      success: true,
      count: users.length,
      data: users,
    });
    return;
  }

  // ============================================
  // POST /api/users - Create new user
  // ============================================
  if (method === "POST" && path === "/api/users") {
    // Body từ POST request là STREAM
    // Phải đọc từng chunk rồi ghép lại

    let body = "";

    // Event 'data' - nhận từng chunk
    req.on("data", (chunk) => {
      body += chunk.toString();
      console.log("Received chunk:", chunk.length, "bytes");
    });

    // Event 'end' - đã nhận hết body
    req.on("end", () => {
      console.log("Full body:", body);

      try {
        // Parse JSON
        const data = JSON.parse(body);

        // Validate
        if (!data.name) {
          sendJSON(res, 400, {
            success: false,
            error: "Name is required",
          });
          return;
        }

        // Create user
        const newUser = {
          id: nextId++,
          name: data.name,
          role: data.role || "user",
        };

        users.push(newUser);

        // Response với status 201 (Created)
        sendJSON(res, 201, {
          success: true,
          message: "User created successfully",
          data: newUser,
        });
      } catch (error) {
        // JSON parse error
        sendJSON(res, 400, {
          success: false,
          error: "Invalid JSON: " + error.message,
        });
      }

      console.log(data);
    });

    return;
  }

  // ============================================
  // DELETE /api/users/:id - Delete user
  // ============================================
  if (method === "DELETE" && path.startsWith("/api/users/")) {
    const id = parseInt(path.split("/")[3]);
    const index = users.findIndex((u) => u.id === id);

    if (index !== -1) {
      const deleted = users.splice(index, 1)[0];
      sendJSON(res, 200, {
        success: true,
        message: "User deleted",
        data: deleted,
      });
    } else {
      sendJSON(res, 404, {
        success: false,
        error: `User with id ${id} not found`,
      });
    }
    return;
  }

  // ============================================
  // 404 NOT FOUND
  // ============================================
  sendJSON(res, 404, {
    success: false,
    error: "Not Found",
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log("\nAPI Endpoints:");
  console.log("  GET    /api/users      - List all users");
  console.log("  POST   /api/users      - Create user (JSON body)");
  console.log("  DELETE /api/users/:id  - Delete user by ID");
  console.log("\nTest POST:");
  console.log(`  curl -X POST http://localhost:${PORT}/api/users \\`);
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"name": "Leminho", "role": "developer"}\'');
});
