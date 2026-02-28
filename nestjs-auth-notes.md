# Ghi chú Khóa học NestJS & Prisma (Video 18 - 31)

Tài liệu này tổng hợp lại kiến thức từ file transcript bài giảng (video 18 đến 31) về việc xây dựng Backend với **NestJS**, **Prisma**, và **TypeScript**. Bao gồm các nội dung liên quan đến Serialization, Interceptors, Authentication, Custom Decorators, Type Predicates và xử lý cho module `Post`.

---

## 1. Serialization (Chuẩn hóa dữ liệu response)

Mục đích: Loại bỏ các trường nhạy cảm (như `password`) khỏi dữ liệu trả về cho client và định dạng lại response cho chuẩn.

### Sử dụng DTO để trả về dữ liệu (Ví dụ: `RegisterResponseDto`)
- Định nghĩa các thuộc tính cần trả về bằng `class`.
- Sử dụng decorator `@Exclude()` của class-transformer để chặn việc xuất (expose) thuộc tính nhạy cảm.

```typescript
import { Exclude, Expose, Transform } from 'class-transformer';

export class RegisterResponseDto {
  id: number;
  email: string;
  name: string;

  @Exclude() // Ẩn password khỏi response
  password: string;

  createdAt: Date;
  updatedAt: Date;

  // Ví dụ tạo thêm một key ảo (không có trong DB)
  @Expose()
  get emailName(): string {
    return `${this.email} ${this.name}`;
  }

  // Khởi tạo (optional)
  constructor(partial: Partial<RegisterResponseDto>) {
    Object.assign(this, partial);
  }
}
```

### Cách áp dụng Serialization ở Controller
Có 2 cách:
**Cách 1:** Sử dụng hàm dựng (constructor) kết hợp `return new`. Rất ngắn gọn và không cần cấu hình global thêm.
```typescript
@Post('register')
async register(@Body() body: RegisterDto) {
  const result = await this.authService.register(body);
  return new RegisterResponseDto(result);
}
```

**Cách 2:** Dùng `@SerializeOptions()` decorator (hoặc global interceptor). Yêu cầu đối tượng trả về được định dạng tốt.
```typescript
@UseInterceptors(ClassSerializerInterceptor)
// hoặc cấu hình Global trong app.module.ts
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
]
```
*(Khuyên dùng Cách 1 vì có thể kiểm soát linh hoạt mà không cần phải nested response DTO phức tạp).*

---

## 2. Interceptors

**Intercept** có nghĩa là chặn các luồng request/response. Nó chạy giữa **Client** và **Controller**.
- Thường sử dụng để transform response payload, thêm metadata (status code vào body), hoăc log thời gian xử lý.
- Phân biệt với **Middleware**: Middleware chỉ chạy *trước* khi request đến controller và theo một chiều.

### Logging Interceptor
Tính toán thời gian từ khi nhận request (trước khi vào controller) tới lúc trả về (sau khi controller xử lý xong).

```typescript
// shared/interceptors/logging.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => console.log(`After... ${Date.now() - now}ms`)),
      );
  }
}
```

### Transform Interceptor
Đưa dữ liệu payload do controller gửi ra gói gọn trong thuộc tính `data`, và có thể đọc status code từ *response header* đưa thẳng vào object.

```typescript
// shared/interceptors/transform.interceptor.ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode; // Lấy status code 200, 201...

    return next.handle().pipe(
      map(data => ({
        statusCode,
        data,
      })),
    );
  }
}
```

**Cấu hình cho cả App (Global interceptors):**
```typescript
// main.ts
app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());
```

---

## 3. JWT Authentication (Đăng nhập & Phát hành Token)

NestJS cung cấp gói `@nestjs/jwt`. Khai báo một dịch vụ (ví dụ: `TokenService`) để chuyên xử lý sign và verify.

```typescript
// Thêm payload Type
export interface TokenPayload {
  userId: number;
  iat?: number;
  exp?: number;
}
```

### Tạo Access & Refresh Token Stateful
```typescript
// auth.service.ts
async login(body: LoginDto) {
  const user = await this.prisma.user.findUnique({ where: { email: body.email }});
  if (!user) throw new UnauthorizedException();

  // (Verify password bằng HashingService) -> throw 422 nếu sai.

  // Sign tokens
  const payload: TokenPayload = { userId: user.id };
  const accessToken = await this.jwtService.signAsync(payload, {
    secret: process.env.ACCESS_SECRET,
    expiresIn: '15m'
  });

  const refreshToken = await this.jwtService.signAsync(payload, {
    secret: process.env.REFRESH_SECRET,
    expiresIn: '7d'
  });

  // Stateful Refresh Token: Decode để lấy exp time và lưu vào Prisma (Db)
  const decodedRf = await this.jwtService.decode(refreshToken) as TokenPayload;
  const expDate = new Date(decodedRf.exp! * 1000);

  // Lưu token vào DB để check revoke sau này
  await this.prisma.refreshToken.create({
    data: {
      token: refreshToken,
      expiresAt: expDate,
      userId: user.id
    }
  });

  return new LoginResponseDto({ accessToken, refreshToken });
}
```

