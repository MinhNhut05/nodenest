# Ôn tập Session 2.1.2 - HTTP Methods (Node.js thuần)

> **Theo roadmap:** Phase 2.1.2 - HTTP Methods
> **Mục tiêu:** Hiểu các HTTP Methods trước khi dùng framework

---

## 1. HTTP Methods là gì?

HTTP Methods (hay HTTP Verbs) là các phương thức định nghĩa **hành động** mà client muốn thực hiện trên server.

```
Client  ──── [METHOD] /path ────►  Server
        ◄──── Response ──────────
```

---

## 2. Các HTTP Methods phổ biến

| Method | Mục đích | Có Body? | Idempotent? | Safe? |
|--------|----------|----------|-------------|-------|
| **GET** | Lấy dữ liệu | ❌ Không | ✅ Có | ✅ Có |
| **POST** | Tạo mới | ✅ Có | ❌ Không | ❌ Không |
| **PUT** | Cập nhật toàn bộ | ✅ Có | ✅ Có | ❌ Không |
| **PATCH** | Cập nhật một phần | ✅ Có | ❌ Không | ❌ Không |
| **DELETE** | Xóa | ❌ Không | ✅ Có | ❌ Không |

### Giải thích thuật ngữ

- **Idempotent** (lũy đẳng): Gọi nhiều lần cho cùng kết quả
  - GET `/users/1` → luôn trả về user 1
  - DELETE `/users/1` → lần đầu xóa, lần sau vẫn "đã xóa"
  - POST `/users` → mỗi lần tạo user mới (không idempotent)

- **Safe** (an toàn): Không thay đổi dữ liệu trên server
  - Chỉ có GET là safe

---

## 3. Code Node.js thuần xử lý HTTP Methods

### File: http-methods-server.js

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Set response headers
  res.setHeader('Content-Type', 'application/json');

  // ============ GET - Lấy dữ liệu ============
  if (method === 'GET' && url === '/users') {
    const users = [
      { id: 1, name: 'Leminho' },
      { id: 2, name: 'John' }
    ];
    res.statusCode = 200;
    res.end(JSON.stringify(users));
    return;
  }

  // GET với parameter: /users/1
  if (method === 'GET' && url.startsWith('/users/')) {
    const id = url.split('/')[2];
    res.statusCode = 200;
    res.end(JSON.stringify({ id, name: `User ${id}` }));
    return;
  }

  // ============ POST - Tạo mới ============
  if (method === 'POST' && url === '/users') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const user = JSON.parse(body);
      user.id = Date.now(); // Giả lập tạo ID

      res.statusCode = 201; // 201 Created
      res.end(JSON.stringify({
        message: 'User created',
        user
      }));
    });
    return;
  }

  // ============ PUT - Cập nhật toàn bộ ============
  if (method === 'PUT' && url.startsWith('/users/')) {
    const id = url.split('/')[2];
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const user = JSON.parse(body);
      user.id = id;

      res.statusCode = 200;
      res.end(JSON.stringify({
        message: `User ${id} updated`,
        user
      }));
    });
    return;
  }

  // ============ PATCH - Cập nhật một phần ============
  if (method === 'PATCH' && url.startsWith('/users/')) {
    const id = url.split('/')[2];
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const updates = JSON.parse(body);

      res.statusCode = 200;
      res.end(JSON.stringify({
        message: `User ${id} partially updated`,
        updates
      }));
    });
    return;
  }

  // ============ DELETE - Xóa ============
  if (method === 'DELETE' && url.startsWith('/users/')) {
    const id = url.split('/')[2];

    res.statusCode = 200; // hoặc 204 No Content
    res.end(JSON.stringify({
      message: `User ${id} deleted`
    }));
    return;
  }

  // ============ 404 Not Found ============
  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
```

---

## 4. Test với curl

```bash
# GET - Lấy tất cả users
curl http://localhost:3000/users

# GET - Lấy user theo ID
curl http://localhost:3000/users/1

# POST - Tạo user mới
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Leminho", "email": "leminho@test.com"}'

# PUT - Cập nhật toàn bộ user
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Leminho Updated", "email": "new@test.com"}'

# PATCH - Cập nhật một phần
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "New Name"}'

# DELETE - Xóa user
curl -X DELETE http://localhost:3000/users/1
```

---

## 5. PUT vs PATCH

### PUT - Thay thế toàn bộ

```javascript
// Dữ liệu hiện tại
{ id: 1, name: "Leminho", email: "a@b.com", age: 25 }

// PUT với body
{ name: "New Name", email: "new@b.com" }

