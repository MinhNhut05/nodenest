# E4.9 - E4.11: Error Handling trong Express

> **Phạm vi:** Error Middleware, wrapRequestHandler, Custom Error Classes

---

## E4.9 - Error Middleware

### Error Middleware khác gì Middleware thường?

```javascript
// Middleware thường: 3 params
app.use((req, res, next) => { ... })

// Error middleware: 4 params (err đầu tiên)
app.use((err, req, res, next) => { ... })
```

Express nhận biết error middleware dựa vào **đúng 4 parameters**. Thiếu hoặc thừa đều không hoạt động.

### Flow

```
Request → Middleware → Route/Controller
                           │
                           │ throw Error / next(error)
                           ▼
                      Error Middleware (err, req, res, next)
                           │
                           ▼
                      Response JSON
```

### Error Handler cơ bản

```javascript
app.use((err, req, res, next) => {
  const statusCode = err.status || 500

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})
```

### Quy tắc quan trọng

- Error middleware **phải đặt CUỐI CÙNG**, sau tất cả routes
- Express tìm error middleware **từ trên xuống dưới** → đặt trước routes = không bắt được

```javascript
// ❌ SAI
app.use(errorHandler)
app.use('/users', usersRouter)

// ✅ ĐÚNG
app.use('/users', usersRouter)
app.use(errorHandler)
```

### Sync vs Async Error

| Loại | Express 4.x | Express 5.x |
|------|-------------|-------------|
| **Sync** `throw new Error()` | ✅ Tự bắt | ✅ Tự bắt |
| **Async** `async () => throw` | ❌ App crash | ✅ Tự bắt |

→ Express 4.x cần **wrapRequestHandler** để bắt async errors.

---

## E4.10 - wrapRequestHandler

### Vấn đề: try-catch lặp lại

```javascript
// Mỗi controller đều phải viết try-catch giống nhau
const controller1 = async (req, res, next) => {
  try {
    // logic...
  } catch (error) {
    next(error)  // Lặp lại ở mọi controller
  }
}
```

### Giải pháp: Higher-Order Function

**Higher-Order Function (HOF)** = function nhận hoặc return function khác.

```javascript
const wrapRequestHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

- `fn(req, res, next)` → gọi controller gốc
- `Promise.resolve()` → wrap thành Promise (hoạt động cả sync lẫn async)
- `.catch(next)` → nếu có error, tự động gọi `next(error)` → chuyển đến error middleware

### Trước vs Sau

```javascript
// ❌ TRƯỚC: try-catch thủ công
const register = async (req, res, next) => {
  try {
    const result = await usersService.register(req.body)
    res.status(201).json({ data: result })
  } catch (error) {
    next(error)
  }
}

// ✅ SAU: dùng wrapper
const register = wrapRequestHandler(async (req, res, next) => {
  const result = await usersService.register(req.body)
  res.status(201).json({ data: result })
})
```

### TypeScript Version

```typescript
import { Request, Response, NextFunction, RequestHandler } from 'express'

const wrapRequestHandler = <P>(fn: RequestHandler<P>): RequestHandler<P> => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}
```

### Lưu ý: `.catch(next)` vs `Promise.resolve()`

```javascript
// Version 1: Chỉ hoạt động với async function
fn(req, res, next).catch(next)
// Nếu fn là sync → return undefined → undefined.catch() → TypeError

// Version 2: Hoạt động cả sync và async (an toàn hơn)
Promise.resolve(fn(req, res, next)).catch(next)
// Promise.resolve(undefined) → Promise → có .catch()
```

---

## E4.11 - Chuẩn hóa bộ xử lý lỗi

### Vấn đề: `new Error()` thiếu thông tin

```javascript
throw new Error('User not found')
// Chỉ có message, không có status code, không có error type
```

### ErrorWithStatus

```javascript
class ErrorWithStatus extends Error {
  constructor({ message, status }) {
    super(message)
    this.status = status
    this.name = 'ErrorWithStatus'
  }
}

// Sử dụng
throw new ErrorWithStatus({
  message: 'User not found',
  status: 404
})
```

### EntityError (cho Validation)

```javascript
class EntityError extends Error {
  constructor({ message = 'Validation Error', errors }) {
    super(message)
    this.status = 422  // Unprocessable Entity
    this.errors = errors
    this.name = 'EntityError'
  }
}

// Sử dụng
throw new EntityError({
  errors: [
    { field: 'email', message: 'Email không hợp lệ' },
    { field: 'password', message: 'Password phải ít nhất 6 ký tự' }
  ]
})
```

### Error Handler hoàn chỉnh

```javascript
const errorHandler = (err, req, res, next) => {
  // EntityError → 422 + errors array
  if (err instanceof EntityError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors
    })
  }

  // ErrorWithStatus → custom status + message
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      message: err.message
    })
  }

  // Unknown error → 500
  res.status(500).json({
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
```

### Cấu trúc thư mục

```
src/
├── errors/
│   ├── ErrorWithStatus.js    ← Custom error có status code
│   └── EntityError.js        ← Validation error (422)
├── utils/
│   └── wrapRequestHandler.js ← HOF wrap async
├── middlewares/
│   └── errorHandler.js       ← Error middleware (đặt cuối app)
├── controllers/
├── routes/
└── index.js
```

### Complete Flow

```
Request
  │
  ▼
Validation Middleware
  │ fail → throw EntityError({ errors: [...] })
  │
  ▼
Controller (wrapped bởi wrapRequestHandler)
  │ fail → throw ErrorWithStatus({ message, status: 404 })
  │    hoặc throw new Error('Unknown')
  │
  ▼
wrapRequestHandler → .catch(next)
  │
  ▼
errorHandler middleware
  ├─ EntityError?     → 422 + errors array
  ├─ ErrorWithStatus? → custom status + message
  └─ Unknown?         → 500 Internal Server Error
  │
  ▼
Response JSON
```

---

## Tóm tắt

| Concept | Mục đích | Nhớ |
|---------|----------|-----|
| **Error Middleware** | Bắt tất cả errors tập trung | 4 params, đặt cuối app |
| **wrapRequestHandler** | Loại bỏ try-catch lặp lại | `Promise.resolve(fn()).catch(next)` |
| **ErrorWithStatus** | Error có status code | `throw new ErrorWithStatus({ message, status })` |
| **EntityError** | Validation errors | Status 422, có `errors` array |
