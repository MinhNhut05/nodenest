# Session E3.5: MVC Pattern & RESTful API - Lý Thuyết Chi Tiết

> **Mục tiêu**: Hiểu và áp dụng MVC Pattern cùng thiết kế RESTful API chuẩn trong Node.js + TypeScript.

---

## Mục Lục

1. [MVC Pattern là gì?](#1-mvc-pattern-là-gì)
2. [Project Structure](#2-project-structure)
3. [RESTful API Design](#3-restful-api-design)
4. [API Naming Conventions](#4-api-naming-conventions)
5. [Response Format Chuẩn](#5-response-format-chuẩn)
6. [Tổng Kết](#6-tổng-kết)

---

## 1. MVC Pattern là gì?

### 1.1 Định nghĩa

**MVC** = **M**odel - **V**iew - **C**ontroller

MVC là một **design pattern** (mẫu thiết kế) dùng để tổ chức code trong ứng dụng. Pattern này chia ứng dụng thành 3 phần riêng biệt, mỗi phần có trách nhiệm khác nhau.

```
┌─────────────────────────────────────────────────────────────┐
│                        MVC PATTERN                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐     ┌──────────────┐     ┌─────────┐         │
│   │  MODEL  │◄────│  CONTROLLER  │────►│  VIEW   │         │
│   │  (Data) │     │   (Logic)    │     │  (UI)   │         │
│   └─────────┘     └──────────────┘     └─────────┘         │
│        ▲                 ▲                                  │
│        │                 │                                  │
│        └────── Request ──┘                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Tại sao cần tách code? (Separation of Concerns)

**Separation of Concerns (SoC)** = Tách biệt các mối quan tâm

Hãy tưởng tượng bạn có một file `server.ts` với 2000 dòng code:
- Xử lý routing
- Xử lý database
- Validation
- Business logic
- Response formatting

**Vấn đề:**
- Khó đọc, khó hiểu
- Khó maintain (bảo trì)
- Khó test
- Khó làm việc nhóm (conflict khi merge)
- Khó mở rộng

**Giải pháp với MVC:**

| Không có MVC | Có MVC |
|--------------|--------|
| 1 file 2000 dòng | Nhiều file nhỏ, rõ ràng |
| Khó tìm bug | Dễ locate bug |
| Thay đổi 1 chỗ ảnh hưởng nhiều nơi | Thay đổi isolated |
| 1 người làm 1 lúc | Team có thể làm song song |

### 1.3 Ba thành phần của MVC

#### **MODEL** - Data & Business Logic

Model chịu trách nhiệm về:
- **Data structure**: Định nghĩa cấu trúc dữ liệu (User, Product, Order...)
- **Business logic**: Các quy tắc nghiệp vụ
- **Data validation**: Kiểm tra dữ liệu hợp lệ
- **Database interaction**: Thao tác với database (CRUD)

```typescript
// models/user.model.ts
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// Business logic: validate email
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Data operation: get user by id
function findUserById(id: number): User | undefined {
  return users.find(user => user.id === id);
}
```

#### **VIEW** - Presentation Layer

Trong web app truyền thống, View là HTML/CSS. Trong **API**, View là **JSON response**.

```typescript
// Trong API, "View" là format của response
// Success response
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Leminho",
    "email": "leminho@test.com"
  }
}

// Error response
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with id 99 not found"
  }
}
```

#### **CONTROLLER** - Request Handler & Coordinator

Controller là "người điều phối":
- Nhận request từ client
- Gọi Model để lấy/xử lý data
- Trả response về client

```typescript
// controllers/user.controller.ts
async function getUser(req: Request, res: Response) {
  // 1. Lấy param từ request
  const userId = parseInt(req.params.id);

  // 2. Gọi Model để lấy data
  const user = await UserModel.findById(userId);

  // 3. Trả response (View)
  if (user) {
    res.json({ success: true, data: user });
  } else {
    res.status(404).json({ success: false, error: "User not found" });
  }
}
```

### 1.4 MVC Flow - Luồng hoạt động

```
┌────────────────────────────────────────────────────────────────┐
│                         MVC FLOW                               │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Client                                                        │
│    │                                                           │
│    │ 1. HTTP Request (GET /api/users/1)                       │
│    ▼                                                           │
│  ┌──────────┐                                                  │
│  │  ROUTER  │  ◄── Định tuyến request đến đúng controller     │
│  └────┬─────┘                                                  │
│       │ 2. Route match → call controller                       │
│       ▼                                                        │
│  ┌──────────────┐                                              │
│  │  CONTROLLER  │  ◄── Xử lý logic, điều phối                 │
│  └────┬─────────┘                                              │
│       │ 3. Gọi model để lấy data                              │
│       ▼                                                        │
│  ┌──────────┐                                                  │
│  │  MODEL   │  ◄── Truy vấn database, business logic          │
│  └────┬─────┘                                                  │
│       │ 4. Trả data về controller                             │
│       ▼                                                        │
│  ┌──────────────┐                                              │
│  │  CONTROLLER  │  ◄── Format response                        │
│  └────┬─────────┘                                              │
│       │ 5. Trả JSON response (View)                           │
│       ▼                                                        │
│  Client nhận response                                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

**Ví dụ cụ thể:**

1. Client gửi: `GET /api/users/1`
2. Router nhận request, match với route `/api/users/:id`
3. Router gọi `UserController.getUser()`
4. Controller gọi `UserModel.findById(1)`
5. Model query database, trả về user object
6. Controller format thành JSON response
7. Client nhận: `{ "success": true, "data": { "id": 1, "name": "Leminho" } }`

### 1.5 MVC trong Node.js API vs Web App truyền thống

| Aspect | Web App (SSR) | API (Node.js) |
|--------|---------------|---------------|
| **Model** | Data + DB operations | Data + DB operations |
| **View** | HTML templates (EJS, Pug) | JSON response |
| **Controller** | Render HTML | Return JSON |
| **Client** | Browser hiển thị HTML | Frontend app/Mobile app xử lý JSON |

---

## 2. Project Structure

### 2.1 Hai cách tổ chức phổ biến

#### **Layer-based Structure** (Theo tầng)

Tổ chức theo chức năng kỹ thuật. Phù hợp với project nhỏ-vừa.

```
src/
├── controllers/          # Tất cả controllers
│   ├── user.controller.ts
│   ├── product.controller.ts
│   └── order.controller.ts
├── models/               # Tất cả models
│   ├── user.model.ts
│   ├── product.model.ts
│   └── order.model.ts
├── routes/               # Tất cả routes
│   ├── user.routes.ts
│   ├── product.routes.ts
│   └── order.routes.ts
├── services/             # Business logic phức tạp
│   ├── user.service.ts
│   └── email.service.ts
├── utils/                # Helper functions
│   ├── validation.ts
│   └── response.ts
├── middlewares/          # Middleware functions
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── types/                # TypeScript types/interfaces
│   └── index.ts
└── index.ts              # Entry point
```

**Ưu điểm:**
- Dễ hiểu với người mới
- Cấu trúc rõ ràng theo layer
- Phù hợp project nhỏ-vừa

**Nhược điểm:**
- Khi project lớn, mỗi folder có quá nhiều files
- Khó tìm tất cả files liên quan đến 1 feature

#### **Feature-based Structure** (Theo tính năng)

Tổ chức theo domain/feature. Phù hợp với project lớn.

```
src/
├── modules/
│   ├── users/                    # Tất cả về User
│   │   ├── user.controller.ts
│   │   ├── user.model.ts
│   │   ├── user.routes.ts
│   │   ├── user.service.ts
│   │   ├── user.types.ts
│   │   └── user.validation.ts
│   ├── products/                 # Tất cả về Product
│   │   ├── product.controller.ts
│   │   ├── product.model.ts
│   │   ├── product.routes.ts
│   │   └── product.service.ts
│   └── orders/                   # Tất cả về Order
│       ├── order.controller.ts
│       ├── order.model.ts
│       ├── order.routes.ts
│       └── order.service.ts
├── shared/                       # Code dùng chung
│   ├── middlewares/
│   ├── utils/
│   └── types/
└── index.ts
```

**Ưu điểm:**
- Tất cả code của 1 feature ở cùng 1 nơi
- Dễ tìm, dễ maintain
- Dễ scale khi project lớn
- Dễ chia team theo feature

**Nhược điểm:**
- Phức tạp hơn với project nhỏ
- Có thể duplicate code giữa các modules

### 2.2 Các folder phổ biến và chức năng

| Folder | Chức năng | Ví dụ |
|--------|-----------|-------|
| `controllers/` | Xử lý request/response | `user.controller.ts` |
| `models/` | Data structure, DB operations | `user.model.ts` |
| `routes/` | Định nghĩa API endpoints | `user.routes.ts` |
| `services/` | Business logic phức tạp | `email.service.ts` |
| `middlewares/` | Xử lý trước/sau request | `auth.middleware.ts` |
| `utils/` | Helper functions | `validation.ts` |
| `types/` | TypeScript types/interfaces | `user.types.ts` |
| `config/` | Configuration | `database.config.ts` |
| `constants/` | Constant values | `http-status.ts` |

### 2.3 Service Layer - Tại sao cần?

Khi business logic phức tạp, ta thêm **Service Layer** giữa Controller và Model:

```
┌────────────────────────────────────────────────────────────┐
│              CONTROLLER - SERVICE - MODEL                  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Request                                                   │
│     │                                                      │
│     ▼                                                      │
│  ┌──────────────┐                                          │
│  │  CONTROLLER  │  Nhận request, validate input cơ bản    │
│  └──────┬───────┘                                          │
│         │                                                  │
│         ▼                                                  │
│  ┌──────────────┐                                          │
│  │   SERVICE    │  Business logic phức tạp                │
│  └──────┬───────┘  (có thể gọi nhiều models)              │
│         │                                                  │
│         ▼                                                  │
│  ┌──────────────┐                                          │
│  │    MODEL     │  Data operations (CRUD)                 │
│  └──────────────┘                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Ví dụ: Tạo Order**

```typescript
// Không có Service - Controller quá phức tạp
class OrderController {
  async createOrder(req, res) {
    // Validate input
    // Check user exists
    // Check products in stock
    // Calculate total price
    // Apply discount
    // Create order
    // Update stock
    // Send confirmation email
    // Return response
    // --> Quá nhiều logic trong controller!
  }
}

// Có Service - Controller clean hơn
class OrderController {
  async createOrder(req, res) {
    const orderData = req.body;
    const order = await orderService.createOrder(orderData);
    res.json({ success: true, data: order });
  }
}

class OrderService {
  async createOrder(orderData) {
    // Tất cả business logic ở đây
    const user = await userModel.findById(orderData.userId);
    const products = await productModel.findByIds(orderData.productIds);
    // ... validation, calculation, etc.
    const order = await orderModel.create(orderData);
    await emailService.sendConfirmation(user.email, order);
    return order;
  }
}
```

### 2.4 So sánh: Small vs Large Project

#### Small Project (MVP, Side project)

```
src/
├── controllers/
├── models/
├── routes/
├── utils/
└── index.ts
```

- Không cần service layer
- Layer-based structure
- Đơn giản, nhanh chóng

#### Medium Project (Startup, Team 3-5 người)

```
src/
├── controllers/
├── models/
├── routes/
├── services/           # Thêm service layer
├── middlewares/
├── utils/
├── types/
├── config/
└── index.ts
```

#### Large Project (Enterprise, Team lớn)

```
src/
├── modules/            # Feature-based
│   ├── users/
│   ├── products/
│   ├── orders/
│   └── payments/
├── shared/
│   ├── middlewares/
│   ├── utils/
│   ├── types/
│   └── database/
├── config/
└── index.ts
```

---

## 3. RESTful API Design

### 3.1 REST là gì?

**REST** = **RE**presentational **S**tate **T**ransfer

REST là một **architectural style** (phong cách kiến trúc) để thiết kế APIs. REST không phải là protocol hay standard, mà là một tập hợp các **nguyên tắc** và **constraints** (ràng buộc).

**RESTful API** = API được thiết kế theo nguyên tắc REST.

### 3.2 Sáu nguyên tắc REST (REST Constraints)

#### 1. **Client-Server** (Tách biệt Client và Server)

```
┌──────────┐                    ┌──────────┐
│  CLIENT  │◄─── HTTP/JSON ───►│  SERVER  │
│ (React)  │                    │ (Node.js)│
└──────────┘                    └──────────┘

- Client và Server phát triển độc lập
- Client không cần biết Server dùng gì (Node, Python, Java...)
- Server không cần biết Client là gì (Web, Mobile, Desktop...)
```

#### 2. **Stateless** (Không trạng thái)

Mỗi request từ client phải chứa đầy đủ thông tin để server xử lý. Server không lưu session của client.

```typescript
// ❌ Stateful - Server lưu session
// Request 1: Login
POST /login → Server lưu session { userId: 1 }
// Request 2: Server dựa vào session để biết user
GET /profile → Server check session → trả về profile của user 1

// ✅ Stateless - Mỗi request độc lập
// Mỗi request đều gửi token để xác thực
GET /profile
Headers: { Authorization: "Bearer eyJhbGc..." }
→ Server verify token, trả về profile
```

**Lợi ích của Stateless:**
- Server dễ scale (thêm server mới không cần sync session)
- Request có thể đến bất kỳ server nào
- Dễ cache

#### 3. **Cacheable** (Có thể cache)

Response có thể được cache để tăng performance.

```typescript
// Server có thể chỉ định cache behavior
// Response headers:
{
  "Cache-Control": "public, max-age=3600",  // Cache 1 giờ
  "ETag": "abc123"                          // Version của resource
}

// Client có thể cache và dùng lại response
// Giảm load cho server, tăng tốc độ cho client
```

#### 4. **Uniform Interface** (Giao diện thống nhất)

API phải nhất quán, dễ đoán:
- Dùng HTTP methods đúng cách (GET, POST, PUT, DELETE)
- Resource-based URLs
- Response format nhất quán

```typescript
// ✅ Uniform - Nhất quán
GET    /users      → Lấy danh sách users
GET    /users/1    → Lấy user có id=1
POST   /users      → Tạo user mới
PUT    /users/1    → Cập nhật user có id=1
DELETE /users/1    → Xóa user có id=1

// Tương tự cho products, orders, etc.
GET    /products
POST   /products
...
```

#### 5. **Layered System** (Hệ thống phân lớp)

Client không cần biết đang kết nối trực tiếp đến server hay qua proxy/load balancer.

```
┌────────┐     ┌───────────────┐     ┌────────┐     ┌──────────┐
│ Client │────►│ Load Balancer │────►│ Server │────►│ Database │
└────────┘     └───────────────┘     └────────┘     └──────────┘
                      │
                      ├── Cache Layer
                      ├── Security Layer
                      └── etc.
```

#### 6. **Code on Demand** (Tùy chọn)

Server có thể gửi code (JavaScript) để client thực thi. Đây là constraint tùy chọn, ít được dùng trong REST APIs.

### 3.3 Resource-based URLs

Trong REST, mọi thứ đều là **Resource** (tài nguyên). Resource được định danh bằng URL.

```
┌─────────────────────────────────────────────────────────────┐
│                     RESOURCE EXAMPLES                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  /users              → Collection of users                  │
│  /users/1            → Single user with id=1                │
│  /users/1/orders     → Orders của user 1                   │
│  /products           → Collection of products               │
│  /products/abc       → Single product with id=abc           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.4 HTTP Methods Mapping (CRUD Operations)

| HTTP Method | CRUD | Ý nghĩa | Idempotent? |
|-------------|------|---------|-------------|
| `GET` | Read | Lấy resource | Yes |
| `POST` | Create | Tạo resource mới | No |
| `PUT` | Update | Cập nhật toàn bộ resource | Yes |
| `PATCH` | Update | Cập nhật một phần resource | Yes |
| `DELETE` | Delete | Xóa resource | Yes |

**Idempotent** = Gọi nhiều lần cho cùng kết quả

```typescript
// GET là idempotent
GET /users/1  → Luôn trả về user 1 (nếu không thay đổi)
GET /users/1  → Kết quả giống nhau

// POST không idempotent
POST /users { name: "A" } → Tạo user mới id=1
POST /users { name: "A" } → Tạo user mới id=2 (khác!)

// PUT là idempotent
PUT /users/1 { name: "B" } → User 1 có name="B"
PUT /users/1 { name: "B" } → User 1 vẫn có name="B"

// DELETE là idempotent
DELETE /users/1 → User 1 bị xóa
DELETE /users/1 → Không có gì xảy ra (hoặc 404)
```

### 3.5 Plural vs Singular Naming

**Convention**: Luôn dùng **plural** (số nhiều) cho resource names.

```typescript
// ✅ GOOD - Plural (Số nhiều)
GET /users
GET /users/1
GET /products
GET /products/abc

// ❌ BAD - Singular (Số ít)
GET /user
GET /user/1
GET /product
```

**Lý do:**
- `/users` nghĩa là "danh sách users" - hợp lý
- `/users/1` nghĩa là "user số 1 trong danh sách users" - hợp lý
- Nhất quán, dễ nhớ

---

## 4. API Naming Conventions

### 4.1 Dùng Noun, không dùng Verb

**Resource URLs** nên là **danh từ** (noun), không phải động từ (verb). HTTP method đã thể hiện hành động rồi.

```typescript
// ✅ GOOD - Dùng noun
GET    /users           # Lấy danh sách users
GET    /users/1         # Lấy user 1
POST   /users           # Tạo user
PUT    /users/1         # Update user 1
DELETE /users/1         # Xóa user 1

// ❌ BAD - Dùng verb
GET    /getUsers
GET    /getUserById/1
POST   /createUser
PUT    /updateUser/1
DELETE /deleteUser/1
```

### 4.2 Nested Resources (Tài nguyên lồng nhau)

Khi resource có quan hệ với resource khác:

```typescript
// User có nhiều Orders
GET /users/1/orders           # Lấy tất cả orders của user 1
GET /users/1/orders/5         # Lấy order 5 của user 1
POST /users/1/orders          # Tạo order mới cho user 1

// Product có nhiều Reviews
GET /products/abc/reviews     # Lấy reviews của product abc
POST /products/abc/reviews    # Tạo review cho product abc

// Không nên nest quá sâu (max 2-3 levels)
// ❌ BAD - Quá sâu
GET /users/1/orders/5/items/3/reviews

// ✅ GOOD - Flatten khi cần
GET /order-items/3/reviews
```

### 4.3 Query Parameters

Dùng query params cho: **filtering, sorting, pagination, searching**

```typescript
// Filtering (Lọc)
GET /users?role=admin              # Users có role=admin
GET /users?status=active           # Users đang active
GET /products?category=electronics # Products trong category electronics
GET /products?minPrice=100&maxPrice=500

// Sorting (Sắp xếp)
GET /users?sort=name               # Sort by name ASC
GET /users?sort=-createdAt         # Sort by createdAt DESC (- = descending)
GET /products?sort=price,-rating   # Sort by price ASC, then rating DESC

// Pagination (Phân trang)
GET /users?page=1&limit=10         # Trang 1, 10 users/trang
GET /users?offset=0&limit=10       # Skip 0, lấy 10

// Searching (Tìm kiếm)
GET /users?search=leminho          # Tìm users chứa "leminho"
GET /products?q=iphone             # Tìm products chứa "iphone"

// Combining (Kết hợp)
GET /users?role=admin&sort=-createdAt&page=1&limit=10
```

### 4.4 API Versioning

Khi API thay đổi breaking changes, cần versioning để không làm hỏng client cũ.

```typescript
// Cách 1: URL Path (Phổ biến nhất)
GET /api/v1/users
GET /api/v2/users

// Cách 2: Query Parameter
GET /api/users?version=1
GET /api/users?version=2

// Cách 3: Header
GET /api/users
Headers: { "API-Version": "1" }

// Cách 4: Accept Header
GET /api/users
Headers: { "Accept": "application/vnd.myapi.v1+json" }
```

**Recommendation**: Dùng **URL Path** (`/api/v1/`) vì:
- Dễ nhìn, dễ debug
- Dễ test với curl/Postman
- Phổ biến nhất

### 4.5 Các conventions khác

```typescript
// Dùng lowercase và hyphens (kebab-case)
// ✅ GOOD
GET /user-profiles
GET /order-items

// ❌ BAD
GET /userProfiles    # camelCase
GET /user_profiles   # snake_case
GET /UserProfiles    # PascalCase

// Actions đặc biệt (khi CRUD không đủ)
// Dùng verb cho actions đặc biệt
POST /users/1/activate        # Activate user
POST /users/1/deactivate      # Deactivate user
POST /orders/1/cancel         # Cancel order
POST /auth/login              # Login
POST /auth/logout             # Logout
POST /auth/refresh-token      # Refresh token

// Bulk operations
POST /users/bulk-create       # Tạo nhiều users
DELETE /users/bulk-delete     # Xóa nhiều users
```

---

## 5. Response Format Chuẩn

### 5.1 Success Response

```typescript
// Single resource
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Leminho",
    "email": "leminho@test.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

// Collection (danh sách)
{
  "success": true,
  "data": [
    { "id": 1, "name": "Leminho" },
    { "id": 2, "name": "John" }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}

// Create success
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 3,
    "name": "New User"
  }
}

// Update/Delete success
{
  "success": true,
  "message": "User updated successfully"
}
```

### 5.2 Error Response

```typescript
// Client error (4xx)
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Email is required" },
      { "field": "name", "message": "Name must be at least 2 characters" }
    ]
  }
}

// Not found (404)
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "User with id 99 not found"
  }
}

// Server error (5xx)
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

### 5.3 HTTP Status Codes

#### Success Codes (2xx)

| Code | Name | Khi nào dùng |
|------|------|--------------|
| `200` | OK | Request thành công (GET, PUT, PATCH, DELETE) |
| `201` | Created | Resource được tạo thành công (POST) |
| `204` | No Content | Thành công nhưng không có data trả về (DELETE) |

#### Client Error Codes (4xx)

| Code | Name | Khi nào dùng |
|------|------|--------------|
| `400` | Bad Request | Request không hợp lệ (validation error) |
| `401` | Unauthorized | Chưa authenticate (chưa login) |
| `403` | Forbidden | Không có quyền truy cập |
| `404` | Not Found | Resource không tồn tại |
| `405` | Method Not Allowed | HTTP method không được hỗ trợ |
| `409` | Conflict | Conflict với state hiện tại (duplicate) |
| `422` | Unprocessable Entity | Validation error (thay thế cho 400) |
| `429` | Too Many Requests | Rate limit exceeded |

#### Server Error Codes (5xx)

| Code | Name | Khi nào dùng |
|------|------|--------------|
| `500` | Internal Server Error | Lỗi server không xác định |
| `502` | Bad Gateway | Lỗi từ upstream server |
| `503` | Service Unavailable | Server đang maintenance |

### 5.4 Pagination Format

```typescript
// Offset-based pagination (phổ biến)
GET /users?page=2&limit=10

{
  "success": true,
  "data": [...],
  "meta": {
    "total": 95,           // Tổng số records
    "page": 2,             // Trang hiện tại
    "limit": 10,           // Số records/trang
    "totalPages": 10,      // Tổng số trang
    "hasNextPage": true,   // Còn trang tiếp?
    "hasPrevPage": true    // Có trang trước?
  }
}

// Cursor-based pagination (cho data realtime, infinite scroll)
GET /users?cursor=eyJpZCI6MTB9&limit=10

{
  "success": true,
  "data": [...],
  "meta": {
    "nextCursor": "eyJpZCI6MjB9",  // Cursor cho trang tiếp
    "hasMore": true
  }
}
```

---

## 6. Tổng Kết

### 6.1 MVC Pattern

```
┌─────────────────────────────────────────────────────────────┐
│                    MVC SUMMARY                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  MODEL      │ Data, Business Logic, Database               │
│  VIEW       │ JSON Response (trong API)                    │
│  CONTROLLER │ Xử lý request, điều phối, trả response       │
│                                                             │
│  Flow: Request → Router → Controller → Service → Model     │
│                                          ↓                  │
│        Response ← Controller ← Service ← Model             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 6.2 RESTful API Checklist

```
✅ Dùng HTTP methods đúng (GET, POST, PUT, DELETE)
✅ Resource URLs là noun, số nhiều (/users, /products)
✅ Không dùng verb trong URL (/getUsers ❌)
✅ Dùng query params cho filter/sort/pagination
✅ Versioning API (/api/v1/)
✅ Response format nhất quán
✅ HTTP status codes phù hợp
✅ Stateless (mỗi request độc lập)
```

### 6.3 Project Structure Checklist

```
✅ Tách code theo layer hoặc feature
✅ Controller: mỏng, chỉ xử lý request/response
✅ Service: business logic phức tạp
✅ Model: data operations
✅ Entry point rõ ràng (index.ts)
✅ Utils/Helpers cho code dùng chung
```

---

## Từ vựng mới

| English | Vietnamese | Giải thích |
|---------|------------|------------|
| Separation of Concerns | Tách biệt các mối quan tâm | Nguyên tắc mỗi phần code chỉ làm 1 việc |
| Design Pattern | Mẫu thiết kế | Giải pháp tái sử dụng cho các vấn đề phổ biến |
| Architectural Style | Phong cách kiến trúc | Cách tổ chức hệ thống ở mức cao |
| Constraint | Ràng buộc | Quy tắc phải tuân theo |
| Resource | Tài nguyên | Đối tượng được quản lý qua API |
| Idempotent | Bất biến | Gọi nhiều lần cho cùng kết quả |
| Stateless | Không trạng thái | Server không lưu thông tin client giữa các request |
| Cacheable | Có thể cache | Response có thể lưu tạm để tái sử dụng |
| Pagination | Phân trang | Chia data thành nhiều trang |
| Nested Resource | Tài nguyên lồng nhau | Resource nằm trong resource khác |

---

> **Next**: Chúng ta sẽ áp dụng lý thuyết này vào code thực tế trong các file demo tiếp theo!
