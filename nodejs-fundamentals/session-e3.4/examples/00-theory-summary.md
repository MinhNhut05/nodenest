# Session E3.4: Cách Chia Thư Mục (Project Structure)

> Tài liệu lý thuyết chi tiết về cách tổ chức folder/file trong Node.js + TypeScript project.

---

## PHẦN 1: TẠI SAO CẦN CHIA THƯ MỤC?

### 1.1. Vấn đề khi code tất cả trong 1 file

Hãy tưởng tượng bạn có một file `server.ts` với 2000 dòng code:

```typescript
// server.ts - 2000 lines of code
import http from 'http';

// Database connection (line 1-50)
// User model (line 51-100)
// Product model (line 101-150)
// Auth logic (line 151-300)
// User handlers (line 301-500)
// Product handlers (line 501-700)
// Validation logic (line 701-900)
// Utility functions (line 901-1000)
// Routes (line 1001-1200)
// Server setup (line 1201-2000)
// ... và còn nữa
```

**Các vấn đề phát sinh:**

| Vấn đề | Mô tả |
|--------|-------|
| **Hard to navigate** | Cuộn lên xuống liên tục để tìm code cần sửa |
| **Merge conflicts** | Nhiều người cùng sửa 1 file → conflict liên tục |
| **Khó test** | Không thể test riêng từng phần |
| **Khó reuse** | Muốn dùng lại 1 function phải copy-paste |
| **Khó debug** | Bug ở đâu? Trong 2000 dòng! |

---

### 1.2. Separation of Concerns (SoC) - Tách biệt mối quan tâm

**Separation of Concerns** là nguyên tắc thiết kế phần mềm:
> Mỗi phần code chỉ nên làm **MỘT việc** và làm tốt việc đó.

#### Ví dụ thực tế: Nhà hàng

| Vai trò | Nhiệm vụ | Tương đương trong code |
|---------|----------|------------------------|
| **Waiter** (Phục vụ) | Nhận order, trả món | `Controller` - Nhận request, trả response |
| **Chef** (Đầu bếp) | Nấu món ăn | `Service` - Xử lý business logic |
| **Pantry** (Kho) | Lưu trữ nguyên liệu | `Model` - Quản lý data |
| **Recipe Book** | Công thức nấu ăn | `Utils` - Helper functions |

**Waiter không nấu ăn, Chef không phục vụ khách** → Mỗi người làm đúng việc của mình!

---

### 1.3. Maintainability (Dễ bảo trì)

Khi code được chia nhỏ:

```
✅ Bug ở user login? → Mở user.controller.ts hoặc user.service.ts
✅ Cần thêm field cho User? → Mở user.model.ts
✅ Cần thêm route mới? → Mở user.routes.ts
```

So với:

```
❌ Bug ở đâu đó trong server.ts (2000 dòng)
❌ Ctrl+F và hy vọng tìm được
```

---

### 1.4. Scalability (Dễ mở rộng)

**Chia thư mục tốt = Dễ thêm tính năng mới**

Thêm tính năng "Products":

```
Layer-based:
├── controllers/
│   ├── user.controller.ts
│   └── product.controller.ts  ← Thêm file mới
├── services/
│   ├── user.service.ts
│   └── product.service.ts     ← Thêm file mới
```

Không cần sửa code cũ, chỉ cần **thêm file mới**!

---

### 1.5. Team Collaboration (Nhiều người cùng làm)

Khi làm việc nhóm:

| Developer | Làm việc với | Conflict? |
|-----------|-------------|-----------|
| Dev A | `user.controller.ts` | ❌ Không |
| Dev B | `product.service.ts` | ❌ Không |
| Dev C | `auth.middleware.ts` | ❌ Không |

**Mỗi người làm việc với file riêng → Ít conflict!**

---

### 1.6. Tóm tắt Phần 1

| Lý do | Lợi ích |
|-------|---------|
| **Separation of Concerns** | Mỗi file làm 1 việc, code rõ ràng |
| **Maintainability** | Dễ tìm, dễ sửa bug |
| **Scalability** | Thêm tính năng = thêm file, không sửa code cũ |
| **Team Collaboration** | Nhiều người làm việc song song, ít conflict |

---

## PHẦN 2: CÁC FOLDER PHỔ BIẾN

