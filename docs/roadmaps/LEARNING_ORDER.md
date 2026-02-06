# Learning Order - Thứ tự học tối ưu

**Mục đích:** Hướng dẫn học theo thứ tự dependency - Khóa Express trước, NestJS sau

---

## ⚠️ QUAN TRỌNG

**Roadmap chia làm 2 GIAI ĐOẠN:**
- **Giai đoạn 1:** Học khóa Node.js Express (📘) - nền tảng
- **Giai đoạn 2:** Học khóa NestJS (📗) - framework nâng cao

👉 **Hoàn thành Giai đoạn 1 trước khi sang Giai đoạn 2!**

---

## Chú thích

| Icon | Ý nghĩa |
|------|---------|
| 🔴 | **MUST** - Bắt buộc học |
| 🟡 | **SHOULD** - Nên học |
| 🟢 | **COULD** - Học sau được |
| 📘 | Video khóa Express (Giai đoạn 1) |
| 📗 | Video khóa NestJS (Giai đoạn 2) |
| 🤖 | Học với AI |

---

## Tổng quan lộ trình

```
┌─────────────────────────────────────────────────────────────┐
│                    GIAI ĐOẠN 1: KHÓA EXPRESS (📘)           │
│                         ~3-4 tuần                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Week 1: JS Ôn tập (Bài 2-5) + Node.js Core (Bài 40-46)    │
│  Week 2: Server & Routing (Bài 48-51, 72-77)               │
│  Week 3-4: Authentication (Bài 78-88)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    GIAI ĐOẠN 2: KHÓA NESTJS (📗)            │
│                         ~8-10 tuần                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Week 1-2: NestJS Fundamentals (Bài 7-17)                  │
│  Week 3-4: Database & Auth (Bài 18-31)                     │
│  Week 5-8: Production Features                              │
│  Week 9-10: Fullstack & Deploy                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Tổng: ~12-14 tuần
```

---

## ═══════════════════════════════════════════════════════════
## GIAI ĐOẠN 1: KHÓA EXPRESS (📘)
## ═══════════════════════════════════════════════════════════

> **Mục tiêu:** Hiểu JavaScript, Node.js, Express, JWT trước khi học NestJS

---

### Step E1 - JavaScript Ôn tập 🟡 (0.5 tuần)

> Skip nếu đã thành thạo JavaScript, hoặc học nhanh với AI

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 1 | E1.1 | Callback và Promise | 📘 Bài 2 | 🤖 |
| 2 | E1.2 | Async/Await | 📘 Bài 3 | 🤖 |
| 3 | E1.3 | Arrow Function | 📘 Bài 4 | 🤖 |
| 4 | E1.4 | JavaScript Class | 📘 Bài 5 | 🤖 |

**Dependency:** Promise → Async/Await → Class

---

### Step E2 - Node.js Core 🔴 (1 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 5 | E2.1 | Node.js là gì | 📘 Bài 40 | 🤖 |
| 6 | E2.2 | Cài đặt NVM | 📘 Bài 41 | |
| 7 | E2.3 | ES Module vs CommonJS | 📘 Bài 42 | 🤖 |
| 8 | E2.4 | NPM là gì | 📘 Bài 43 | 🤖 |
| 9 | E2.5 | Cài đặt package | 📘 Bài 44-45 | 🤖 |
| 10 | E2.6 | NPX là gì | 📘 Bài 46 | 🤖 |

#### Bổ sung - Học với AI:

| Order | Session | Topic | AI |
|-------|---------|-------|-----|
| 11 | E2.7 | fs module | 🤖 |
| 12 | E2.8 | path module | 🤖 |
| 13 | E2.9 | events module | 🤖 |
| 14 | E2.10 | process module | 🤖 |
| 15 | E2.11 | stream module (Optional) | 🤖 |
| 16 | E2.12 | Buffer (Optional) | 🤖 |

**Dependency:** Node.js Runtime → Modules → npm → Core Modules

---

