# Giai đoạn 2 Supplement: Production Features (N3-N4)

**Mục đích:** Bổ sung các tính năng production cần thiết cho job Backend/Fullstack
**Khóa:** NestJS (📗)
**Prerequisites:** Module N1-N2 (NestJS Fundamentals & Auth) đã hoàn thành

> ⚠️ **Đây là GIAI ĐOẠN 2** - Học sau khi hoàn thành Giai đoạn 1 (Express)
> 📌 **Xem thứ tự học chi tiết:** [LEARNING_ORDER.md](./LEARNING_ORDER.md)

---

## Chú thích

| Icon | Ý nghĩa |
|------|---------|
| 🔴 | **MUST** - Bắt buộc, cần cho job |
| 🟡 | **SHOULD** - Nên học, nâng cao CV |
| 🟢 | **COULD** - Học sau được |
| 🤖 | Có thể học với AI |

---

## Thứ tự học trong Phase này

```
1. File Upload      ← Đơn giản, học trước
2. Email & OTP      ← Cần cho OAuth, Forgot Password
3. OAuth & 2FA      ← Auth nâng cao
4. WebSocket        ← Độc lập
5. Security         ← Rate Limit, Helmet, Logger
6. Redis & Queue    ← Caching, Background jobs
7. Payment          ← Cuối cùng
```

---

## Module N3 - Advanced 🟡

> Nâng cao kiến trúc NestJS

| Session | Topic | Video | AI | Nội dung chính |
|---------|-------|-------|-----|----------------|
| N3.1 | Serialization | 📗 Bài 18 | 🤖 | Transform responses |
| N3.2 | Interceptors | 📗 Bài 19 | 🤖 | Logging, caching, transform |
| N3.3 | Exception Filters | 📗 Bài 45 | 🤖 | Custom error handling |
| N3.4 | Repository Pattern | 📗 Bài 46 | 🤖 | Clean architecture |
| N3.5 | CRUD Complete | 📗 Bài 30-31 | | Full CRUD implementation |
| N3.6 | Swagger | 📗 Bài 164 | 🤖 | API documentation |

---

## Module N4 - Production Features 🟡

### N4.A - File Upload 🔴

| Session | Topic | Video | AI | Nội dung |
|---------|-------|-------|-----|----------|
| N4.A.1 | Upload Single File | 📗 Bài 107 | | Multer, @UploadedFile |
| N4.A.2 | File Validation | 📗 Bài 108 | 🤖 | Type, size validation |
| N4.A.3 | Upload Multiple & Serve Static | 📗 Bài 109 | | Array upload, static files |
| N4.A.4 | AWS S3 | 📗 Bài 110-116 | | Cloud storage |

**Kiến thức cần học:**
- [ ] Multipart/form-data là gì
- [ ] Cấu hình Multer trong NestJS
- [ ] Validate file type (chỉ cho phép image/video)
- [ ] Validate file size (giới hạn MB)
- [ ] AWS S3 Bucket, IAM, Presigned URLs

**Code example:**
```typescript
// upload.controller.ts
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
uploadFile(@UploadedFile() file: Express.Multer.File) {
  return { filename: file.filename };
}
```

---

### N4.B - Email & OTP 🟡

| Session | Topic | Video | AI | Nội dung |
|---------|-------|-------|-----|----------|
| N4.B.1 | OTP Flow | 📗 Bài 47-49 | | Generate & verify OTP |
| N4.B.2 | Send Email (Resend) | 📗 Bài 50-52 | | Email service integration |
| N4.B.3 | React Email | 📗 Bài 53-54 | | Email templates |
| N4.B.4 | Forgot Password | 📗 Bài 71 | | Password reset flow |

---

### N4.C - OAuth & 2FA 🟡

| Session | Topic | Video | AI | Nội dung |
|---------|-------|-------|-----|----------|
| N4.C.1 | OAuth Google Setup | 📗 Bài 63-65 | | Google Cloud Console |
| N4.C.2 | OAuth Implement | 📗 Bài 66-68 | | Passport strategy |
| N4.C.3 | 2FA | 📗 Bài 72-76 | | TOTP authenticator |

**OAuth 2.0 Flow:**
```
1. User click "Login with Google"
2. Redirect đến Google consent screen
3. User đồng ý → Google redirect về app với code
4. Backend đổi code lấy access_token
5. Dùng token lấy user info từ Google
6. Tạo/tìm user trong DB → trả JWT cho frontend
```

---

### N4.D - WebSocket 🟡

| Session | Topic | Video | AI | Nội dung |
|---------|-------|-------|-----|----------|
| N4.D.1 | WebSocket Basics | 📗 Bài 156-163 | 🤖 | Gateway, events |

**Kiến thức cần học:**
- [ ] HTTP vs WebSocket (differences)
- [ ] Gateway trong NestJS là gì
- [ ] Decorators: `@WebSocketGateway`, `@SubscribeMessage`
- [ ] Rooms trong Socket.IO
- [ ] Authentication cho WebSocket

**Code example:**
```typescript
@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: string): string {
    return 'Hello world!';
  }
}
```

---

### N4.E - Security & Production 🔴

| Session | Topic | Video | AI | Nội dung |
|---------|-------|-------|-----|----------|
| N4.E.1 | Rate Limit | 📗 Bài 165 | 🤖 | Throttler, DDoS protection |
| N4.E.2 | Helmet | 📗 Bài 174 | 🤖 | Security headers |
| N4.E.3 | Logger (Pino) | 📗 Bài 175-176 | 🤖 | Production logging |
| N4.E.4 | Prisma Migrate | 📗 Bài 80-84 | | Database migrations |

---

### N4.F - Redis & Queue 🟡

| Session | Topic | Video | AI | Nội dung |
|---------|-------|-------|-----|----------|
| N4.F.1 | Redis Caching | 📗 Bài 170-172 | 🤖 | Cache responses |
| N4.F.2 | Queue/BullMQ | 📗 Bài 149-153 | | Background jobs |

---

### N4.G - Payment 🟡

| Session | Topic | Video | AI | Nội dung |
|---------|-------|-------|-----|----------|
| N4.G.1 | Payment Flow & Webhook | 📗 Bài 146-148 | | Stripe/MoMo integration |
| N4.G.2 | Sepay Integration | 📗 Bài 154-155 | | Local payment gateway |

---

## Learning Outcomes

Sau khi hoàn thành Module N3-N4:

- [ ] Upload file an toàn, validate đúng cách
- [ ] Tích hợp AWS S3 để lưu file trên cloud
- [ ] Implement OAuth 2.0 (Google login)
- [ ] Implement 2FA (TOTP)
- [ ] Hiểu WebSocket và Gateway pattern
- [ ] Build tính năng chat realtime
- [ ] Bảo vệ app với Rate Limit, Helmet
- [ ] Caching với Redis
- [ ] Background jobs với BullMQ
- [ ] Payment integration

---

## Resources

- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)
- [AWS SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [NestJS WebSockets](https://docs.nestjs.com/websockets/gateways)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [NestJS Throttler](https://docs.nestjs.com/security/rate-limiting)
- [BullMQ](https://docs.bullmq.io/)
