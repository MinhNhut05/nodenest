/**
 * Bài 3: Multi Content-Type
 *
 * Yêu cầu:
 * - Tạo endpoint POST /api/login
 * - Nhận được CẢ 2 loại Content-Type:
 *   + application/json
 *   + application/x-www-form-urlencoded
 *
 * Body: { "email": "...", "password": "..." }
 *
 * Validation:
 * - email: required
 * - password: min 6 ký tự
 *
 * Response:
 * - Success: 200 + { "success": true, "parsedFrom": "json" hoặc "form" }
 * - Fail: 400 + { "success": false, "errors": [...] }
 *
 * Chạy: node bai-3.js
 * Test: POST http://localhost:3000/api/login
 */

import http from "http";

function parseBody(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers["content-type"] || "";
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const body = Buffer.concat(chunks).toString("utf-8");
      if (!body.trim()) {
        reject({ status: 400, message: "Request body is empty" });
        return;
      }
      try {
        if (contentType.includes("application/json")) {
          resolve({ type: "json", data: JSON.parse(body) });
        } else if (contentType.includes("application/x-www-form-urlencoded")) {
          const params = new URLSearchParams(body);
          const data = Object.fromEntries(params);
          resolve({ type: "form", data });
        } else {
          reject({ status: 415, message: "Unsupported Content-Type" });
        }
      } catch (error) {
        reject({ status: 400, message: "Parse error: " + error.message });
      }
    });
    req.on("error", (error) => {
      reject({ status: 500, message: "Error: " + error.message });
    });
  });
}

function validateLogin(data) {
  const errors = [];
  if (!data.email || !data.email.trim()) {
    errors.push("Email is required");
  }
  if (!data.password) {
    errors.push("Password is required");
  } else if (data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }
  return { valid: errors.length === 0, errors };
}

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  if (method === "POST" && url === "/api/login") {
    try {
      const { type, data } = await parseBody(req);
      const validate = validateLogin(data);
      if (!validate.valid) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, errors: validate.errors }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true, parsedFrom: type }));
    } catch (error) {
      res.writeHead(error.status || 500, {
        "Content-Type": "application/json",
      });
      res.end(JSON.stringify({ success: false, error: error.message }));
    }
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