### Step E3 - Server & Routing 🔴 (1 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 17 | E3.1 | Tạo server đầu tiên | 📘 Bài 48 | |
| 18 | E3.2 | Fix lỗi xung đột port | 📘 Bài 49 | |
| 19 | E3.3 | Express.js cơ bản | 📘 Bài 50 | |
| 20 | E3.4 | Setup Node + TypeScript + ESLint | 📘 Bài 51 | |
| 21 | E3.5 | Routing trong Express | 📘 Bài 72 | |
| 22 | E3.6 | Cách đặt tên và chia thư mục | 📘 Bài 73 | |
| 23 | E3.7 | MVC Pattern | 📘 Bài 76 | 🤖 |
| 24 | E3.8 | RESTful API | 📘 Bài 77 | 🤖 |

#### Bổ sung - Học với AI:

| Order | Session | Topic | AI |
|-------|---------|-------|-----|
| 25 | E3.9 | HTTP Status codes & Headers | 🤖 |
| 26 | E3.10 | Middleware pattern | 🤖 |

**Dependency:** HTTP server → Express → Routing → MVC

---

### Step E4 - Authentication 🔴 (1.5 tuần)

> NÊN xem video - Auth flow cần thấy end-to-end

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 27 | E4.1 | JWT là gì | 📘 Bài 78 | |
| 28 | E4.2 | Access Token | 📘 Bài 79 | |
| 29 | E4.3 | Refresh Token là gì | 📘 Bài 80 | |
| 30 | E4.4 | Giải đáp thắc mắc về JWT | 📘 Bài 81 | |
| 31 | E4.5 | Validate với Express Validator | 📘 Bài 82 | |
| 32 | E4.6 | checkSchema để valid body | 📘 Bài 83 | |
| 33 | E4.7 | Kiểm tra email tồn tại | 📘 Bài 84 | |
| 34 | E4.8 | Tạo Access & Refresh Token | 📘 Bài 85 | |
| 35 | E4.9 | Error Handle trong Express | 📘 Bài 86 | 🤖 |
| 36 | E4.10 | wrapRequestHandler | 📘 Bài 87 | 🤖 |
| 37 | E4.11 | Chuẩn hóa bộ xử lý lỗi | 📘 Bài 88 | 🤖 |

**Dependency:** JWT Concept → Token Implementation → Error Handling

---

### Step E5 - Bổ sung (Optional) 🟢

> Học khi cần hoặc sau Giai đoạn 2

| Topic | Video | AI | Ghi chú |
|-------|-------|-----|---------|
| TypeScript cơ bản | 📘 Bài 4 (Ch.03) | 🤖 | Nếu chưa biết TS |
| TypeScript Generics | | 🤖 | Dùng nhiều trong NestJS |
| TypeScript Decorators | | 🤖 | Quan trọng cho NestJS |
| Git nâng cao | 📘 Bài 23-39 | | Biết cơ bản là đủ |
| MongoDB | 📘 Bài 57-70 | | NestJS dùng Prisma + PostgreSQL |
| Debug & Error Types | 📘 Bài 52-56 | | Học khi gặp bug |
| Media & Upload | 📘 Bài 117-135 | | Học sau ở NestJS Phase |

---

## ═══════════════════════════════════════════════════════════
## GIAI ĐOẠN 2: KHÓA NESTJS (📗)
## ═══════════════════════════════════════════════════════════

> **Mục tiêu:** Master NestJS - Enterprise framework
> **Prerequisites:** Hoàn thành Giai đoạn 1

---

### Step N1 - NestJS Fundamentals 🔴 (2 tuần)

