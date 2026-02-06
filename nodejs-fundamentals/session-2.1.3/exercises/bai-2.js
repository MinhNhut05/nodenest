/**
 * Bài 2: Validate Contact Form
 *
 * Yêu cầu:
 * - Tạo endpoint POST /api/contact
 * - Parse JSON body: { "name": "...", "email": "...", "message": "..." }
 *
 * Validation rules:
 * - name: required, 2-50 ký tự
 * - email: required, đúng format email
 * - message: required, 10-500 ký tự
 *
 * Response:
 * - Success: 201 + { "success": true }
 * - Fail: 400 + { "success": false, "errors": [...] }
 *
 * Chạy: node bai-2.js
 * Test: POST http://localhost:3000/api/contact
 */

import http from "http";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateContact(data) {
  const errors = [];

  // Check name: required, 2-50 chars
  if (!data.name || !data.name.trim()) {
    errors.push("Name is required");
  } else if (data.name.length < 2 || data.name.length > 50) {
    errors.push("Name must be 2-50 characters");
  }

  // Check email: required, format
  if (!data.email || !data.email.trim()) {
    errors.push("Email is required");
  } else if (!emailRegex.test(data.email)) {
    errors.push("Invalid email format");
  }

  // Check message: required, 10-500 chars
  if (!data.message || !data.message.trim()) {
    errors.push("Message is required");
  } else if (data.message.length < 10 || data.message.length > 500) {
    errors.push("Message must be 10-500 characters");
  }

  return { valid: errors.length === 0, errors };
}

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === "POST" && url === "/api/contact") {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      const body = Buffer.concat(chunks).toString("utf-8");
      const data = JSON.parse(body);
      const validate = validateContact(data);

      if (!validate.valid) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, errors: validate.errors }));
        return;
      }

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  res.writeHead(404);
  res.end("Not Found");
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
