/**
 * ROUTES INDEX
 *
 * TODO: Gom tất cả routes lại
 */

import { registerProductRoutes } from "./products.js";

export function registerAllRoutes(router) {
  // TODO: Đăng ký route trang chủ

  router.get("/", (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <h1>🛒 Products API</h1>
      <p>API quản lý sản phẩm</p>
      <ul>
        <li><a href="/api/products">/api/products</a></li>
        <li><a href="/api/products/1">/api/products/1</a></li>
        <li><a href="/api/products/category/phone">/api/products/category/phone</a></li>
      </ul>
    `);
  });

  // TODO: Đăng ký product routess
  registerProductRoutes(router);
}
