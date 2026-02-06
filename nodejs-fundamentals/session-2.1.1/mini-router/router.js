/**
 * ROUTER CLASS
 * Tự build router giống Express.js
 */

export class Router {
  constructor() {
    // Mảng lưu tất cả routes
    this.routes = [];
  }

  /**
   * Đăng ký route GET
   * Ví dụ: router.get('/users', handler)
   */
  get(path, handler) {
    this.addRoute("GET", path, handler);
  }

  /**
   * Đăng ký route POST
   */
  post(path, handler) {
    this.addRoute("POST", path, handler);
  }

  /**
   * Đăng ký route PUT
   */
  put(path, handler) {
    this.addRoute("PUT", path, handler);
  }

  /**
   * Đăng ký route DELETE
   */
  delete(path, handler) {
    this.addRoute("DELETE", path, handler);
  }

  /**
   * Thêm route vào mảng routes
   * Convert path pattern thành regex
   *
   * Ví dụ:
   *   "/users"     → /^\/users$/
   *   "/users/:id" → /^\/users\/([^/]+)$/
   */
  addRoute(method, path, handler) {
    const paramNames = [];

    // Convert path thành regex
    // :id, :slug, :userId... → ([^/]+) và lưu tên param
    const regexPattern = path.replace(/:(\w+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)"; // Match mọi ký tự trừ "/"
    });

    const regex = new RegExp(`^${regexPattern}$`);

    this.routes.push({ method, regex, handler, paramNames });
  }

  /**
   * Xử lý request
   * Được gọi bởi http.createServer
   */
  handle(req, res) {
    // 1. Parse URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method;

    console.log(`[${method}] ${pathname}`);

    // 2. Tìm route match
    for (const route of this.routes) {
      // Kiểm tra method
      if (method !== route.method) continue;

      // Kiểm tra pathname match regex
      const match = pathname.match(route.regex);
      if (!match) continue;

      // 3. Extract params từ URL
      req.params = {};
      route.paramNames.forEach((name, index) => {
        const value = match[index + 1];
        // Convert sang number nếu được
        req.params[name] = /^\d+$/.test(value) ? parseInt(value, 10) : value;
      });

      // 4. Gắn query params
      req.query = Object.fromEntries(url.searchParams);

      console.log(`  → Matched: ${route.method} ${pathname}`);
      console.log(`  → Params:`, req.params);

      // 5. Gọi handler
      return route.handler(req, res);
    }

    // 6. Không tìm thấy route → 404
    console.log(`  → No route matched`);
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Route not found" }));
  }
}
