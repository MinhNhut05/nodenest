# Exercises - Session E3.4: Cách Chia Thư Mục

> Bài tập thực hành về Project Structure

---

## Bài tập 1: Nhận diện vấn đề (Dễ)

### Yêu cầu
Đọc file `examples/01-bad-structure/server.ts` và trả lời:

1. File này có bao nhiêu dòng code?
2. Liệt kê 5 vấn đề chính của file này
3. Nếu thêm feature "Products", file sẽ tăng thêm bao nhiêu dòng (ước tính)?

### Gợi ý
- Đếm số sections (TYPES, DATABASE, UTILS, VALIDATION, BUSINESS LOGIC, HANDLERS, ROUTER, SERVER)
- Tưởng tượng bạn là developer mới vào team, cần sửa bug trong file này

---

## Bài tập 2: Chia file (Trung bình)

### Yêu cầu
Từ file `01-bad-structure/server.ts`, hãy:

1. Tạo folder `my-refactored/` trong thư mục exercises
2. Chia code thành các files theo layer-based structure:
   - `types/user.types.ts`
   - `models/user.model.ts`
   - `services/user.service.ts`
   - `controllers/user.controller.ts`
   - `routes/user.routes.ts`
   - `utils/response.ts`
   - `index.ts`

### Tiêu chí đánh giá
- [ ] Mỗi file chỉ chứa code liên quan đến chức năng của nó
- [ ] Import/export đúng
- [ ] Chạy được như file gốc
- [ ] Naming convention đúng

### Gợi ý
```bash
# Tạo structure
mkdir -p exercises/my-refactored/src/{types,models,services,controllers,routes,utils}
```

---

## Bài tập 3: Thêm Feature (Trung bình)

### Yêu cầu
Dựa trên `02-layer-based/`, thêm feature **Products**:

1. Tạo các files mới:
   - `types/product.types.ts`
   - `models/product.model.ts`
   - `services/product.service.ts`
   - `controllers/product.controller.ts`
   - `routes/product.routes.ts`

2. Product có các fields: `id`, `name`, `price`, `description`, `createdAt`

3. Implement CRUD endpoints:
   - `GET /products` - List all
   - `GET /products/:id` - Get by ID
   - `POST /products` - Create
   - `PUT /products/:id` - Update
   - `DELETE /products/:id` - Delete

### Tiêu chí đánh giá
- [ ] Không sửa code cũ (chỉ thêm file mới và update routes/index.ts)
- [ ] Follow naming convention
- [ ] Validate: name required, price > 0

---

## Bài tập 4: Chuyển sang Feature-based (Khó)

### Yêu cầu
Refactor `02-layer-based/` thành feature-based structure:

```
src/
├── users/
│   ├── user.types.ts
│   ├── user.model.ts
│   ├── user.service.ts
│   ├── user.controller.ts
│   ├── user.routes.ts
│   └── index.ts
├── products/
│   ├── product.types.ts
│   ├── product.model.ts
│   ├── product.service.ts
│   ├── product.controller.ts
│   ├── product.routes.ts
│   └── index.ts
├── shared/
│   └── utils/
│       └── response.ts
└── index.ts
```

### Tiêu chí đánh giá
- [ ] Mỗi feature folder chứa đầy đủ files
- [ ] Barrel exports hoạt động
- [ ] Shared utils được import đúng
- [ ] Server chạy được

---

## Bài tập 5: Thêm Middleware (Khó)

### Yêu cầu
Thêm vào project `04-user-api/`:

1. **Logger Middleware**: Log mỗi request (method, url, timestamp, response time)

2. **Auth Middleware** (giả lập):
   - Check header `Authorization: Bearer <token>`
   - Nếu không có token → 401 Unauthorized
   - Nếu token = "secret123" → pass
   - Apply cho routes: PUT, DELETE

3. Tạo folder `middlewares/` với:
   - `logger.middleware.ts`
   - `auth.middleware.ts`
   - `index.ts` (barrel export)

### Gợi ý
```typescript
// Middleware pattern cho Node.js thuần
type Middleware = (
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: () => Promise<void>
) => Promise<void>;
```

---

## Bài tập 6: Path Aliases (Nâng cao)

### Yêu cầu
Config path aliases cho project `04-user-api/`:

1. Update `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["./*"],
      "@controllers/*": ["controllers/*"],
      "@services/*": ["services/*"],
      "@models/*": ["models/*"],
      "@utils/*": ["utils/*"],
      "@types/*": ["types/*"]
    }
  }
}
```

2. Update imports trong tất cả files:
```typescript
// Từ
import { UserService } from '../services/user.service';
// Thành
import { UserService } from '@services/user.service';
```

3. Config runtime: Cài `tsconfig-paths` hoặc dùng `tsx` với flag `--tsconfig`

### Tiêu chí đánh giá
- [ ] Tất cả imports dùng path aliases
- [ ] Server chạy được với `pnpm dev`
- [ ] Build được với `pnpm build`

---

## Checklist hoàn thành

| Bài | Mô tả | Độ khó | Hoàn thành |
|-----|-------|--------|------------|
| 1 | Nhận diện vấn đề | Dễ | ⬜ |
| 2 | Chia file | Trung bình | ⬜ |
| 3 | Thêm Feature | Trung bình | ⬜ |
| 4 | Chuyển Feature-based | Khó | ⬜ |
| 5 | Thêm Middleware | Khó | ⬜ |
| 6 | Path Aliases | Nâng cao | ⬜ |

---

## Tips

1. **Bắt đầu từ types**: Luôn định nghĩa interfaces/types trước
2. **Test từng bước**: Sau mỗi thay đổi, chạy server để verify
3. **Git commits**: Commit sau mỗi bài để có thể rollback
4. **So sánh với examples**: Tham khảo `02-layer-based/` và `03-feature-based/`

---

> Hoàn thành xong? Chuyển sang Session E3.5: MVC Pattern & RESTful API
