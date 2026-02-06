# Roadmap Priority Guide

**Mục đích:** Đánh dấu những gì CẦN học ngay vs có thể HỌC SAU

---

## ⚠️ LƯU Ý

**Roadmap chia làm 2 GIAI ĐOẠN:**
- **Giai đoạn 1:** Học khóa Node.js Express (📘)
- **Giai đoạn 2:** Học khóa NestJS (📗)

---

## Chú thích

| Icon | Ý nghĩa |
|------|---------|
| 🔴 | **MUST** - Bắt buộc, cần cho job |
| 🟡 | **SHOULD** - Nên học, nâng cao CV |
| 🟢 | **COULD** - Học sau được, khi cần mới học |
| 🤖 | Có thể học với AI |

---

## GIAI ĐOẠN 1: Express (📘)

### Module E1 - JavaScript Ôn tập

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| E1.1 | Callback và Promise | 🟡 | 🤖 | Nếu đã biết thì skip |
| E1.2 | Async/Await | 🟡 | 🤖 | Nếu đã biết thì skip |
| E1.3 | Arrow Function | 🟡 | 🤖 | Nếu đã biết thì skip |
| E1.4 | JavaScript Class | 🔴 | 🤖 | NestJS dùng class nhiều |

### Module E2 - Node.js Core

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| E2.1 | Node.js là gì | 🔴 | 🤖 | Nền tảng |
| E2.2 | Cài đặt NVM | 🔴 | | Setup môi trường |
| E2.3 | ES Module vs CommonJS | 🔴 | 🤖 | Dùng hàng ngày |
| E2.4 | NPM & Package | 🔴 | 🤖 | Dùng hàng ngày |
| E2.5 | fs module | 🔴 | 🤖 | Đọc/ghi file |
| E2.6 | path module | 🔴 | 🤖 | Xử lý path |
| E2.7 | events module | 🟡 | 🤖 | Hiểu pattern |
| E2.8 | process module | 🟡 | 🤖 | env, argv |
| E2.9 | stream module | 🟢 | 🤖 | Học khi xử lý file lớn |
| E2.10 | Buffer | 🟢 | 🤖 | Học khi cần binary |

### Module E3 - Server & Routing

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| E3.1 | Tạo server | 🔴 | | HTTP cơ bản |
| E3.2 | Express.js cơ bản | 🔴 | | Framework core |
| E3.3 | Routing trong Express | 🔴 | | API endpoints |
| E3.4 | Cấu trúc thư mục | 🟡 | | Best practices |
| E3.5 | MVC & RESTful | 🔴 | 🤖 | Pattern quan trọng |
| E3.6 | Status codes | 🔴 | 🤖 | API chuẩn |
| E3.7 | Middleware pattern | 🔴 | 🤖 | NestJS dùng concept này |

### Module E4 - Authentication

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| E4.1 | JWT là gì | 🔴 | | Core concept |
| E4.2 | Access Token | 🔴 | | Mọi app cần |
| E4.3 | Refresh Token | 🔴 | | Security |
| E4.4 | Express Validator | 🔴 | | Validate input |
| E4.5 | Tạo Token | 🔴 | | Implementation |
| E4.6-8 | Error Handling | 🔴 | 🤖 | Production cần |

---

## GIAI ĐOẠN 2: NestJS (📗)

### Module N1 - NestJS Fundamentals

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| N1.1 | Architecture | 🔴 | | Core NestJS |
| N1.2 | HTTP Methods | 🔴 | | CRUD cơ bản |
| N1.3 | Prisma ORM | 🔴 | | Database |
| N1.4 | DI | 🔴 | 🤖 | Interview hay hỏi |
| N1.5 | DTOs & Validation | 🔴 | 🤖 | Validate input |

### Module N2 - Database & Auth

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| N2.1 | Env Validation | 🟡 | 🤖 | Config management |
| N2.2 | Hashing & Register | 🔴 | | Auth cơ bản |
| N2.3 | JWT Authentication | 🔴 | | Mọi app cần |
| N2.4 | Custom Decorator | 🟡 | 🤖 | DX tốt hơn |
| N2.5 | Guards | 🔴 | | Phân quyền |
| N2.6 | Logout | 🔴 | | Auth hoàn chỉnh |