### 2.1. Cấu trúc tổng quan

```
project-root/
├── src/                    # Source code chính
│   ├── index.ts            # Entry point
│   ├── app.ts              # Server/App setup
│   ├── controllers/        # Xử lý request/response
│   ├── services/           # Business logic
│   ├── models/             # Data models
│   ├── routes/             # Route definitions
│   ├── middlewares/        # Middleware functions
│   ├── utils/              # Utility/helper functions
│   ├── config/             # Configuration files
│   ├── types/              # TypeScript types/interfaces
│   └── constants/          # Constants, enums
├── tests/                  # Test files
├── dist/                   # Compiled JavaScript (build output)
├── node_modules/           # Dependencies
├── package.json
├── tsconfig.json
└── .gitignore
```

---

### 2.2. Chi tiết từng folder

#### 📁 `src/` - Source code chính

Chứa toàn bộ source code TypeScript. Khi build sẽ compile sang `dist/`.

```typescript
// Tại sao dùng src/?
// - Tách biệt source code và build output
// - Dễ config tsconfig.json
// - Convention phổ biến trong TypeScript projects
```

---

#### 📁 `controllers/` - Xử lý Request/Response

**Nhiệm vụ:** Nhận request từ client, gọi service, trả response.

```typescript
// controllers/user.controller.ts
import { UserService } from '../services/user.service';

export class UserController {
  // Nhận request → Gọi service → Trả response
  static async getUsers(req: Request, res: Response) {
    const users = await UserService.findAll();  // Gọi service
    res.json({ success: true, data: users });   // Trả response
  }

  static async createUser(req: Request, res: Response) {
    const userData = req.body;                        // Lấy data từ request
    const newUser = await UserService.create(userData); // Gọi service
    res.status(201).json({ success: true, data: newUser });
  }
}
```

**Controller KHÔNG nên:**
- ❌ Truy cập database trực tiếp
- ❌ Chứa business logic phức tạp
- ❌ Validate data (nên dùng middleware hoặc service)

---

#### 📁 `services/` - Business Logic

**Nhiệm vụ:** Xử lý logic nghiệp vụ, tương tác với model/database.

```typescript
// services/user.service.ts
import { UserModel, User } from '../models/user.model';

export class UserService {
  // Business logic: tìm tất cả users
  static async findAll(): Promise<User[]> {
    return UserModel.getAll();
  }

  // Business logic: tạo user mới
  static async create(data: CreateUserDto): Promise<User> {
    // Validate business rules
    if (await this.emailExists(data.email)) {
      throw new Error('Email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    return UserModel.create({ ...data, password: hashedPassword });
  }

  private static async emailExists(email: string): Promise<boolean> {
    const user = await UserModel.findByEmail(email);
    return user !== null;
  }

  private static async hashPassword(password: string): Promise<string> {
    // Hash logic here
    return `hashed_${password}`;
  }
}
```

**Service chứa:**
- ✅ Business logic (validate rules, calculations)
- ✅ Tương tác với Model/Database
- ✅ Gọi external APIs
- ✅ Data transformation

---

#### 📁 `models/` hoặc `entities/` - Data Models

**Nhiệm vụ:** Định nghĩa cấu trúc data và tương tác với database.

```typescript
// models/user.model.ts

// Data structure
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// In-memory database (demo)
const users: User[] = [];

// Data access methods
export class UserModel {
  static getAll(): User[] {
    return users;
  }

  static findById(id: number): User | undefined {
    return users.find(u => u.id === id);
  }

  static findByEmail(email: string): User | undefined {
    return users.find(u => u.email === email);
  }

  static create(data: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: users.length + 1,
      ...data,
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  }
}
```

**Trong thực tế:**
- Dùng ORM (TypeORM, Prisma, Sequelize) để tương tác database
- Model/Entity định nghĩa schema của table

---

#### 📁 `routes/` - Route Definitions

**Nhiệm vụ:** Map URL paths với controller methods.

