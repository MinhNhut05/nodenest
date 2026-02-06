# Ôn tập Session 2.1.2 - HTTP Methods với NestJS

> **Nguồn:** Khóa NestJS - Bài 9: Làm quen GET POST PUT DELETE
> **Ngày học:** 2026-02-03

---

## Tổng quan

Bài này học cách sử dụng HTTP Methods trong NestJS framework thay vì Node.js thuần.

---

## 1. NestJS CLI Commands

### Tạo Module
```bash
nest g mo posts          # Generate module
# CREATE src/posts/posts.module.ts
```

### Tạo Controller
```bash
nest g co posts          # Generate controller
# CREATE src/posts/posts.controller.ts
# CREATE src/posts/posts.controller.spec.ts
# UPDATE src/posts/posts.module.ts
```

### Tạo Service
```bash
nest g s posts           # Generate service
# CREATE src/posts/posts.service.ts
# CREATE src/posts/posts.service.spec.ts
# UPDATE src/posts/posts.module.ts
```

### Tạo Resource (CRUD đầy đủ)
```bash
nest g res posts         # Generate full CRUD resource
# Tạo module + controller + service + DTOs
```

---

## 2. Controller Structure

### Basic Controller
```typescript
import { Controller } from '@nestjs/common';

@Controller('posts')      // Route prefix: /posts
export class PostsController {}
```

### Controller với Dependency Injection
```typescript
import { Controller, Get } from '@nestjs/common';
import { PostsService } from 'src/posts/posts.service';

@Controller('posts')
export class PostsController {
  // Inject service qua constructor
  constructor(private readonly postsService: PostsService) {}

  @Get()                  // GET /posts
  getPosts() {
    return this.postsService.getPosts();
  }
}
```

---

## 3. HTTP Method Decorators

### @Get() - Lấy dữ liệu
```typescript
@Get()                    // GET /posts
getPosts() {
  return this.postsService.getPosts();
}

@Get(':id')               // GET /posts/:id
getPost(@Param('id') id: string) {
  return this.postsService.getPost(id);
}
```

### @Post() - Tạo mới
```typescript
@Post()                   // POST /posts
createPost(@Body() body: any) {
  return this.postsService.createPost(body);
}
```

### @Put() - Cập nhật toàn bộ
```typescript
@Put(':id')               // PUT /posts/:id
updatePost(@Param('id') id: string, @Body() body: any) {
  return this.postsService.updatePost(id, body);
}
```

### @Delete() - Xóa
```typescript
@Delete(':id')            // DELETE /posts/:id
deletePost(@Param('id') id: string) {
  return this.postsService.deletePost(id);
}
```

---

## 4. Service Structure

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()             // Đánh dấu là provider, có thể inject
export class PostsService {

  getPosts() {
    return 'All posts';
  }

  createPost(body: any) {
    return body;
  }

  getPost(id: string) {
    return `Post ${id}`;
  }

  updatePost(id: string, body: any) {
    return `Updated post ${id}`;
  }

  deletePost(id: string) {
    return `Deleted post ${id}`;
  }
}
```

---

## 5. Module Structure

### posts.module.ts
```typescript
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
```

### app.module.ts (Root module)
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [PostsModule],        // Import PostsModule
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

## 6. Parameter Decorators

| Decorator | Mô tả | Ví dụ |
|-----------|-------|-------|
| `@Param('id')` | Lấy route parameter | `/posts/:id` → `id` |
| `@Body()` | Lấy request body | POST data |
| `@Query('key')` | Lấy query string | `?key=value` |

---

## 7. Folder Structure

```
src/
├── posts/
│   ├── posts.controller.ts      # Handle HTTP requests
│   ├── posts.controller.spec.ts # Unit tests
│   ├── posts.module.ts          # Module definition
│   ├── posts.service.ts         # Business logic
│   └── posts.service.spec.ts    # Unit tests
├── app.controller.ts
├── app.module.ts                # Root module
├── app.service.ts
└── main.ts                      # Entry point
```

---

## 8. Terminal Output

Khi chạy `npm run start:dev`:
```
[Nest] Starting Nest application...
[Nest] AppModule dependencies initialized
[Nest] PostsModule dependencies initialized
[Nest] RoutesResolver AppController {/}
[Nest] RouterExplorer Mapped {/, GET} route
[Nest] RouterExplorer Mapped {/posts, GET} route
[Nest] RouterExplorer Mapped {/posts/:id, GET} route
[Nest] RouterExplorer Mapped {/posts, POST} route
[Nest] RouterExplorer Mapped {/posts/:id, PUT} route
[Nest] RouterExplorer Mapped {/posts/:id, DELETE} route
[Nest] Nest application successfully started
```

---

## 9. Key Concepts

### Decorators đã học
| Decorator | Loại | Mục đích |
|-----------|------|----------|
| `@Controller()` | Class | Đánh dấu class là controller |
| `@Injectable()` | Class | Đánh dấu class là provider (có thể inject) |
| `@Module()` | Class | Định nghĩa module |
| `@Get()` | Method | Handle GET request |
| `@Post()` | Method | Handle POST request |
| `@Put()` | Method | Handle PUT request |
| `@Delete()` | Method | Handle DELETE request |
| `@Param()` | Parameter | Lấy route parameter |
| `@Body()` | Parameter | Lấy request body |

### Dependency Injection
```typescript
constructor(private readonly postsService: PostsService) {}
```
- NestJS tự động inject `PostsService` vào controller
- `private readonly` = tạo property và gán giá trị trong 1 dòng

---

## 10. So sánh với Node.js thuần

| Aspect | Node.js thuần | NestJS |
|--------|---------------|--------|
| Routing | `if (req.url === '/posts')` | `@Controller('posts')` |
| Methods | `if (req.method === 'GET')` | `@Get()` |
| Body | `req.on('data', ...)` | `@Body()` |
| Params | `url.split('/')[2]` | `@Param('id')` |
| Structure | Tự tổ chức | Module/Controller/Service |

---

## Quiz tự kiểm tra

1. **Decorator nào dùng để đánh dấu một class là controller?**
   - [ ] `@Injectable()`
   - [x] `@Controller()`
   - [ ] `@Module()`

2. **Làm sao để inject service vào controller?**
   - [x] Khai báo trong constructor với `private readonly`
   - [ ] Dùng `@Inject()` decorator
   - [ ] Import trực tiếp

3. **Route `/posts/:id` với method GET cần dùng decorator nào?**
   - [x] `@Get(':id')` + `@Param('id')`
   - [ ] `@Get('/:id')`
   - [ ] `@GetById()`

4. **File nào chứa business logic trong NestJS?**
   - [ ] Controller
   - [x] Service
   - [ ] Module

---

## Next Steps

- [ ] 2.1.3 - Request Body Parsing (đã có prompt)
- [ ] 2.1.4 - Response & Status codes
- [ ] Phase 3 - NestJS chi tiết hơn

---

**Note:** Bài này thực ra là preview của Phase 3 (NestJS). Trong roadmap, 2.1.2 ban đầu là HTTP Methods với Node.js thuần, nhưng video khóa học dạy thẳng NestJS. Điều này tốt vì bạn đã có cái nhìn tổng quan về NestJS trước khi đi sâu.
