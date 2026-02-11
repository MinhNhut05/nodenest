# E4 Complete API - Error Handling Exercise

Exercise kết hợp E3 (routing, middleware, MVC) + E4 (error handling) thành 1 API hoàn chỉnh.

## Điểm khác so với E3

| Feature | E3 | E4 |
|---------|----|----|
| Error class | `new Error()` + ép kiểu `any` | `ErrorWithStatus`, `EntityError` |
| Validation response | `{ message: "Validation error" }` | `{ message, errors: { field: { msg, path } } }` |
| Controller | Mỗi hàm viết `try-catch` | `wrapRequestHandler` loại bỏ try-catch |
| Error handler | Chỉ trả message | Phân biệt EntityError / ErrorWithStatus / Unknown |
| Service | `error.status = 422` | `throw new ErrorWithStatus({ message, status })` |

## Chạy project

```bash
npm install
npm run dev
```

## Test với Postman

Tạo một Collection mới tên `E4 User API` và thêm các request sau.
**Base URL**: `http://localhost:3000`

### 1. Validation Error (422) - Test lỗi thiếu trường
Kiểm tra xem API có trả về chi tiết lỗi của từng field không.
- **Method**: `POST`
- **URL**: `http://localhost:3000/users/register`
- **Body** (Raw JSON): `{}` (Gửi body rỗng)
- **Kết quả mong đợi**: Status `422 Unprocessable Entity`
  ```json
  {
    "message": "Validation error",
    "errors": {
      "name": { "msg": "Name is required", ... },
      "email": { "msg": "Email is required", ... },
      "password": { "msg": "Password is required", ... }
    }
  }
  ```

### 2. Validation Error (422) - Test lỗi sai định dạng
- **Method**: `POST`
- **URL**: `http://localhost:3000/users/register`
- **Body** (Raw JSON):
  ```json
  {
    "name": "Test",
    "email": "invalid-email",
    "password": "123"
  }
  ```
- **Kết quả mong đợi**: Status `422`, báo lỗi email không hợp lệ và password quá ngắn.

### 3. Register Success (201)
- **Method**: `POST`
- **URL**: `http://localhost:3000/users/register`
- **Body** (Raw JSON):
  ```json
  {
    "name": "Leminho",
    "email": "leminho@test.com",
    "password": "Password123"
  }
  ```
- **Kết quả mong đợi**: Status `201 Created`, trả về thông tin user mới.

### 4. Login Success (200)
- **Method**: `POST`
- **URL**: `http://localhost:3000/users/login`
- **Body** (Raw JSON):
  ```json
  {
    "email": "leminho@test.com",
    "password": "Password123"
  }
  ```
- **Kết quả mong đợi**: Status `200 OK`.
- **QUAN TRỌNG**: Copy `access_token` trong response để dùng cho các bước sau.

### 5. Get Profile (Auth Required)
- **Method**: `GET`
- **URL**: `http://localhost:3000/users/me`
- **Tab Authorization**: Chọn Type `Bearer Token` -> Paste token vừa copy vào ô Token.
- **Kết quả mong đợi**: Status `200 OK`, trả về thông tin user.

### 6. Update Profile
- **Method**: `PATCH`
- **URL**: `http://localhost:3000/users/me`
- **Tab Authorization**: Chọn Type `Bearer Token` (Paste token).
- **Body** (Raw JSON):
  ```json
  {
    "name": "Leminho Updated"
  }
  ```
- **Kết quả mong đợi**: Status `200 OK`, tên user được cập nhật.

## Flow hoạt động

```
Request → Route → Middleware (validate) → Controller → Service → Response
                      ↓ throw                  ↓ throw
                  EntityError            ErrorWithStatus
                      ↓                        ↓
                  Error Handler ← ← ← ← ← ← ←
                      ↓
               Response với status + message phù hợp
```