```typescript
// routes/user.routes.ts
import { UserController } from '../controllers/user.controller';

// Route definitions
export const userRoutes = [
  { method: 'GET',    path: '/users',     handler: UserController.getUsers },
  { method: 'GET',    path: '/users/:id', handler: UserController.getUserById },
  { method: 'POST',   path: '/users',     handler: UserController.createUser },
  { method: 'PUT',    path: '/users/:id', handler: UserController.updateUser },
  { method: 'DELETE', path: '/users/:id', handler: UserController.deleteUser },
];

// routes/index.ts - Combine all routes
import { userRoutes } from './user.routes';
import { productRoutes } from './product.routes';

export const allRoutes = [...userRoutes, ...productRoutes];
```

---

#### 📁 `middlewares/` - Middleware Functions

**Nhiệm vụ:** Xử lý request trước khi đến controller (auth, logging, validation...).

```typescript
// middlewares/auth.middleware.ts
export function authMiddleware(req: Request, res: Response, next: Function) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify token logic...
  next();  // Tiếp tục đến controller
}

// middlewares/logger.middleware.ts
export function loggerMiddleware(req: Request, res: Response, next: Function) {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
}
```

---

#### 📁 `utils/` hoặc `helpers/` - Utility Functions

**Nhiệm vụ:** Chứa các hàm tiện ích dùng chung.

```typescript
// utils/response.ts
export function sendSuccess(res: Response, data: unknown, statusCode = 200) {
  res.status(statusCode).json({ success: true, data });
}

export function sendError(res: Response, message: string, statusCode = 400) {
  res.status(statusCode).json({ success: false, error: message });
}

// utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// utils/date.ts
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
```

---

#### 📁 `config/` - Configuration

**Nhiệm vụ:** Quản lý configuration (env variables, constants...).

```typescript
// config/index.ts
export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'mydb',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiresIn: '7d',
  },
};
```

---

#### 📁 `types/` - TypeScript Types/Interfaces

**Nhiệm vụ:** Định nghĩa types dùng chung.

```typescript
// types/user.types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// types/response.types.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

#### 📁 `constants/` - Constants & Enums

**Nhiệm vụ:** Chứa các giá trị cố định.

```typescript
// constants/http-status.ts
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
} as const;

// constants/messages.ts
export const MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  USER_CREATED: 'User created successfully',
  INVALID_EMAIL: 'Invalid email format',
  UNAUTHORIZED: 'Unauthorized access',
} as const;

// constants/roles.ts
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}
```

---

### 2.3. Data Flow (Luồng dữ liệu)

```
Request → Route → Middleware → Controller → Service → Model → Database
                                    ↓
Response ← Controller ← Service ← Model ← Database
```

**Ví dụ cụ thể:** `POST /users` tạo user mới

```
1. Client gửi POST /users với body { name, email, password }
2. Route match /users → gọi UserController.createUser
3. Middleware: authMiddleware check token (nếu có)
4. Controller: nhận request.body, gọi UserService.create()
5. Service: validate email, hash password, gọi UserModel.create()
6. Model: insert vào database, return user object
7. Service: return user (không có password)
8. Controller: res.status(201).json({ success: true, data: user })
9. Client nhận response
```

---

### 2.4. Tóm tắt Phần 2

| Folder | Nhiệm vụ | Ví dụ |
|--------|----------|-------|
| `controllers/` | Nhận request, trả response | `user.controller.ts` |
| `services/` | Business logic | `user.service.ts` |
| `models/` | Data structure, DB access | `user.model.ts` |
| `routes/` | URL → Handler mapping | `user.routes.ts` |
| `middlewares/` | Pre-processing request | `auth.middleware.ts` |
| `utils/` | Helper functions | `response.ts`, `validation.ts` |
| `config/` | Configuration | `index.ts` |
| `types/` | TypeScript interfaces | `user.types.ts` |
| `constants/` | Fixed values | `http-status.ts` |

---

## PHẦN 3: LAYER-BASED VS FEATURE-BASED

### 3.1. Layer-based Structure (Theo tầng)

Chia folder theo **vai trò/chức năng** của code.

```
src/
├── controllers/
│   ├── user.controller.ts
│   ├── product.controller.ts
│   └── order.controller.ts
├── services/
│   ├── user.service.ts
│   ├── product.service.ts
│   └── order.service.ts
├── models/
│   ├── user.model.ts
│   ├── product.model.ts
│   └── order.model.ts
├── routes/
│   ├── user.routes.ts
│   ├── product.routes.ts
│   └── order.routes.ts
├── middlewares/
│   ├── auth.middleware.ts
│   └── logger.middleware.ts
└── utils/
    ├── response.ts
    └── validation.ts
