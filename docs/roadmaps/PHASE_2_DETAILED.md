# Giai đoạn 1: Server & Routing + Authentication

**Duration:** 2-3 tuần
**Goal:** Hiểu HTTP server, Express routing, MVC pattern, và JWT Authentication
**Khóa:** Express (📘)

> ⚠️ **Đây là GIAI ĐOẠN 1** - Học trước khi sang NestJS

---

## Module E3 - Server & Routing 🔴

| Session | Topic | Video | Nội dung chính |
|---------|-------|-------|----------------|
| E3.1 | Tạo server đầu tiên | 📘 Bài 48 | http.createServer, request/response |
| E3.2 | Fix lỗi xung đột port | 📘 Bài 49 | Port conflict, EADDRINUSE |
| E3.3 | Express.js cơ bản | 📘 Bài 50 | Express app, middleware |
| E3.4 | Setup Node + TypeScript + ESLint | 📘 Bài 51 | Project configuration |
| E3.5 | Routing trong Express | 📘 Bài 72 | Router, path parameters |
| E3.6 | Cách đặt tên và chia thư mục | 📘 Bài 73 | Project structure |
| E3.7 | MVC Pattern | 📘 Bài 76 | Model-View-Controller |
| E3.8 | RESTful API | 📘 Bài 77 | REST conventions, HTTP methods |

**Mini Project:** Todo API hoặc Notes API đơn giản

---

## Module E4 - Authentication 🔴

> **Quan trọng!** JWT và Error Handling pattern giống NestJS

| Session | Topic | Video | Nội dung chính |
|---------|-------|-------|----------------|
| E4.1 | JWT là gì | 📘 Bài 78 | JSON Web Token concept |
| E4.2 | Access Token | 📘 Bài 79 | Short-lived token |
| E4.3 | Refresh Token là gì | 📘 Bài 80 | Long-lived token, rotation |
| E4.4 | Giải đáp thắc mắc về JWT | 📘 Bài 81 | Common questions |
| E4.5 | Validate với Express Validator | 📘 Bài 82 | Input validation |
| E4.6 | checkSchema để valid body | 📘 Bài 83 | Schema-based validation |
| E4.7 | Kiểm tra email tồn tại | 📘 Bài 84 | Custom validator |
| E4.8 | Tạo Access & Refresh Token | 📘 Bài 85 | Token generation |
| E4.9 | Error Handle trong Express | 📘 Bài 86 | Error middleware |
| E4.10 | wrapRequestHandler | 📘 Bài 87 | Async error handling |
| E4.11 | Chuẩn hóa bộ xử lý lỗi | 📘 Bài 88 | Error response format |

**Mini Project:** Auth API với Register, Login, Logout

---

## Tại sao học phase này?

Trước khi dùng NestJS, bạn cần hiểu:

1. **HTTP fundamentals** - Request/Response cycle
2. **Routing logic** - URL parsing, path matching
3. **Middleware pattern** - Cách Express/NestJS hoạt động bên trong
4. **JWT Authentication** - Pattern giống nhau ở cả Express và NestJS
5. **Error handling** - Best practices cho API

---

## HTTP Request Flow

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   Client                                          Server    │
│     │                                               │       │
│     │ ──── HTTP Request ─────────────────────────► │       │
│     │     (method, url, headers, body)              │       │
│     │                                               │       │
│     │                                         ┌─────┴─────┐ │
│     │                                         │ Middleware │ │
│     │                                         │     ↓      │ │
│     │                                         │  Router    │ │
│     │                                         │     ↓      │ │
│     │                                         │  Handler   │ │
│     │                                         └─────┬─────┘ │
│     │                                               │       │
│     │ ◄─── HTTP Response ───────────────────────── │       │
│     │     (status, headers, body)                   │       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Learning Outcomes

Sau Module E3-E4, bạn sẽ:

- [ ] Tạo được HTTP server với Express
- [ ] Implement routing system
- [ ] Hiểu MVC pattern
- [ ] Parse request body (JSON)
- [ ] Gửi response với đúng status codes
- [ ] Implement JWT authentication
- [ ] Validate input với Express Validator
- [ ] Handle errors gracefully
- [ ] Hiểu tại sao frameworks như NestJS tồn tại

---

## Next Step

Sau khi hoàn thành Giai đoạn 1, tiếp tục:
- **[Phase 3: NestJS Framework](./PHASE_3_DETAILED.md)** - Enterprise framework

---

## Resources

- [Express.js Official Docs](https://expressjs.com/)
- [HTTP MDN Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP)
- [JWT.io](https://jwt.io/)
