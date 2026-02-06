/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     03 - DYNAMIC ROUTES DEMO                                 ║
 * ║                     ⭐ Phần quan trọng - Hay hỏi phỏng vấn                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Mục tiêu:
 * - Hiểu cách xử lý dynamic routes: /users/:id, /posts/:slug
 * - 3 cách extract params: split(), regex, slice()
 * - Kết hợp static + dynamic routes
 *
 * Cách chạy:
 *   node 03-dynamic-routes.js
 */

import http from "http";

const PORT = 3002;

// ════════════════════════════════════════════════════════════════════════════════
// FAKE DATABASE (Giả lập dữ liệu)
// ════════════════════════════════════════════════════════════════════════════════

const users = [
  { id: 1, name: "Leminho", email: "leminho@example.com" },
  { id: 2, name: "Alice", email: "alice@example.com" },
  { id: 3, name: "Bob", email: "bob@example.com" },
];

const posts = [
  { id: 1, slug: "hello-world", title: "Hello World", content: "Bài viết đầu tiên" },
  { id: 2, slug: "learn-nodejs", title: "Learn Node.js", content: "Học Node.js từ cơ bản" },
  { id: 3, slug: "routing-patterns", title: "Routing Patterns", content: "Các pattern routing" },
];

// ════════════════════════════════════════════════════════════════════════════════
// HANDLER FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

// Trang chủ - Hướng dẫn test
function handleHome(req, res) {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`
    <h1>🚀 Dynamic Routes Demo</h1>
    <h2>Static Routes:</h2>
    <ul>
      <li><a href="/users">/users</a> - Danh sách tất cả users</li>
      <li><a href="/posts">/posts</a> - Danh sách tất cả posts</li>
    </ul>
    <h2>Dynamic Routes (thử thay đổi số ID):</h2>
    <ul>
      <li><a href="/users/1">/users/1</a> - User có id=1</li>
      <li><a href="/users/2">/users/2</a> - User có id=2</li>
      <li><a href="/users/999">/users/999</a> - User không tồn tại (test 404)</li>
      <li><a href="/posts/hello-world">/posts/hello-world</a> - Post theo slug</li>
      <li><a href="/posts/learn-nodejs">/posts/learn-nodejs</a> - Post theo slug</li>
    </ul>
  `);
}

// GET /users - Lấy tất cả users (Static Route)
function handleGetUsers(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(users, null, 2));
}

// GET /users/:id - Lấy 1 user theo ID (Dynamic Route)
function handleGetUserById(req, res, userId) {
  // Tìm user trong "database"
  const user = users.find((u) => u.id === userId);

  if (user) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(user, null, 2));
  } else {
    // User không tồn tại
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `User với id=${userId} không tồn tại` }));
  }
}

// GET /posts - Lấy tất cả posts (Static Route)
function handleGetPosts(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(posts, null, 2));
}

// GET /posts/:slug - Lấy 1 post theo slug (Dynamic Route)
function handleGetPostBySlug(req, res, slug) {
  const post = posts.find((p) => p.slug === slug);

  if (post) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(post, null, 2));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Post với slug="${slug}" không tồn tại` }));
  }
}

// 404 Not Found
function handleNotFound(req, res) {
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route không tồn tại" }));
}

// ════════════════════════════════════════════════════════════════════════════════
// SERVER & ROUTING LOGIC
// ════════════════════════════════════════════════════════════════════════════════

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  console.log(`[${req.method}] ${pathname}`);

  // ──────────────────────────────────────────────────────────────────────────────
  // STATIC ROUTES (Kiểm tra trước)
  // ──────────────────────────────────────────────────────────────────────────────

  if (pathname === "/") {
    return handleHome(req, res);
  }

  if (pathname === "/users") {
    return handleGetUsers(req, res);
  }

  if (pathname === "/posts") {
    return handleGetPosts(req, res);
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // DYNAMIC ROUTES
  // ──────────────────────────────────────────────────────────────────────────────

  // ┌─────────────────────────────────────────────────────────────────────────────┐
  // │ CÁCH 1: Dùng REGEX (Chuyên nghiệp, chặt chẽ)                                │
  // │                                                                             │
  // │ /^\/users\/(\d+)$/                                                          │
  // │  │  │       │   │                                                           │
  // │  │  │       │   └── $ : Kết thúc chuỗi                                      │
  // │  │  │       └────── (\d+) : Bắt 1 hoặc nhiều số (capturing group)           │
  // │  │  └────────────── \/users\/ : Match chuỗi "/users/"                       │
  // │  └───────────────── ^ : Bắt đầu chuỗi                                       │
  // └─────────────────────────────────────────────────────────────────────────────┘

  const userMatch = pathname.match(/^\/users\/(\d+)$/);
  if (userMatch) {
    const userId = parseInt(userMatch[1], 10); // userMatch[1] = "123" → 123
    console.log(`  → Dynamic route matched: /users/:id, id=${userId}`);
    return handleGetUserById(req, res, userId);
  }

  // ┌─────────────────────────────────────────────────────────────────────────────┐
  // │ CÁCH 2: Dùng startsWith() + slice() (Đơn giản, nhanh)                       │
  // │                                                                             │
  // │ Phù hợp khi param không cần validate format (ví dụ: slug là chuỗi bất kỳ)  │
  // └─────────────────────────────────────────────────────────────────────────────┘

  if (pathname.startsWith("/posts/")) {
    const slug = pathname.slice("/posts/".length); // Cắt bỏ "/posts/" → lấy phần còn lại
    console.log(`  → Dynamic route matched: /posts/:slug, slug="${slug}"`);
    return handleGetPostBySlug(req, res, slug);
  }

  // ┌─────────────────────────────────────────────────────────────────────────────┐
  // │ CÁCH 3: Dùng split() (Linh hoạt cho nhiều params)                           │
  // │                                                                             │
  // │ VD: "/users/5/posts/10".split("/") = ["", "users", "5", "posts", "10"]      │
  // │                                         0     1     2      3      4         │
  // │                                                                             │
  // │ Cách này mình không demo ở đây, nhưng bạn đã học trong theory.              │
  // └─────────────────────────────────────────────────────────────────────────────┘

  // ──────────────────────────────────────────────────────────────────────────────
  // 404 - Không match route nào
  // ──────────────────────────────────────────────────────────────────────────────

  handleNotFound(req, res);
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log("---");
  console.log("📌 Các routes có sẵn:");
  console.log(`   GET /           → Trang chủ`);
  console.log(`   GET /users      → Danh sách users`);
  console.log(`   GET /users/:id  → User theo ID (VD: /users/1)`);
  console.log(`   GET /posts      → Danh sách posts`);
  console.log(`   GET /posts/:slug→ Post theo slug (VD: /posts/hello-world)`);
  console.log("---");
});