```

#### Ưu điểm

| Ưu điểm | Giải thích |
|---------|------------|
| **Dễ hiểu** | Nhìn folder biết ngay chức năng |
| **Familiar** | Nhiều tutorials/docs dùng cách này |
| **Simple** | Phù hợp project nhỏ-trung bình |
| **Clear separation** | Rõ ràng layer nào làm gì |

#### Nhược điểm

| Nhược điểm | Giải thích |
|------------|------------|
| **Feature scattered** | Muốn xem User feature → mở 4-5 folders |
| **Hard to scale** | 50 features = mỗi folder có 50 files |
| **Coupling risk** | Dễ tạo dependency chéo giữa features |

---

### 3.2. Feature-based Structure (Theo tính năng)

Chia folder theo **domain/feature**, mỗi folder chứa đủ thành phần cho feature đó.

```
src/
├── users/
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── user.model.ts
│   ├── user.routes.ts
│   ├── user.types.ts
│   └── index.ts              # Barrel export
├── products/
│   ├── product.controller.ts
│   ├── product.service.ts
│   ├── product.model.ts
│   ├── product.routes.ts
│   ├── product.types.ts
│   └── index.ts
├── orders/
│   ├── order.controller.ts
│   ├── order.service.ts
│   ├── order.model.ts
│   ├── order.routes.ts
│   ├── order.types.ts
│   └── index.ts
├── shared/                   # Shared utilities
│   ├── middlewares/
│   ├── utils/
│   └── types/
└── index.ts                  # Entry point
```

#### Ưu điểm

| Ưu điểm | Giải thích |
|---------|------------|
| **Feature cohesion** | Tất cả về User ở 1 chỗ |
| **Easy to scale** | Thêm feature = thêm folder |
| **Independent** | Có thể tách thành microservice sau |
| **Easy to delete** | Xóa feature = xóa folder |
| **Team friendly** | Mỗi team own 1 feature folder |

#### Nhược điểm

| Nhược điểm | Giải thích |
|------------|------------|
| **More complex** | Cần hiểu architecture tốt hơn |
| **Shared code** | Cần quản lý shared folder cẩn thận |
| **Overkill for small** | Quá phức tạp cho project nhỏ |

---

### 3.3. Khi nào dùng cách nào?

| Tiêu chí | Layer-based | Feature-based |
|----------|-------------|---------------|
| **Project size** | Small - Medium | Medium - Large |
| **Team size** | 1-3 developers | 4+ developers |
| **Tính chất** | CRUD đơn giản | Complex domains |
| **Tương lai** | Monolith | Có thể tách microservices |
| **Framework** | Express.js thuần | NestJS, Clean Architecture |

#### Ví dụ thực tế

**Layer-based phù hợp cho:**
- Blog cá nhân
- Todo app
- Portfolio website
- Small API services

**Feature-based phù hợp cho:**
- E-commerce platform
- SaaS applications
- Enterprise systems
- Multi-team projects

---

### 3.4. Hybrid Approach (Kết hợp)

Thực tế nhiều project dùng **kết hợp cả hai**:

```
src/
├── modules/                  # Feature-based cho business logic
│   ├── users/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.model.ts
│   └── products/
│       ├── product.controller.ts
│       ├── product.service.ts
│       └── product.model.ts
├── common/                   # Layer-based cho shared code
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   └── logger.middleware.ts
│   ├── utils/
│   │   ├── response.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── common.types.ts
│   └── constants/
│       └── http-status.ts
├── config/
│   └── index.ts
└── index.ts
```

**NestJS** sử dụng hybrid approach này!

---

### 3.5. Tóm tắt Phần 3

| Cách chia | Khi nào dùng | Framework phổ biến |
|-----------|--------------|-------------------|
| **Layer-based** | Small-medium project, 1-3 devs | Express.js |
| **Feature-based** | Large project, 4+ devs | NestJS |
| **Hybrid** | Medium-large, flexible | NestJS, tùy chỉnh |

---

## PHẦN 4: NAMING CONVENTIONS

### 4.1. File Naming Conventions

#### Kebab-case (Recommended) ✅

```
user.controller.ts
product.service.ts
create-user.dto.ts
auth.middleware.ts
```

**Tại sao kebab-case?**
- ✅ URL-safe (không có vấn đề với case-sensitive file systems)
- ✅ Dễ đọc
- ✅ NestJS, Angular convention
- ✅ Tránh conflict trên Linux vs Windows (case-sensitive)

#### CamelCase ⚠️

```
userController.ts
productService.ts
createUserDto.ts
```

**Vấn đề:**
- ⚠️ Một số file systems không phân biệt hoa/thường
- ⚠️ `UserController.ts` và `userController.ts` có thể conflict

#### PascalCase ⚠️

```
UserController.ts
ProductService.ts
CreateUserDto.ts
```

**Dùng cho:**
- ⚠️ React components (theo convention của React)
- ⚠️ Class-based code style

---

### 4.2. Folder Naming Conventions

#### Lowercase, Plural ✅

```
controllers/    ✅
services/       ✅
models/         ✅
middlewares/    ✅
utils/          ✅
```

#### Avoid

```
Controllers/    ❌ (uppercase)
controller/     ❌ (singular - nhưng có thể chấp nhận)
CONTROLLERS/    ❌ (all caps)
```

---

### 4.3. Suffix Patterns

Sử dụng suffix để biết file thuộc layer nào:

| Suffix | Ý nghĩa | Ví dụ |
|--------|---------|-------|
| `.controller.ts` | Controller | `user.controller.ts` |
| `.service.ts` | Service | `user.service.ts` |
| `.model.ts` | Model | `user.model.ts` |
| `.routes.ts` | Routes | `user.routes.ts` |
| `.middleware.ts` | Middleware | `auth.middleware.ts` |
| `.types.ts` | Types/Interfaces | `user.types.ts` |
| `.dto.ts` | Data Transfer Object | `create-user.dto.ts` |
| `.entity.ts` | Database Entity | `user.entity.ts` |
| `.spec.ts` / `.test.ts` | Test file | `user.service.spec.ts` |

---

### 4.4. Class và Function Naming

#### Classes (PascalCase)

```typescript
class UserController { }
class UserService { }
class AuthMiddleware { }
```

#### Functions (camelCase)

```typescript
function getUsers() { }
function createUser() { }
function validateEmail() { }
```

#### Constants (UPPER_SNAKE_CASE)

```typescript
const HTTP_STATUS = { OK: 200 };
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
```

#### Interfaces (PascalCase, I-prefix optional)

```typescript
// Style 1: No prefix (Recommended for TypeScript)
interface User { }
interface CreateUserDto { }

