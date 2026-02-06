/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                     01 - URL PARSING DEMO                                    ║
 * ║                     File này CHẠY ĐƯỢC - hãy thử!                            ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Cách chạy:
 *   node 01-url-parsing.js
 */

// ════════════════════════════════════════════════════════════════════════════════
// ES Module: Dùng "import" thay vì "require"
// Vì package.json có "type": "module"
// ════════════════════════════════════════════════════════════════════════════════
import http from "http";

// ════════════════════════════════════════════════════════════════════════════════
// PHẦN 1: DEMO PARSE URL (Không cần server - chạy là thấy kết quả)
// ════════════════════════════════════════════════════════════════════════════════

console.log("═══════════════════════════════════════════════════════════");
console.log("DEMO 1: Parse URL đầy đủ (absolute URL)");
console.log("═══════════════════════════════════════════════════════════\n");

// URL đầy đủ - không cần baseURL
const fullUrl = new URL(
  "https://api.example.com:8080/users/123/posts?page=1&limit=10#section1",
);

console.log(
  "URL gốc:",
  "https://api.example.com:8080/users/123/posts?page=1&limit=10#section1",
);
console.log("");
console.log("Các thành phần:");
console.log("  protocol:", fullUrl.protocol); // "https:"
console.log("  hostname:", fullUrl.hostname); // "api.example.com"
console.log("  port:    ", fullUrl.port); // "8080"
console.log("  host:    ", fullUrl.host); // "api.example.com:8080" (hostname + port)
console.log("  pathname:", fullUrl.pathname); // "/users/123/posts" ⭐ Dùng cho routing
console.log("  search:  ", fullUrl.search); // "?page=1&limit=10"
console.log("  hash:    ", fullUrl.hash); // "#section1"
console.log("");

console.log("═══════════════════════════════════════════════════════════");
console.log("DEMO 2: Parse URL tương đối (giống req.url trong server)");
console.log("═══════════════════════════════════════════════════════════\n");

// Giả lập req.url - chỉ có pathname + search, KHÔNG có protocol/host
const reqUrl = "/users/123?page=1&limit=10";

// ❌ SAI - Sẽ báo lỗi vì thiếu baseURL
// const urlWrong = new URL(reqUrl);  // TypeError: Invalid URL

// ✅ ĐÚNG - Cần có baseURL
const url = new URL(reqUrl, "http://localhost:3000");

console.log("req.url giả lập:", reqUrl);
console.log("baseURL:        ", "http://localhost:3000");
console.log("");
console.log("Kết quả parse:");
console.log("  pathname:", url.pathname); // "/users/123"
console.log("  search:  ", url.search); // "?page=1&limit=10"
console.log("");

console.log("═══════════════════════════════════════════════════════════");
console.log("DEMO 3: URLSearchParams - Lấy query parameters");
console.log("═══════════════════════════════════════════════════════════\n");

// url.searchParams là một URLSearchParams object
const params = url.searchParams;

console.log("Query string:", url.search);
console.log("");

// Lấy giá trị của từng param
console.log("Lấy giá trị:");
console.log(params, "hihi");

console.log('  params.get("page"):    ', params.get("page")); // "1" (string!)
console.log('  params.get("limit"):   ', params.get("limit")); // "10" (string!)
console.log('  params.get("notExist"):', params.get("notExist")); // null
console.log("");

// Kiểm tra param có tồn tại không
console.log("Kiểm tra tồn tại:");
console.log('  params.has("page"):    ', params.has("page")); // true
console.log('  params.has("notExist"):', params.has("notExist")); // false
console.log("");

// ⚠️ LƯU Ý: Giá trị luôn là STRING
console.log("⚠️  Giá trị luôn là STRING:");
console.log('  typeof params.get("page"):', typeof params.get("page")); // "string"
console.log("");

// Convert sang number nếu cần
const pageNumber = parseInt(params.get("page"), 10);
const limitNumber = Number(params.get("limit"));
console.log("Convert sang number:");
console.log(
  '  parseInt(params.get("page"), 10):',
  pageNumber,
  "- typeof:",
  typeof pageNumber,
);
console.log(
  '  Number(params.get("limit")):     ',
  limitNumber,
  "- typeof:",
  typeof limitNumber,
);
console.log("");

console.log("═══════════════════════════════════════════════════════════");
console.log("DEMO 4: Nhiều giá trị cho cùng 1 key");
console.log("═══════════════════════════════════════════════════════════\n");

