/**
 * BÀI TẬP 3: Mini REST API (CRUD)
 *
 * Yêu cầu: Tạo CRUD API cho products (in-memory)
 *
 * Cách chạy: node exercises/03-rest-api.js
 * Test với Postman:
 *   GET    /api/products      → Lấy tất cả products
 *   GET    /api/products/1    → Lấy product có id=1
 *   POST   /api/products      → Tạo product mới (gửi JSON body)
 *   DELETE /api/products/1    → Xóa product có id=1
 *
 * Expected:
 * =========
 * GET /api/products → { success: true, data: [...] }
 * POST /api/products với body { "name": "iPhone", "price": 999 }
 *   → { success: true, data: { id: 2, name: "iPhone", price: 999 } }
 */

import http from "http";

// Helper
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data, null, 2));
}

// In-memory database
let products = [{ id: 1, name: "Laptop", price: 1500 }];
let nextId = 2;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;
  const method = req.method;

  console.log(`[${method}] ${path}`);

  // GET /api/products - Lấy tất cả products
  if (method === "GET" && path === "/api/products") {
    sendJSON(res, 200, { success: true, data: products });
    return;  // ← QUAN TRỌNG: return để không chạy tiếp
  }

  // GET /api/products/:id - Lấy product theo id
  if (method === "GET" && path.startsWith("/api/products/")) {
    const id = parseInt(path.split("/")[3]);
    if (!id) {
      sendJSON(res, 404, { error: "Invalid ID" });
      return;
    }
    const product = products.find((p) => p.id === id);
    if (!product) {
      sendJSON(res, 404, { error: "Product not found" });
      return;
    }
    sendJSON(res, 200, { success: true, data: product });
    return;
  }

  // POST /api/products - Tạo product mới
  if (method === "POST" && path === "/api/products") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        if (!data.name) {
          sendJSON(res, 400, {
            success: false,
            error: "Name is required",
          });
          return;
        }
        const newProduct = {
          id: nextId++,
          name: data.name,
          price: data.price || 0,  // ← number, không phải string
        };
        products.push(newProduct);
        sendJSON(res, 201, {
          success: true,
          message: "Product created successfully",
          data: newProduct,  // ← Đúng tên biến
        });
      } catch (err) {
        sendJSON(res, 400, {
          success: false,
          error: "Invalid JSON: " + err.message,  // ← err, không phải error
        });
      }
    });
    return;
  }

  // DELETE /api/products/:id - Xóa product
  if (method === "DELETE" && path.startsWith("/api/products/")) {
    const id = parseInt(path.split("/")[3]);
    const index = products.findIndex((p) => p.id === id);  // ← p.id, không phải p[id]
    if (index !== -1) {
      const deleted = products.splice(index, 1)[0];  // ← splice, không phải slice
      sendJSON(res, 200, {
        success: true,
        message: "Product deleted",
        data: deleted,
      });
    } else {
      sendJSON(res, 404, {
        success: false,
        error: `Product with id ${id} not found`,
      });
    }
    return;
  }

  // 404 Not Found
  sendJSON(res, 404, { success: false, error: "Not Found" });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log("\nAPI Endpoints:");
  console.log("  GET    /api/products");
  console.log("  GET    /api/products/:id");
  console.log("  POST   /api/products");
  console.log("  DELETE /api/products/:id");
});