// Style 2: I-prefix (C#/Java style)
interface IUser { }
interface IUserService { }
```

---

### 4.5. Index Files và Barrel Exports

**Barrel export** là pattern dùng `index.ts` để re-export các modules.

#### Không có barrel export

```typescript
// Phải import từng file cụ thể
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { UserModel } from './models/user.model';
```

#### Có barrel export

```typescript
// controllers/index.ts
export * from './user.controller';
export * from './product.controller';

// services/index.ts
export * from './user.service';
export * from './product.service';

// Import gọn hơn
import { UserController, ProductController } from './controllers';
import { UserService, ProductService } from './services';
```

#### Ưu điểm của Barrel Exports

- ✅ Import ngắn gọn
- ✅ Ẩn internal structure
- ✅ Dễ refactor (chỉ sửa index.ts)

#### Nhược điểm

- ⚠️ Có thể gây circular dependency
- ⚠️ Tree-shaking kém hiệu quả (bundler khó loại bỏ unused code)
- ⚠️ IDE autocomplete chậm hơn với large projects

---

### 4.6. Tóm tắt Phần 4

| Category | Convention | Ví dụ |
|----------|------------|-------|
| File names | kebab-case + suffix | `user.controller.ts` |
| Folder names | lowercase, plural | `controllers/` |
| Classes | PascalCase | `UserController` |
| Functions | camelCase | `getUsers()` |
| Constants | UPPER_SNAKE_CASE | `HTTP_STATUS` |
| Interfaces | PascalCase | `User`, `CreateUserDto` |

---

## PHẦN 5: ENTRY POINT PATTERNS

### 5.1. Entry Point là gì?

**Entry point** là file đầu tiên được chạy khi start application.

```bash
# package.json
{
  "main": "dist/index.js",    # Entry point cho CommonJS
  "scripts": {
    "start": "node dist/index.js",
    "dev": "ts-node src/index.ts"
  }
}
```

---

### 5.2. Pattern 1: Single Entry Point

Mọi thứ bắt đầu từ `src/index.ts`:

```typescript
// src/index.ts
import { createServer } from './app';
import { config } from './config';