> Cần xem video để hiểu architecture

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 38 | N1.1 | Giới thiệu Nest Framework | 📗 Bài 7 | |
| 39 | N1.2 | Khám phá bên trong Nest App | 📗 Bài 8 | |
| 40 | N1.3 | GET POST PUT DELETE | 📗 Bài 9 | |
| 41 | N1.4 | Prettier và Postman config | 📗 Bài 10 | |
| 42 | N1.5 | Phân tích CSDL và schema | 📗 Bài 11 | |
| 43 | N1.6 | Khởi tạo DB với Prisma | 📗 Bài 12 | |
| 44 | N1.7 | Prisma Service & Shared Module | 📗 Bài 13 | |
| 45 | N1.8 | Prisma CLI commands | 📗 Bài 14 | |
| 46 | N1.9 | Validate file .env | 📗 Bài 15 | 🤖 |
| 47 | N1.10 | Hashing service & register | 📗 Bài 16 | |
| 48 | N1.11 | Validation với DTO | 📗 Bài 17 | 🤖 |

#### Bổ sung - Học với AI:

| Order | Session | Topic | AI |
|-------|---------|-------|-----|
| 49 | N1.12 | Dependency Injection concept | 🤖 |
| 50 | N1.13 | Pipes | 🤖 |

**Dependency:** Architecture → Prisma → Validation

---

### Step N2 - Serialization & Auth 🔴 (2 tuần)

> NÊN xem video - Auth flow cần thấy end-to-end

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 51 | N2.1 | Serialization | 📗 Bài 18 | 🤖 |
| 52 | N2.2 | Interceptor | 📗 Bài 19 | 🤖 |
| 53 | N2.3 | JWT và Login | 📗 Bài 20 | |
| 54 | N2.4 | Refresh Token | 📗 Bài 21 | |
| 55 | N2.5 | Custom match decorator | 📗 Bài 22 | 🤖 |
| 56 | N2.6 | Type Predicate | 📗 Bài 23 | 🤖 |
| 57 | N2.7 | Postman post script | 📗 Bài 24 | |
| 58 | N2.8 | Guard bảo vệ route | 📗 Bài 25 | |
| 59 | N2.9 | API-key guard | 📗 Bài 26 | |
| 60 | N2.10 | Auth Guard nâng cao | 📗 Bài 27 | |
| 61 | N2.11 | Logout | 📗 Bài 28 | |
| 62 | N2.12 | Active User Decorator | 📗 Bài 29 | 🤖 |
| 63 | N2.13 | Get Posts | 📗 Bài 30 | |
| 64 | N2.14 | Create Update Delete Post | 📗 Bài 31 | |

#### Bổ sung - Học với AI:

| Order | Session | Topic | AI |
|-------|---------|-------|-----|
| 65 | N2.15 | Exception Filters | 🤖 |
| 66 | N2.16 | Repository Pattern | 🤖 |

**Dependency:** Serialization → JWT → Guards → CRUD

---

### Step N3 - Production Features 🟡 (4 tuần)

#### N3-A: File Upload (0.5 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 67 | N3.A.1 | Upload single file | 📗 Bài 107 | |
| 68 | N3.A.2 | File validation | 📗 Bài 108 | 🤖 |
| 69 | N3.A.3 | Upload Array & Serve static | 📗 Bài 109 | |
| 70 | N3.A.4 | AWS S3 | 📗 Bài 110-116 | |

#### N3-B: Email & OTP (0.5 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 71 | N3.B.1 | OTP Flow | 📗 Bài 47-49 | |
| 72 | N3.B.2 | Send Email (Resend) | 📗 Bài 50-52 | |
| 73 | N3.B.3 | React Email | 📗 Bài 53-54 | |
| 74 | N3.B.4 | Forgot Password | 📗 Bài 71 | |

#### N3-C: OAuth & 2FA (1 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 75 | N3.C.1 | OAuth Google Setup | 📗 Bài 63-65 | |
| 76 | N3.C.2 | OAuth Implement | 📗 Bài 66-68 | |
| 77 | N3.C.3 | 2FA | 📗 Bài 72-76 | |

#### N3-D: WebSocket (0.5 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 78 | N3.D.1 | WebSocket Basics | 📗 Bài 156-163 | 🤖 |

