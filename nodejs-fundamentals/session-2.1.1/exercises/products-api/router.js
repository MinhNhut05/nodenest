/**
 * ROUTER CLASS
 * (File này đã cho sẵn - không cần sửa)
 */

export class Router {
  constructor() {
    this.routes = [];
  }

  get(path, handler) {
    this.addRoute("GET", path, handler);
  }

  post(path, handler) {
    this.addRoute("POST", path, handler);
  }

  put(path, handler) {
    this.addRoute("PUT", path, handler);
  }

  delete(path, handler) {
    this.addRoute("DELETE", path, handler);
  }

  addRoute(method, path, handler) {
    const paramNames = [];
    const regexPattern = path.replace(/:(\w+)/g, (match, paramName) => {
      paramNames.push(paramName);
      return "([^/]+)";
    });
    const regex = new RegExp(`^${regexPattern}$`);
    this.routes.push({ method, regex, handler, paramNames });
  }

  handle(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method;

    console.log(`[${method}] ${pathname}`);

    for (const route of this.routes) {
      if (method !== route.method) continue;

      const match = pathname.match(route.regex);
      if (!match) continue;

      req.params = {};
      route.paramNames.forEach((name, index) => {
        const value = match[index + 1];
        req.params[name] = /^\d+$/.test(value) ? parseInt(value, 10) : value;
      });

      req.query = Object.fromEntries(url.searchParams);

      console.log(`  → Matched: ${route.method} ${pathname}`);
      return route.handler(req, res);
    }

    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Route not found" }));
  }
}
