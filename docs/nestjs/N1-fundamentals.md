# N1 - NestJS Fundamentals (Bài 7-17)

**Mục tiêu:** Hiểu kiến trúc NestJS, tích hợp Prisma, validation, authentication cơ bản

---

## Bài 7 - Giới thiệu NestJS (Review)

### NestJS là gì?
- Node.js backend framework, build trên **ExpressJS** (mặc định) hoặc Fastify
- Dùng **TypeScript** → phát huy hết sức mạnh
- Kết hợp: **OOP** + **Functional Programming** + **Reactive Programming**

### So sánh Express vs Fastify vs NestJS

| Tiêu chí | Express | Fastify | NestJS |
|----------|---------|---------|--------|
| Hiệu suất | Trung bình | Cao nhất | Thấp nhất (do thêm tính năng) |
| Độ khó | Dễ nhất | Trung bình | Khó nhất (nhiều design pattern) |
| Hệ sinh thái | Lớn | Nhỏ | Lớn nhất |
| Document | Ổn | Ổn | Đầy đủ nhất |
| Cộng đồng | Nhiều nhất | Ít nhất | Trung bình |
| Khi nào chọn? | Người mới, dự án nhỏ | Cần performance cao | Doanh nghiệp, team lớn |

### Khi nào chọn NestJS?
- Làm việc **nhiều người** → có khung chuẩn để code theo quy chuẩn
- Dự án cần **bảo trì** lâu dài
- Dễ **tuyển dev** hơn

---

## Bài 8 - Khám phá bên trong Nest App (Review)

### Cấu trúc project

```
src/
├── main.ts              ← Entry point, bootstrap AppModule, port 3000
├── app.module.ts        ← Root module (imports, controllers, providers)
├── app.controller.ts    ← Xử lý routing (@Controller, @Get)
├── app.service.ts       ← Business logic (@Injectable)
```

### 3 thành phần chính

```
Module  = Nhà hàng (tổ chức mọi thứ)
├── Controller = Phục vụ (nhận request, trả response)
└── Service    = Đầu bếp (xử lý logic thực sự)
```

### Decorator là gì?
- **"Nhãn dán" đặc biệt** gắn lên class/method/property
- Bản chất là **function**, dấu `@` tự động gọi function đó
- NestJS đọc decorator → tự động cấu hình mọi thứ

```typescript
// @Controller() tương đương với: Controller()(AppController)
@Controller()
class AppController {
  @Get()              // NestJS hiểu: method GET, route '/'
  getHello() {
    return 'Hello'
  }
}
```

**Có `()` vs không `()`:**
- `@MyDecorator` → gọi trực tiếp: `MyDecorator(Class)`
- `@Controller('/posts')` → factory: `Controller('/posts')` trả về function → function đó nhận Class

### Dependency Injection (DI)
- NestJS tự tạo instance service và **tiêm** vào constructor
- Không cần `new Service()` thủ công
- Mặc định **singleton** (1 instance duy nhất, dùng chung)

```typescript
// Flow DI:
// 1. @Injectable()     → "Tôi có thể được tiêm"
// 2. @Module providers → "Đăng ký vào kho"
// 3. constructor(...)  → "Tôi cần service này"
// 4. NestJS            → "OK, lấy từ kho ra tiêm cho bạn"
```

### Bootstrap Flow

```
main.ts
  └── NestFactory.create(AppModule)
        └── AppModule đọc @Module({...})
              ├── imports: [...]        // Nạp module khác
              ├── controllers: [...]    // Đăng ký controllers
              └── providers: [...]      // Đăng ký services (DI container)
  └── app.listen(3000)
```

### Script chạy

```bash
npm run start:dev    # Dev mode + watch (tự reload khi sửa code)
npm run start        # Chạy bình thường (không watch)
npm run build        # Compile TS → JS vào thư mục dist/
npm run start:prod   # Chạy code từ dist/ (production)
```

---

## Bài 9 - GET POST PUT DELETE (Review)

### HTTP Methods trong NestJS

```typescript
@Controller('posts')        // Base route: /posts
class PostController {
  @Get()                    // GET /posts
  findAll() {}

  @Get(':id')               // GET /posts/123
  findOne(@Param('id') id: string) {}

  @Post()                   // POST /posts
  create(@Body() body: any) {}

  @Put(':id')               // PUT /posts/123
  update(@Param('id') id: string, @Body() body: any) {}

  @Delete(':id')            // DELETE /posts/123
  remove(@Param('id') id: string) {}
}
```

### Các decorator lấy dữ liệu

| Decorator | Lấy từ đâu | Ví dụ |
|-----------|------------|-------|
| `@Body()` | Request body | Data gửi lên từ form/JSON |
| `@Param('id')` | URL parameter | `/posts/123` → id = '123' |
| `@Query('page')` | Query string | `/posts?page=2` → page = '2' |

---

## Bài 10 - Prettier & Postman (Review)

### Prettier config (`.prettierrc`)

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### Postman setup
- Tạo **Collection** để quản lý requests
- Tạo **Environment** với biến `baseURL = http://localhost:3000`
- Dùng `{{baseURL}}` trong request thay vì viết trực tiếp URL

---

## Bài 11 - Phân tích CSDL và Schema

*(Sẽ cập nhật khi học)*

---

## Bài 12 - Khởi tạo DB với Prisma

*(Sẽ cập nhật khi học)*

---

## Bài 13 - Prisma Service & Shared Module

*(Sẽ cập nhật khi học)*

---

## Bài 14 - Prisma CLI Commands

*(Sẽ cập nhật khi học)*

---

## Bài 15 - Validate file .env

*(Sẽ cập nhật khi học)*

---

## Bài 16 - Hashing Service & Register

*(Sẽ cập nhật khi học)*

---

## Bài 17 - Validation với DTO

*(Sẽ cập nhật khi học)*

---

## Bổ sung: Dependency Injection (N1.12)

*(Sẽ cập nhật khi học)*

---

## Bổ sung: Pipes (N1.13)

*(Sẽ cập nhật khi học)*
