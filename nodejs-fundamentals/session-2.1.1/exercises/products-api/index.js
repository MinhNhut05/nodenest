/**
 * ENTRY POINT
 *
 * TODO: Khởi động server
 *
 * Gợi ý:
 * 1. Import http
 * 2. Import Router từ "./router.js"
 * 3. Import registerAllRoutes từ "./routes/index.js"
 * 4. Tạo router instance
 * 5. Đăng ký routes
 * 6. Tạo server với http.createServer
 * 7. Lắng nghe ở PORT 3005
 */

// TODO: Viết code ở đây
//
import http from "http";
import { Router } from "./router.js";
import { registerAllRoutes } from "./routes/index.js";

const PORT = 3005;

const router = new Router();
registerAllRoutes(router);

const server = http.createServer((req, res) => {
  router.handle(req, res);
});

server.listen(PORT, () => {
  console.log(`🛒 Products API running at http://localhost:${PORT}`);
});
