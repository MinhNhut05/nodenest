# SESSION 2.1.1 - ROUTING PATTERNS
> Lý thuyết chi tiết về Routing trong Node.js

File này KHÔNG chạy được - chỉ để đọc và hiểu lý thuyết. Các file demo (01, 02, 03...) sẽ có code chạy được.

---

## PHẦN 0: NHẮC LẠI HTTP MODULE (Quick Recap)

### 0.1 - TẠO SERVER VỚI http.createServer()

Cú pháp cơ bản:

```javascript
import http from 'http';

const server = http.createServer((req, res) => {
  // req = request object  - thông tin từ client gửi lên
  // res = response object - dùng để gửi data về client
});

server.listen(3000);
```

**Giải thích từng phần:**

* **`http.createServer(callback)`**
  * Tạo một HTTP server mới
  * callback được gọi **MỖI KHI** có request từ client
  * callback nhận 2 tham số: `(req, res)`

* **`req` (IncomingMessage object)**
  * Chứa thông tin về request từ client
  * `req.url`    → URL mà client request (ví dụ: "/users?page=1")
  * `req.method` → HTTP method (GET, POST, PUT, DELETE...)
  * `req.headers` → Headers của request

* **`res` (ServerResponse object)**
  * Dùng để gửi response về client
  * `res.writeHead(statusCode, headers)` → Set status code và headers
  * `res.write(data)` → Ghi data vào response body
  * `res.end(data)`   → Kết thúc response (có thể gửi data cuối)

### 0.2 - VÍ DỤ BASIC SERVER

```javascript
import http from 'http';

const server = http.createServer((req, res) => {
  // Log để debug - xem client request gì
  console.log(`${req.method} ${req.url}`);

  // Gửi response về client
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

Khi client truy cập `http://localhost:3000/about?name=john`
Console sẽ log: `"GET /about?name=john"`

**Vấn đề:** Server này trả về "Hello World" cho MỌI URL
→ Cần **ROUTING** để xử lý từng URL khác nhau!

---

## PHẦN 1: URL PARSING (Phân tích cấu trúc URL)

### 1.1 - CẤU TRÚC CỦA MỘT URL

Ví dụ URL đầy đủ:
```
https://api.example.com:8080/users/123/posts?page=1&limit=10#section1
└──┬──┘ └──────┬───────┘└─┬┘└──────┬──────┘└───────┬───────┘└───┬───┘
protocol     host     port    pathname          search         hash
             │                                    │
             └── hostname                         └── query string
```

**Giải thích từng phần:**

* **protocol (giao thức)**: "https:" hoặc "http:"
* **host (máy chủ)**: "api.example.com:8080" (hostname + port)
* **hostname (tên miền)**: "api.example.com"
* **port (cổng)**: "8080"
* **pathname (đường dẫn)** ⭐ **QUAN TRỌNG CHO ROUTING**:
  * "/users/123/posts"
  * Phần đường dẫn, dùng để xác định ROUTE
  * KHÔNG bao gồm query string
* **search (chuỗi tìm kiếm)**:
  * "?page=1&limit=10"
  * Bắt đầu bằng dấu "?"
  * Chứa query parameters
* **hash (neo/fragment)**: "#section1" (không gửi lên server)

> **⚠️ LƯU Ý QUAN TRỌNG:**
> Trong Node.js HTTP server, `req.url` CHỈ CHỨA: **pathname + search**
> Ví dụ: Khi client truy cập `https://example.com/users?page=1`
> `req.url` = `"/users?page=1"` (không có protocol, host)

### 1.2 - PARSE URL VỚI new URL()

Cú pháp:
```javascript
const url = new URL(urlString, baseURL);
```

* `urlString` - URL cần parse (có thể là relative hoặc absolute)
* `baseURL`   - URL gốc (bắt buộc nếu `urlString` là relative)

**Ví dụ 1 - Parse absolute URL:**
```javascript
const url = new URL('https://example.com/users?page=1');
console.log(url.pathname);  // "/users"
console.log(url.search);    // "?page=1"
```

**Ví dụ 2 - Parse relative URL (`req.url` trong server):**
```javascript
// req.url = "/users/123?page=1"
// Cần có baseURL vì req.url không có protocol/host

const url = new URL(req.url, 'http://localhost:3000');
console.log(url.pathname);  // "/users/123"
console.log(url.search);    // "?page=1"
```

⭐ **TRONG SERVER, PATTERN PHỔ BIẾN:**
```javascript
const server = http.createServer((req, res) => {
  // Parse URL từ req.url
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Lấy pathname để routing
  const pathname = url.pathname;  // "/users/123"

  // Lấy query parameters
  const page = url.searchParams.get('page');  // "1"
});
```

### 1.3 - URLSearchParams - PARSE QUERY STRING

Query string là phần sau dấu "?" trong URL, chứa các cặp `key=value`.

```javascript
const url = new URL('/users?page=1&limit=10', 'http://localhost');

// url.searchParams là một URLSearchParams object
const params = url.searchParams;

// Lấy giá trị
params.get('page');     // "1" (string!)
params.get('limit');    // "10"
params.get('notExist'); // null

// Kiểm tra tồn tại
params.has('page');     // true

// Lấy nhiều giá trị (VD: ?tag=js&tag=node)
params.getAll('tag');   // ["js", "node"]

// Lặp qua tất cả
for (const [key, value] of params) {
  console.log(`${key}: ${value}`);
}
```

