# Giai đoạn 2: NestJS Framework

**Duration:** 4 tuần
**Goal:** Master NestJS - Enterprise-grade Node.js framework
**Khóa:** NestJS (📗)
**Prerequisites:** Hoàn thành Giai đoạn 1 (Express)

> ⚠️ **Đây là GIAI ĐOẠN 2** - Phải học xong Giai đoạn 1 trước!

---

## Module N1 - NestJS Fundamentals 🔴 (2 tuần)

| Session | Topic | Video | Nội dung chính |
|---------|-------|-------|----------------|
| N1.1 | Giới thiệu Nest Framework | 📗 Bài 7 | Tại sao dùng NestJS |
| N1.2 | Khám phá bên trong Nest App | 📗 Bài 8 | Project structure |
| N1.3 | GET POST PUT DELETE | 📗 Bài 9 | HTTP methods in NestJS |
| N1.4 | Prettier và Postman config | 📗 Bài 10 | Dev environment |
| N1.5 | Phân tích CSDL và schema | 📗 Bài 11 | Database design |
| N1.6 | Khởi tạo DB với Prisma | 📗 Bài 12 | Prisma setup |
| N1.7 | Prisma Service & Shared Module | 📗 Bài 13 | Module organization |
| N1.8 | Prisma CLI commands | 📗 Bài 14 | db push, migrate, generate |
| N1.9 | Validate file .env | 📗 Bài 15 | Environment validation |
| N1.10 | Hashing service & register | 📗 Bài 16 | Password hashing |
| N1.11 | Validation với DTO | 📗 Bài 17 | class-validator, class-transformer |

---

## Module N2 - Serialization & Auth 🔴 (2 tuần)

| Session | Topic | Video | Nội dung chính |
|---------|-------|-------|----------------|
| N2.1 | Serialization | 📗 Bài 18 | Transform responses |
| N2.2 | Interceptor | 📗 Bài 19 | Logging, caching, transform |
| N2.3 | JWT và Login | 📗 Bài 20 | JWT Authentication |
| N2.4 | Refresh Token | 📗 Bài 21 | Token rotation |
| N2.5 | Custom match decorator | 📗 Bài 22 | @Match decorator |
| N2.6 | Type Predicate | 📗 Bài 23 | TypeScript type guards |
| N2.7 | Postman post script | 📗 Bài 24 | Auto save tokens |
| N2.8 | Guard bảo vệ route | 📗 Bài 25 | AuthGuard |
| N2.9 | API-key guard | 📗 Bài 26 | API key authentication |
| N2.10 | Auth Guard nâng cao | 📗 Bài 27 | Conditional guards |
| N2.11 | Logout | 📗 Bài 28 | Token invalidation |
| N2.12 | Active User Decorator | 📗 Bài 29 | @ActiveUser decorator |
| N2.13 | Get Posts | 📗 Bài 30 | CRUD - Read |
| N2.14 | Create Update Delete Post | 📗 Bài 31 | CRUD - CUD |

---

## NestJS Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       NestJS App                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Modules  │───►│ Controllers  │───►│  Services    │      │
│  └──────────┘    └──────────────┘    └──────────────┘      │
│       │                │                    │               │
│       │                │                    │               │
│       ▼                ▼                    ▼               │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │ Providers│    │   Guards     │    │ Repositories │      │
│  └──────────┘    └──────────────┘    └──────────────┘      │
│                        │                                    │
│                        ▼                                    │
│                  ┌──────────────┐                          │
│                  │    Pipes     │                          │
│                  └──────────────┘                          │
│                        │                                    │
│                        ▼                                    │
│                  ┌──────────────┐                          │
│                  │ Interceptors │                          │
│                  └──────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## So sánh với Express (Giai đoạn 1)

| Concept | Express (📘) | NestJS (📗) |
|---------|--------------|-------------|
| Routing | app.get(), router | @Controller, @Get |
| Middleware | app.use() | @Injectable middleware |
| Validation | express-validator | class-validator + DTO |
| Auth | JWT + custom middleware | Guards + Passport |
| Error Handling | Error middleware | Exception Filters |
| DI | Manual | Built-in @Injectable |

---

## Learning Outcomes

Sau Module N1-N2, bạn sẽ:

- [ ] Hiểu NestJS architecture (Modules, Controllers, Services)
- [ ] Sử dụng Dependency Injection hiệu quả
- [ ] Validate data với DTOs và Pipes
- [ ] Kết nối database với Prisma ORM
- [ ] Implement authentication với JWT
- [ ] Phân quyền với Guards
- [ ] Handle errors với Exception Filters
- [ ] Transform responses với Interceptors
- [ ] CRUD API hoàn chỉnh

---

## Next Step

Sau khi hoàn thành, tiếp tục:
- **[Phase 3 Supplement: Production Features](./PHASE_3_SUPPLEMENT.md)** - OAuth, 2FA, WebSocket, Payment

---

## Resources

- [NestJS Official Docs](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [class-validator](https://github.com/typestack/class-validator)