### Xử lý Refresh Token
Khi refresh, client gửi lên Refresh Token:
1. Xác thực (Verify).
2. Kiểm tra xem Refresh Token có bị revoke không (Có tồn tại trong DB không).
3. Nếu ok -> Quăng token cũ và cấp token mới (Rotate).

```typescript
async refreshToken(refreshToken: string) {
  try {
     const decoded = await this.jwtService.verifyAsync(refreshToken, { secret: process.env.REFRESH_SECRET });

     // findUniqueOrThrow sẽ báo lỗi nếu token không có trong DB
     await this.prisma.refreshToken.findUniqueOrThrow({ where: { token: refreshToken }});

     // Tiến hành xóa token cũ
     await this.prisma.refreshToken.delete({ where: { token: refreshToken } });

     // (Tạo mới và lưu lại giống bước login) -> Return...
  } catch(error) {
     if (this.isPrismaRecordNotFoundError(error)) { // Kiểm tra P2025
       throw new UnauthorizedException('Refresh token đã bị revoked');
     }
     throw new UnauthorizedException();
  }
}
```

---

## 4. Custom Validators Decorator (`@Match`)

Kiểm tra `confirmPassword` có khớp với `password` hay không bằng cách tạo Custom Validator Class.

```typescript
// shared/decorators/match.decorator.ts
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: (args: ValidationArguments) => `${propertyName} không khớp với ${args.constraints[0]}`,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          // Chỗ này kiểm tra custom
          return typeof value === 'string' && typeof relatedValue === 'string' && value === relatedValue;
        },
      },
    });
  };
}

// Cách dùng trong DTO
export class RegisterDto {
  password: string;

  @Match('password', { message: 'Mật khẩu phải khớp!' })
  confirmPassword: string;
}
```

---

## 5. Type Predicate (Dự đoán Type trong TS)

Dễ dàng tái sử dụng khi kiểm tra mã lỗi Prisma. Ví dụ check lỗi `P2002` (Trùng unique) hoặc `P2025` (Record NotFound).

```typescript
// shared/helpers/prisma-errors.helper.ts
import { Prisma } from '@prisma/client';

export function isUniqueConstraintError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export function isNotFoundError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025';
}
```
**Ứng dụng:**
```typescript
try { ... }
catch(error) {
  if (isUniqueConstraintError(error)) {  // TS sẽ hiểu `error` là Prisma error Type.
    throw new ConflictException('Email đã tồn tại!');
  }
}
```

---

## 6. Mẹo Postman Automation

Tại mục Tests (Post-response) trong request Login bên Postman để khỏi copy bằng tay token:

```javascript
const response = pm.response.json();
if (pm.response.to.be.success) {
    pm.environment.set("accessToken", response.data.accessToken);
    pm.environment.set("refreshToken", response.data.refreshToken);
}
```

---

## 7. Guards và Multi-Strategy Authentication (`AND`/`OR`)

Cách bảo vệ APIs. Nếu dùng auth thông thường:
```typescript
@UseGuards(AccessTokenGuard) // Chặn API nếu không có Access Token hợp lệ
```

### Tạo `@Auth()` decorator thay cho `@UseGuards` để kết hợp API_KEY và JWT theo luật AND/OR
1. **Các cấu hình:**
```typescript
export const AUTH_TYPE = {
  BEARER: 'BEARER',
  API_KEY: 'API_KEY',
  NONE: 'NONE',
} as const;

export const CONDITION = { OR: 'OR', AND: 'AND' } as const;
```

2. **Decorator:** Truyền Metadata cho NestJS Route
```typescript
import { SetMetadata } from '@nestjs/common';
export const AUTH_KEY = 'AUTH_TYPE_KEY';

export const Auth = (
  types: Array<keyof typeof AUTH_TYPE>,
  condition: keyof typeof CONDITION = 'AND'
) => SetMetadata(AUTH_KEY, { types, condition });
```