const server = createServer();

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
```

```typescript
// src/app.ts
import http from 'http';
import { router } from './routes';

export function createServer() {
  return http.createServer((req, res) => {
    router(req, res);
  });
}
```

**Tại sao tách `index.ts` và `app.ts`?**
- `index.ts`: Chỉ start server
- `app.ts`: Setup application (có thể export để test)

---

### 5.3. Pattern 2: App Factory

```typescript
// src/app.ts
export function createApp(options?: AppOptions) {
  const app = http.createServer();

  // Setup middlewares
  // Setup routes
  // Setup error handlers

  return app;
}

// src/index.ts
import { createApp } from './app';

const app = createApp({ env: 'production' });
app.listen(3000);

// tests/app.test.ts
import { createApp } from '../src/app';

const testApp = createApp({ env: 'test' });
// Test với testApp
```

---

### 5.4. Absolute vs Relative Imports

#### Relative Imports

```typescript
// src/controllers/user.controller.ts
import { UserService } from '../services/user.service';
import { User } from '../types/user.types';
import { sendJson } from '../utils/response';
```

**Vấn đề:**
- `../../../` nightmare khi nested sâu
- Khó refactor (move file → sửa tất cả imports)

#### Absolute Imports (Path Aliases)

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@controllers/*": ["controllers/*"],
      "@services/*": ["services/*"],
      "@utils/*": ["utils/*"]
    }
  }
}
```

```typescript
// src/controllers/user.controller.ts
import { UserService } from '@services/user.service';
import { User } from '@/types/user.types';
import { sendJson } from '@utils/response';
```

**Ưu điểm:**
- ✅ Clean imports
- ✅ Dễ refactor
- ✅ Dễ đọc

**Lưu ý:**
- Cần thêm config cho runtime (tsconfig-paths, module-alias)
- Bundlers (Webpack, Vite) cần config riêng

---

### 5.5. Tóm tắt Phần 5

| Pattern | Mô tả |
|---------|-------|
| `index.ts` | Entry point - start server |
| `app.ts` | Application setup (exportable cho testing) |
| **Barrel exports** | `index.ts` trong mỗi folder để re-export |
| **Path aliases** | `@/`, `@services/` thay vì `../../../` |

---

## PHẦN 6: THỰC HÀNH - TẠO PROJECT STRUCTURE

### 6.1. Yêu cầu

Tạo **User API** với cấu trúc chuẩn:

```
04-user-api/
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Server setup
│   ├── routes/
│   │   ├── index.ts          # Combine all routes
│   │   └── user.routes.ts    # User routes
│   ├── controllers/
│   │   └── user.controller.ts
│   ├── services/
│   │   └── user.service.ts
│   ├── models/
│   │   └── user.model.ts
│   ├── utils/
│   │   ├── response.ts       # Response helpers
│   │   └── parse-body.ts     # Body parser
│   └── types/
│       └── user.types.ts     # User interfaces
├── package.json
└── tsconfig.json
```

### 6.2. API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Lấy tất cả users |
| GET | `/users/:id` | Lấy user theo ID |
| POST | `/users` | Tạo user mới |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Xóa user |

---

## TÓM TẮT TOÀN BÀI

| Phần | Nội dung chính |
|------|----------------|
| **Phần 1** | Tại sao chia thư mục? (SoC, Maintainability, Scalability, Teamwork) |
| **Phần 2** | Các folder phổ biến (controllers, services, models, routes, middlewares, utils, config, types, constants) |
| **Phần 3** | Layer-based vs Feature-based (khi nào dùng cách nào) |
| **Phần 4** | Naming conventions (kebab-case files, PascalCase classes, camelCase functions) |
| **Phần 5** | Entry point patterns (index.ts, app.ts, barrel exports, path aliases) |
| **Phần 6** | Thực hành tạo User API với structure chuẩn |

---

> 📚 **Tiếp theo:** Session E3.5 - MVC Pattern & RESTful API