#### N3-E: Security (1 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 79 | N3.E.1 | Rate Limit | 📗 Bài 165 | 🤖 |
| 80 | N3.E.2 | Helmet | 📗 Bài 174 | 🤖 |
| 81 | N3.E.3 | Logger (Pino) | 📗 Bài 175-176 | 🤖 |
| 82 | N3.E.4 | Prisma Migrate | 📗 Bài 80-84 | |

#### N3-F: Redis & Queue (0.5 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 83 | N3.F.1 | Redis Caching | 📗 Bài 170-172 | 🤖 |
| 84 | N3.F.2 | Queue/BullMQ | 📗 Bài 149-153 | |

#### N3-G: Payment (0.5 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 85 | N3.G.1 | Payment Flow & Webhook | 📗 Bài 146-148 | |
| 86 | N3.G.2 | Sepay Integration | 📗 Bài 154-155 | |

---

### Step N4 - Fullstack & Deploy 🟡 (2 tuần)

| Order | Session | Topic | Video | AI |
|-------|---------|-------|-------|-----|
| 87 | N4.1 | Connect API + Frontend | | 🤖 |
| 88 | N4.2 | State Management | | 🤖 |
| 89 | N4.3 | Auth Flow E2E | | 🤖 |
| 90 | N4.4 | Docker | | 🤖 |
| 91 | N4.5 | VPS Setup | 📘 Bài 219 | |
| 92 | N4.6 | Nginx & SSL | 📘 Bài 219 | 🤖 |
| 93 | N4.7 | PM2 | | 🤖 |

---

### Step N5 - Advanced (Optional) 🟢

| Topic | Video | Ghi chú |
|-------|-------|---------|
| Role & Permission (RBAC) | 📗 Bài 85-97 | Nâng cao |
| i18n | 📗 Bài 118 | Đa ngôn ngữ |
| Cronjob | 📗 Bài 168 | Scheduled tasks |
| Filter & Pagination | 📗 Bài 132-133 | Product features |
| PostgreSQL Cloud | 📗 Bài 173 | DigitalOcean |

---

## Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    GIAI ĐOẠN 1: EXPRESS (📘)                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   JS Ôn tập ──► Node.js Core ──► Express Server            │
│        │              │               │                     │
│        └──────────────┼───────────────┘                     │
│                       ▼                                     │
│              MVC & Routing ──► JWT & Auth                   │
│                                    │                        │
└────────────────────────────────────┼────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    GIAI ĐOẠN 2: NESTJS (📗)                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   NestJS Fundamentals ──► Prisma ──► Auth                   │
│            │                           │                    │
│            └───────────────────────────┘                    │
│                         │                                   │
│                         ▼                                   │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Production Features:                                │   │
│   │ File Upload → Email/OTP → OAuth/2FA → WebSocket    │   │
│   │      ↓                                              │   │
│   │ Security → Redis/Queue → Payment                    │   │
│   └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                         ▼                                   │
│              Fullstack & Deploy                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tips học theo thứ tự

1. **Hoàn thành Giai đoạn 1 trước** - Nền tảng quan trọng
2. **Không skip Express Auth** - JWT và Error Handling giống NestJS
3. **Làm mini project sau mỗi step** - Áp dụng ngay
4. **🟢 COULD có thể học sau** - Quay lại khi cần
5. **Review trước khi qua giai đoạn mới** - Đảm bảo hiểu rõ

---

## Quick Start Checklist

**Giai đoạn 1:**
- [ ] E1: JavaScript Class, Async/Await đã hiểu
- [ ] E2: Hiểu Node.js runtime, npm
- [ ] E3: Tạo được Express server, routing
- [ ] E4: Implement JWT Auth, Error Handling

**Giai đoạn 2:**
- [ ] N1: Hiểu NestJS architecture
- [ ] N2: CRUD API với NestJS + Prisma + JWT
- [ ] N3: File Upload, OAuth, WebSocket, Security
- [ ] N4: Deploy lên VPS với Docker
