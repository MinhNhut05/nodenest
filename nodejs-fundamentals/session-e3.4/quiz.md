# Quiz - Session E3.4: Cách Chia Thư Mục

> Kiểm tra kiến thức về Project Structure trong Node.js

---

## Câu 1: Separation of Concerns

**Separation of Concerns (SoC) là gì?**

- A) Chia code theo màu sắc của editor
- B) Mỗi phần code chỉ làm một việc và làm tốt việc đó
- C) Tách riêng frontend và backend
- D) Chia code theo số dòng

<details>
<summary>Đáp án</summary>

**B) Mỗi phần code chỉ làm một việc và làm tốt việc đó**

SoC là nguyên tắc thiết kế phần mềm, giúp code rõ ràng và dễ bảo trì.
Ví dụ: Controller chỉ xử lý HTTP, Service chỉ xử lý business logic.

</details>

---

## Câu 2: Nhiệm vụ của Controller

**Controller layer làm nhiệm vụ gì?**

- A) Truy cập database trực tiếp
- B) Nhận request, gọi service, trả response
- C) Hash password và validate email
- D) Định nghĩa data schema

<details>
<summary>Đáp án</summary>

**B) Nhận request, gọi service, trả response**

Controller là "cầu nối" giữa HTTP và business logic:
- Nhận request từ route
- Gọi service để xử lý
- Format và trả response

Controller KHÔNG nên chứa business logic hay truy cập DB trực tiếp.

</details>

---

## Câu 3: Layer-based vs Feature-based

**Khi nào nên dùng Feature-based structure?**

- A) Project nhỏ, 1-2 developers
- B) Todo app đơn giản
- C) Large project, nhiều developers, cần tách microservices sau
- D) Khi không biết chia như thế nào

<details>
<summary>Đáp án</summary>

**C) Large project, nhiều developers, cần tách microservices sau**

Feature-based phù hợp khi:
- Project lớn, nhiều tính năng
- Team 4+ developers (mỗi team có thể own 1 feature)
- Có thể tách thành microservices trong tương lai
- Complex domain logic

</details>

---

## Câu 4: Naming Convention

**File naming convention nào được recommend?**

- A) `UserController.ts` (PascalCase)
- B) `userController.ts` (camelCase)
- C) `user.controller.ts` (kebab-case với suffix)
- D) `user_controller.ts` (snake_case)

<details>
<summary>Đáp án</summary>

**C) `user.controller.ts` (kebab-case với suffix)**

Lý do:
- URL-safe
- Không có vấn đề với case-sensitive file systems
- Convention của NestJS, Angular
- Suffix giúp biết file thuộc layer nào

</details>

---

## Câu 5: Service Layer

**Service layer chứa những gì?**

- A) Chỉ gọi database
- B) Business logic, validation rules, data transformation
- C) HTML templates
- D) Route definitions

<details>
<summary>Đáp án</summary>

**B) Business logic, validation rules, data transformation**

Service layer là "trái tim" của ứng dụng:
- Validate business rules (email unique, password strength)
- Transform data
- Gọi model/database
- Gọi external APIs
- Không quan tâm đến HTTP

</details>

---

## Câu 6: Data Flow

**Luồng dữ liệu đúng trong ứng dụng là gì?**

- A) Controller → Model → Service → Response
- B) Request → Route → Controller → Service → Model → Database
- C) Model → Service → Controller → Route
- D) Service → Controller → Model → Response

<details>
<summary>Đáp án</summary>

**B) Request → Route → Controller → Service → Model → Database**

Luồng chuẩn:
```
Request → Route → Middleware → Controller → Service → Model → Database
                                   ↓
Response ← Controller ← Service ← Model ← Database
```

</details>

---

## Câu 7: Barrel Exports

**Barrel export (index.ts) dùng để làm gì?**

- A) Tạo database connection
- B) Re-export các modules để import gọn hơn
- C) Định nghĩa entry point
- D) Chứa environment variables

<details>
<summary>Đáp án</summary>

**B) Re-export các modules để import gọn hơn**

Thay vì:
```typescript
import { UserController } from './controllers/user.controller';
import { ProductController } from './controllers/product.controller';
```

Có thể:
```typescript
import { UserController, ProductController } from './controllers';
```

</details>

---

## Câu 8: Entry Point Pattern

**Tại sao nên tách `index.ts` và `app.ts`?**

- A) Vì TypeScript yêu cầu
- B) `index.ts` start server, `app.ts` setup application (dễ test)
- C) Để code dài hơn
- D) Không cần tách, để chung được

<details>
<summary>Đáp án</summary>

**B) `index.ts` start server, `app.ts` setup application (dễ test)**

Lý do:
- `app.ts` export `createServer()` function
- Trong tests, có thể import `createServer()` mà không start server thật
- `index.ts` chỉ gọi `createServer().listen()`
- Separation of Concerns

</details>

---

## Câu 9: Folder Naming

**Folder naming convention nào đúng?**

- A) `Controllers/` (PascalCase)
- B) `CONTROLLERS/` (UPPER_CASE)
- C) `controllers/` (lowercase, plural)
- D) `controller/` (lowercase, singular)

<details>
<summary>Đáp án</summary>

**C) `controllers/` (lowercase, plural)**

Convention:
- Lowercase: tránh case-sensitive issues
- Plural: folder chứa nhiều files (controllers, services, models)

</details>

---

## Câu 10: Model Layer

**Model layer chịu trách nhiệm gì?**

- A) Validate HTTP request
- B) Định nghĩa data structure và tương tác với database
- C) Xử lý business logic
- D) Format response

<details>
<summary>Đáp án</summary>

**B) Định nghĩa data structure và tương tác với database**

Model layer:
- Định nghĩa schema/entity (User, Product)
- CRUD operations (create, read, update, delete)
- Tương tác với database (thông qua ORM hoặc raw queries)
- Không chứa business logic

</details>

---

## Tổng kết

| Điểm | Đánh giá |
|------|----------|
| 9-10 | Excellent! Hiểu rất tốt về project structure |
| 7-8 | Good! Nắm được kiến thức cơ bản |
| 5-6 | OK! Cần review lại một số phần |
| < 5 | Cần đọc lại lý thuyết |

---

> 📚 Tiếp theo: Thử tạo project structure theo exercises