### Module N3 - Advanced

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| N3.1 | Serialization | 🟡 | 🤖 | Chuẩn hóa response |
| N3.2 | Interceptors | 🟡 | 🤖 | Transform response |
| N3.3 | Exception Filters | 🟡 | 🤖 | Error handling |
| N3.4 | Repository Pattern | 🟡 | 🤖 | Clean architecture |
| N3.5 | CRUD Complete | 🔴 | | Thực hành |
| N3.6 | Swagger | 🟡 | 🤖 | API documentation |

### Module N4 - Production Features

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| N4.A | File Upload | 🔴 | | Nhiều app cần |
| N4.A.2 | File Validation | 🔴 | 🤖 | Security |
| N4.B | Email & OTP | 🟡 | | Verify user |
| N4.B.4 | Forgot Password | 🔴 | | Mọi app cần |
| N4.C | OAuth Google | 🟡 | | User thích |
| N4.C.2 | 2FA | 🟡 | | Enterprise apps |
| N4.D | WebSocket | 🟡 | 🤖 | Chat, notifications |
| N4.E.1 | Rate Limit | 🔴 | 🤖 | Security bắt buộc |
| N4.E.2 | Helmet | 🔴 | 🤖 | Security headers |
| N4.E.3 | Logger | 🟡 | 🤖 | Debug production |
| N4.F.1 | Redis Caching | 🟡 | 🤖 | Performance |
| N4.F.2 | Queue/BullMQ | 🟡 | | Background jobs |
| N4.G | Payment | 🟡 | | Ecommerce |

### Module N5 - Fullstack & Deploy

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| N5.1 | Connect API + Frontend | 🔴 | 🤖 | Fullstack cần |
| N5.2 | State Management | 🔴 | 🤖 | React Query/Zustand |
| N5.3 | Auth Flow E2E | 🔴 | 🤖 | Login hoàn chỉnh |
| N5.4 | Docker | 🟡 | 🤖 | Deployment |
| N5.5 | VPS Setup | 🟡 | | Biết deploy |
| N5.6 | Nginx & SSL | 🟡 | 🤖 | Reverse proxy |
| N5.7 | PM2 | 🟡 | 🤖 | Process manager |

---

## MongoDB (Optional)

| Session | Topic | Priority | AI | Lý do |
|---------|-------|----------|-----|-------|
| M.1.1 | MongoDB là gì | 🟡 | 🤖 | Biết để phỏng vấn |
| M.1.2 | Setup MongoDB | 🟡 | | Biết cài đặt |
| M.1.3 | CRUD | 🟡 | 🤖 | Biết thao tác cơ bản |
| M.2.1 | Mongoose + NestJS | 🟡 | 🤖 | Nếu job dùng MongoDB |
| M.2.2 | Relations | 🟢 | 🤖 | Embed vs Reference |
| M.3.1 | Aggregation | 🟢 | | Query phức tạp |
| M.3.2 | Indexing | 🟢 | | Optimization |

---

## Tóm tắt: Lộ trình tối thiểu cho job Backend

**🔴 MUST - Phải học (~12-14 tuần):**
```
Giai đoạn 1 (~4 tuần):
├── E1: JavaScript Class (nếu chưa biết)
├── E2: Node.js Core (E2.1-E2.6)
├── E3: Server & Routing
└── E4: Authentication (JWT, Error Handling)

Giai đoạn 2 (~8-10 tuần):
├── N1: NestJS Fundamentals, Prisma
├── N2: JWT, Guards
├── N3: CRUD Complete
├── N4: File Upload, Forgot Password, Rate Limit, Helmet
└── N5: Connect Frontend, Auth Flow E2E
```

**🟡 SHOULD - Nên học thêm (~4-6 tuần):**
```
- OAuth Google + 2FA
- WebSocket cơ bản
- Payment + Queue (BullMQ)
- Caching (Redis)
- Docker + VPS Deploy
- MongoDB basics
```

**🟢 COULD - Học khi cần:**
```
- Stream, Buffer
- Testing (Unit/E2E)
- AWS S3, SES
- Video Streaming (HLS)
- Elasticsearch/Meilisearch
```

---

## Tips

1. **Đừng hoàn hảo hóa** - Học đủ dùng rồi làm project thực tế
2. **Làm project song song** - Áp dụng ngay những gì học
3. **Focus vào MUST trước** - Phủ hết 🔴 rồi mới đến 🟡
4. **Job requirements** - Xem JD công ty target để biết cần học gì thêm
5. **Học với AI** - Topic có 🤖 thì tận dụng AI để tiết kiệm thời gian