// Kết quả: THAY THẾ TOÀN BỘ
{ id: 1, name: "New Name", email: "new@b.com" }
// age bị mất!
```

### PATCH - Cập nhật một phần

```javascript
// Dữ liệu hiện tại
{ id: 1, name: "Leminho", email: "a@b.com", age: 25 }

// PATCH với body
{ name: "New Name" }

// Kết quả: CHỈ CẬP NHẬT TRƯỜNG ĐƯỢC GỬI
{ id: 1, name: "New Name", email: "a@b.com", age: 25 }
// Các trường khác giữ nguyên
```

---

## 6. Status Codes phổ biến

| Code | Tên | Khi nào dùng |
|------|-----|--------------|
| **200** | OK | GET, PUT, PATCH, DELETE thành công |
| **201** | Created | POST tạo mới thành công |
| **204** | No Content | DELETE thành công, không trả body |
| **400** | Bad Request | Body không hợp lệ |
| **404** | Not Found | Resource không tồn tại |
| **405** | Method Not Allowed | Method không được hỗ trợ |

---

## 7. RESTful Convention

```
GET    /users          → Lấy tất cả users
GET    /users/:id      → Lấy 1 user
POST   /users          → Tạo user mới
PUT    /users/:id      → Cập nhật toàn bộ user
PATCH  /users/:id      → Cập nhật một phần user
DELETE /users/:id      → Xóa user
```

### Nested Resources

```
GET    /users/:userId/posts      → Lấy posts của user
POST   /users/:userId/posts      → Tạo post cho user
GET    /users/:userId/posts/:id  → Lấy 1 post của user
```

---

## 8. req.method trong Node.js

```javascript
const http = require('http');

http.createServer((req, res) => {
  console.log('Method:', req.method);   // GET, POST, PUT, PATCH, DELETE
  console.log('URL:', req.url);         // /users, /users/1
  console.log('Headers:', req.headers); // { content-type: '...', ... }

  // Xử lý theo method
  switch (req.method) {
    case 'GET':
      // Xử lý GET
      break;
    case 'POST':
      // Xử lý POST
      break;
    case 'PUT':
      // Xử lý PUT
      break;
    case 'PATCH':
      // Xử lý PATCH
      break;
    case 'DELETE':
      // Xử lý DELETE
      break;
    default:
      res.statusCode = 405;
      res.end('Method Not Allowed');
  }
}).listen(3000);
```

---

## 9. Quiz tự kiểm tra

1. **Method nào dùng để tạo resource mới?**
   - [ ] GET
   - [x] POST
   - [ ] PUT

2. **PUT và PATCH khác nhau như thế nào?**
   - [x] PUT thay thế toàn bộ, PATCH cập nhật một phần
   - [ ] PUT nhanh hơn PATCH
   - [ ] Không khác gì

3. **Method nào là idempotent?**
   - [x] GET, PUT, DELETE
   - [ ] POST, PATCH
   - [ ] Tất cả

4. **Status code nào trả về khi POST thành công?**
   - [ ] 200 OK
   - [x] 201 Created
   - [ ] 204 No Content

5. **Method nào là "safe" (không thay đổi data)?**
   - [x] GET
   - [ ] POST
   - [ ] DELETE

---

## 10. Bài tập thực hành

### Bài 1: Tạo CRUD API cho Products

```javascript
// Yêu cầu:
// GET    /products       → Lấy tất cả products
// GET    /products/:id   → Lấy 1 product
// POST   /products       → Tạo product mới
// PUT    /products/:id   → Cập nhật product
// DELETE /products/:id   → Xóa product

// Gợi ý: Dùng array để lưu tạm products
let products = [
  { id: 1, name: 'Laptop', price: 1000 },
  { id: 2, name: 'Phone', price: 500 }
];
```

### Bài 2: Thêm validation

```javascript
// Khi POST /products, validate:
// - name: required, string
// - price: required, number > 0
// Trả về 400 Bad Request nếu không hợp lệ
```

---

## So sánh với NestJS (đã học trong video)

| Aspect | Node.js thuần | NestJS |
|--------|---------------|--------|
| Check method | `if (req.method === 'GET')` | `@Get()` |
| Routing | `if (url === '/users')` | `@Controller('users')` |
| Get body | `req.on('data', ...)` | `@Body()` |
| Get params | `url.split('/')[2]` | `@Param('id')` |
| Tổ chức code | Tự viết | Module/Controller/Service |

**Kết luận:** NestJS giúp code gọn hơn nhiều, nhưng hiểu Node.js thuần giúp bạn hiểu framework hoạt động như thế nào bên dưới.

---

## Next Steps

- [ ] 2.1.3 - Request Body Parsing (đọc và parse body chi tiết)
- [ ] 2.1.4 - Response & Status codes
- [ ] 2.1.5 - Middleware Pattern