> **⚠️ LƯU Ý:** Giá trị trả về luôn là **STRING**. Cần convert sang number nếu cần dùng toán học.
> `const page = parseInt(params.get('page'), 10);`

### 1.4 - PHÂN BIỆT: pathname vs search vs query

URL: `/products/shoes?color=red&size=42`

| Thuật ngữ | Giá trị | Giải thích |
|-----------|---------|------------|
| **pathname** | `"/products/shoes"` | Đường dẫn, KHÔNG có query string. Dùng cho **ROUTING**. |
| **search** | `"?color=red&size=42"` | Query string, CÓ dấu "?" ở đầu. |
| **query** | `"color=red&size=42"` | Query string, KHÔNG có dấu "?". |

---

## PHẦN 2: ROUTE MATCHING (Khớp URL với Route)

### 2.1 - STATIC ROUTES (Routes cố định)

Route có pathname CỐ ĐỊNH, không thay đổi.
Ví dụ: `/`, `/about`, `/api/users`.

```javascript
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/') {
    res.end('Home page');
  } else if (pathname === '/about') {
    res.end('About page');
  } else if (pathname === '/api/users') {
    res.end(JSON.stringify([{ id: 1, name: 'John' }]));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
```

### 2.2 - DYNAMIC ROUTES (Routes động) ⭐ QUAN TRỌNG

Route có PHẦN THAY ĐỔI (parameter).
Ví dụ: `/users/1`, `/users/999`, `/posts/my-slug`.
Cú pháp: `/users/:id`, `/posts/:slug`.

**Cách extract parameter từ URL:**

**Phương pháp 1 - Dùng String.split() (Đơn giản):**
```javascript
const pathname = '/users/123';
const parts = pathname.split('/');
// parts = ['', 'users', '123']
const id = parts[2];  // '123'
```

**Phương pháp 2 - Dùng Regex (Chuyên nghiệp):**
```javascript
const pathname = '/users/123';
const match = pathname.match(/^\/users\/(\d+)$/);
// match[1] = '123' (captured group)

if (match) {
  const id = match[1];
}
```

**Phương pháp 3 - Dùng slice (Nhanh):**
```javascript
if (pathname.startsWith('/users/')) {
  const id = pathname.slice('/users/'.length); // Cắt bỏ '/users/'
}
```

### 2.3 - WILDCARD ROUTES (Route bắt tất cả)

Dùng để match mọi URL (ví dụ trang 404).

```javascript
// Đặt ở CUỐI CÙNG danh sách routes
if (true) {
  res.writeHead(404);
  res.end('Not Found');
}
```

---

## PHẦN 3: ROUTER PATTERN ⭐⭐⭐

### 3.1 - VẤN ĐỀ VÀ GIẢI PHÁP

Code routing bằng `if-else` sẽ rất lộn xộn. Giải pháp là tách logic thành **Handler Functions**.

```javascript
// Handler functions
function handleHome(req, res) { res.end('Home'); }
function handleAbout(req, res) { res.end('About'); }

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname;

  if (pathname === '/') handleHome(req, res);
  else if (pathname === '/about') handleAbout(req, res);
});
```

### 3.2 - ROUTER OBJECT PATTERN

Dùng Object để map route → handler (giống Express.js).

```javascript
const routes = {
  '/': handleHome,
  '/about': handleAbout,
  '/api/users': handleGetUsers
};

function router(req, res) {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const handler = routes[pathname]; // Lookup O(1)

  if (handler) handler(req, res);
  else handleNotFound(req, res);
}
```

### 3.3 - METHOD-BASED ROUTING

Kết hợp Method + URL làm key.

```javascript
const routes = {
  'GET /': handleHome,
  'POST /api/users': handleCreateUser,
  'GET /api/users': handleGetUsers
};

function router(req, res) {
  const pathname = new URL(req.url, 'http://localhost').pathname;
  const key = `${req.method} ${pathname}`; // VD: "GET /api/users"

  const handler = routes[key];
  if (handler) handler(req, res);
}
```

### 3.4 - ROUTER VỚI DYNAMIC ROUTES

Cần dùng mảng chứa Regex pattern thay vì Object đơn giản.

```javascript
const routes = [
  { method: 'GET', regex: /^\/users\/(\d+)$/, handler: handleGetUser },
  // ...
];
```

---

## PHẦN 4: BEST PRACTICES

1. **Luôn set đúng Content-Type**: `application/json` cho API, `text/html` cho web.
2. **Luôn handle 404**: Không để request bị treo.
3. **Sắp xếp routes đúng thứ tự**: Cụ thể trước, chung chung sau (`/users/profile` trước `/users/:id`).
4. **Tách routes ra files riêng**: Khi project lớn, chia nhỏ code.

---

## TÓM TẮT

1. **URL Parsing**: `new URL(req.url, baseURL)`
2. **Route Types**: Static, Dynamic (`:id`), Wildcard
3. **Router Pattern**: Object mapping, Regex matching

👉 **Tiếp theo:** Chuyển sang các file demo `01`, `02`, `03` để thực hành!