// Ví dụ: /search?tag=js&tag=node&tag=react
const searchUrl = new URL(
  "/search?tag=js&tag=node&tag=react",
  "http://localhost",
);
const searchParams = searchUrl.searchParams;

console.log("URL: /search?tag=js&tag=node&tag=react");
console.log("");
console.log('  params.get("tag"):   ', searchParams.get("tag")); // "js" (chỉ lấy cái đầu)
console.log('  params.getAll("tag"):', searchParams.getAll("tag")); // ["js", "node", "react"]
console.log("");

console.log("═══════════════════════════════════════════════════════════");
console.log("DEMO 5: Lặp qua tất cả params");
console.log("═══════════════════════════════════════════════════════════\n");

const loopUrl = new URL(
  "/products?category=shoes&color=red&size=42&inStock=true",
  "http://localhost",
);
const loopParams = loopUrl.searchParams;

console.log("URL: /products?category=shoes&color=red&size=42&inStock=true");
console.log("");
console.log("Cách 1 - for...of:");
for (const [key, value] of loopParams) {
  console.log(`  ${key}: ${value}`);
}
console.log("");

console.log("Cách 2 - forEach:");
loopParams.forEach((value, key) => {
  console.log(`  ${key} = ${value}`);
});
console.log("");

console.log("Cách 3 - Convert sang Object:");
const paramsObject = Object.fromEntries(loopParams);
console.log("  Object.fromEntries(params):", paramsObject);
console.log("");

console.log("═══════════════════════════════════════════════════════════");
console.log("✅ PHẦN 1 HOÀN THÀNH!");
console.log("═══════════════════════════════════════════════════════════");
console.log("");
console.log("Bạn đã học được:");
console.log("  1. new URL() để parse URL");
console.log("  2. url.pathname - đường dẫn (dùng cho routing)");
console.log("  3. url.searchParams - lấy query parameters");
console.log("  4. params.get(), params.has(), params.getAll()");
console.log("  5. Object.fromEntries() để convert params thành object");
console.log("");
console.log(
  "👉 Khi hiểu rồi, mở file và bỏ comment PHẦN 2 để chạy server thật!",
);
console.log("");

// ════════════════════════════════════════════════════════════════════════════════
// PHẦN 2: HTTP SERVER THỰC TẾ
// ════════════════════════════════════════════════════════════════════════════════

const PORT = 3000;

const server = http.createServer((req, res) => {
  // ─────────────────────────────────────────────────────────────────────────────
  // BƯỚC 1: Parse URL từ request
  // ─────────────────────────────────────────────────────────────────────────────
  const serverUrl = new URL(req.url, `http://${req.headers.host}`);

  // ─────────────────────────────────────────────────────────────────────────────
  // BƯỚC 2: Lấy các thông tin cần thiết
  // ─────────────────────────────────────────────────────────────────────────────
  const method = req.method;
  const pathname = serverUrl.pathname;
  const serverSearchParams = serverUrl.searchParams;

  // ─────────────────────────────────────────────────────────────────────────────
  // BƯỚC 3: Log để debug
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('────────────────────────────────────────');
  console.log(`[${method}] ${req.url}`);
  console.log('  pathname:', pathname);
  console.log('  search:  ', serverUrl.search || '(không có)');

  if (serverUrl.search) {
    console.log('  params:');
    for (const [key, value] of serverSearchParams) {
      console.log(`    - ${key}: ${value}`);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // BƯỚC 4: Tạo response JSON
  // ─────────────────────────────────────────────────────────────────────────────
  const responseData = {
    message: 'URL đã được parse thành công!',
    request: {
      method: method,
      originalUrl: req.url,
    },
    parsed: {
      pathname: pathname,
      search: serverUrl.search,
      queryParams: Object.fromEntries(serverSearchParams),
    },
  };

  res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(responseData, null, 2));
});

server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('PHẦN 2: HTTP SERVER ĐANG CHẠY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`Server đang chạy tại: http://localhost:${PORT}`);
  console.log('');
  console.log('Thử các URL sau (copy paste vào browser):');
  console.log(`  http://localhost:${PORT}/`);
  console.log(`  http://localhost:${PORT}/users`);
  console.log(`  http://localhost:${PORT}/users?page=1&limit=10`);
  console.log(`  http://localhost:${PORT}/products/shoes?color=red&size=42`);
  console.log('');
  console.log('Nhấn Ctrl+C để dừng server');
  console.log('════════════════════════════════════════════════════════════');
});