3. **Global Authentication Guard (`AuthenticationGuard`):** Chứa hai vệ tinh là `AccessTokenGuard` và `ApiKeyGuard`.
```typescript
@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard
  ) {}

  private readonly guardMap = {
    [AUTH_TYPE.BEARER]: this.accessTokenGuard,
    [AUTH_TYPE.API_KEY]: this.apiKeyGuard,
    [AUTH_TYPE.NONE]: { canActivate: () => true }, // Pass mượt nếu NONE
  };

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authData = this.reflector.get<{ types: string[], condition: string }>(
      AUTH_KEY,
      context.getHandler()
    ) ?? { types: [AUTH_TYPE.NONE], condition: CONDITION.AND }; // Giá trị mặc định

    // Map `types` (string[]) thành guard instant object array
    const guards = authData.types.map(t => this.guardMap[t]);

    // Error cơ bản
    let error = new UnauthorizedException();

    if (authData.condition === CONDITION.OR) {
      // Logic OR: Chỉ cần 1 guard qua (return true) là được duyệt.
      for (const guard of guards) {
        try {
          const result = await Promise.resolve(guard.canActivate(context));
          if (result) return true;
        } catch (err) {
          // Bắt lỗi để không crash loop => pass cho Guard kế tiếp.
          error = err;
        }
      }
      throw error;
    } else {
      // Logic AND: Phải qua hết tất cả các guard. Sai cái nào ném lỗi ngay cái đó.
      for (const guard of guards) {
        const result = await Promise.resolve(guard.canActivate(context));
        if (!result) throw error;
      }
      return true;
    }
  }
}
```

*Trong `app.module.ts`:* Setup Guard ở dạng Global!
```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: AuthenticationGuard,
  },
]
```
*(Sử dụng: `@Auth(['BEARER', 'API_KEY'], 'OR')` ở controller)*

---

## 8. Custom Parameter Decorator (`@ActiveUser()`)

Dùng để tự động bóc tách dữ liệu payload của JWT (như `userId`) từ Request object mà không cần gọi `req.user` ở Controller.

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../types';

export const ActiveUser = createParamDecorator(
  (field: keyof TokenPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // Giả sử `req.user` đã được gán bởi AccessTokenGuard trước đó
    const user: TokenPayload | undefined = request['user'];

    return field ? user?.[field] : user;
  },
);

// ==== Cách dùng trong Controller ====
@Post('create')
async create(@ActiveUser('userId') userId: number, @Body() body: CreatePostBodyDto) {
  return this.postService.create(userId, body);
}
```

---

## 9. Xử lý Logic CRUD cho `Post` Module

Mãu tương tác DB với các Post của user (phân quyền dữ liệu theo User).
- Dùng `include: { author: true }` để fetch Data như JOIN SQL, sau đó dùng Serialization để ẩn password của Author.
- Khi Delete / Update phải check thêm logic là bài post đó phải do `userId` thực hiện (authorId).

**Ví dụ một số function trên PostService:**

```typescript
// --- Tìm tất cả của user (GET) ---
async findMany(authorId: number) {
  const posts = await this.prisma.post.findMany({
    where: { authorId },
    include: { author: true }
  });
  // Transform sang DTO
  return posts.map(post => new GetPostItemDto(post));
}

// --- Cập nhật bài Post của người dùng (UPDATE) ---
async update(userId: number, postId: number, data: UpdatePostBodyDto) {
  try {
    const post = await this.prisma.post.update({
      where: {
        id: postId,
        authorId: userId // <-- Quan trọng: Xác nhận người dùng sở hữu Post
      },
      data,
    });
    return post;
  } catch (error) {
    if (isNotFoundError(error)) { // bắt lỗi 2025
      throw new NotFoundException('Post không tìm thấy hoặc bạn không có quyền edit!');
    }
    throw error;
  }
}

// --- Xóa bài Post (DELETE) ---
async delete(userId: number, postId: number) {
  // Lặp lại logic tìm đúng người đúng bài để xóa
  try {
     await this.prisma.post.delete({
       where: { id: postId, authorId: userId }
     });
     return true;
  } catch (error) {
     throw new NotFoundException('Post không tìm thấy hoặc bạn không có quyền delete!');
  }
}
```

**Ví dụ Schema Type và DTO (Post có lồng User):**
Cần dùng `@Type` để Nested class mapping đúng.
```typescript
import { Type } from 'class-transformer';
import { UserModel } from './user.model';

export class PostModel {
  id: number;
  title: string;
  content: string;
  authorId: number;
}

export class GetPostItemDto extends PostModel {
  @Type(() => UserModel) // Map thuộc tính lồng
  author: UserModel;

  constructor(partial: Partial<GetPostItemDto>) {
    super();
    Object.assign(this, partial);
  }
}
```

---
*Ghi chép tự động tạo từ transcript video 18-31 phục vụ Leminho học tập thực tế.*