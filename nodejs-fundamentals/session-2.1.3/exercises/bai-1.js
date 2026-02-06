/**
 * Bài 1: Parse JSON cơ bản
 *
 * Yêu cầu:
 * - Tạo endpoint POST /api/message
 * - Parse JSON body: { "text": "Hello World" }
 * - Trả về: { "received": true, "message": "Hello World", "length": 11 }
 *
 * Chạy: node bai-1.js
 * Test: POST http://localhost:3000/api/message
 */

import http from "http";

const server = http.createServer((req, res) => {
  const { method, url } = req;
  if (method === "POST" && url === "/api/message") {
    const thunks = [];

    req.on("data", (thunk) => thunks.push(thunk));
    req.on("end", () => {
      const body = Buffer.concat(thunks).toString("utf-8");
      const data = JSON.parse(body);
      res.writeHead(200, { "content-type": "application/json" });
      res.end(
        JSON.stringify({
          received: true,
          message: data.text,
          length: data.text.length,
        }),
      );
    });
    return;
  }
  res.writeHead(404);
  res.end("Not Found");
  // TODO: Xử lý POST /api/message
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
