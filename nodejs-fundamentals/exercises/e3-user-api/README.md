# E3 - User API Exercise

Bài tập thực hành Module E3: Server & Routing

## Setup

```bash
cd exercises/e3-user-api
npm install
npm run dev
```

---

## Cấu trúc bài tập

```
src/
├── constants/
│   ├── httpStatus.ts     ✅ Có sẵn
│   └── message.ts        ✅ Có sẵn
├── controllers/
│   └── users.controllers.ts   🔴 BÀI 2: Điền status codes
├── middlewares/
│   ├── error.middlewares.ts   ✅ Có sẵn
│   └── users.middlewares.ts   🔴 BÀI 3: Viết middleware
├── routes/
│   └── users.routes.ts        🔴 BÀI 1: Điền routes
├── services/
│   └── users.services.ts      ✅ Có sẵn
└── index.ts                   ✅ Có sẵn
```

---

## Bài 1: Routes (users.routes.ts)

**Kiến thức ôn:** HTTP Methods, RESTful conventions

| TODO | Route | Method | Gợi ý |
|------|-------|--------|-------|
| 1 | /register | ? | Tạo mới resource dùng method gì? |
| 2 | /login | ? | Gửi data để xác thực |
| 3 | /me (get) | ? | Lấy data dùng method gì? |
| 4 | /me (update) | ? | Partial update dùng PATCH hay PUT? |

---

## Bài 2: Controllers (users.controllers.ts)

**Kiến thức ôn:** Status codes

| TODO | Action | Status Code | Gợi ý |
|------|--------|-------------|-------|
| 1 | Register thành công | ? | Created = ? |
| 2 | Login thành công | ? | Success = ? |
| 3 | User không tồn tại | ? | Not Found = ? |
| 4 | Update thành công | ? | OK = ? |

---

## Bài 3: Middlewares (users.middlewares.ts)

**Kiến thức ôn:** Middleware pattern

Viết 3 middlewares:
1. `registerValidator` - Validate name, email, password
2. `loginValidator` - Validate email, password
3. `accessTokenValidator` - Kiểm tra Bearer token

**Lưu ý:**
- Middleware phải gọi `next()` để request đi tiếp
- Nếu validation fail → return response luôn, không gọi next()

---

## Test với Postman

### 1. Register
```
POST http://localhost:3000/users/register
Body (JSON):
{
  "name": "Leminho",
  "email": "leminho@test.com",
  "password": "123456"
}
```

### 2. Login
```
POST http://localhost:3000/users/login
Body (JSON):
{
  "email": "leminho@test.com",
  "password": "123456"
}
```

### 3. Get Profile
```
GET http://localhost:3000/users/me
Headers:
  Authorization: Bearer fake_access_token_1
```

### 4. Update Profile
```
PATCH http://localhost:3000/users/me
Headers:
  Authorization: Bearer fake_access_token_1
Body (JSON):
{
  "name": "Leminho Updated",
  "bio": "Backend Developer"
}
```

---

## Đáp án

<details>
<summary>🔑 Bài 1: Routes</summary>

```typescript
// TODO 1
router.post('/register', registerValidator, registerController)

// TODO 2
router.post('/login', loginValidator, loginController)

// TODO 3
router.get('/me', accessTokenValidator, getProfileController)

// TODO 4 - Dùng PATCH vì partial update (chỉ update 1 số fields)
// PUT dùng khi replace toàn bộ resource
router.patch('/me', accessTokenValidator, updateProfileController)
```

</details>

<details>
<summary>🔑 Bài 2: Controllers</summary>

```typescript
// TODO 1 - CREATED (201) khi tạo mới resource
res.status(HttpStatus.CREATED).json(...)

// TODO 2 - OK (200) khi request thành công
res.status(HttpStatus.OK).json(...)

// TODO 3 - NOT_FOUND (404) và USER_NOT_FOUND
if (!user) {
  return res.status(HttpStatus.NOT_FOUND).json({
    message: USERS_MESSAGES.USER_NOT_FOUND
  })
}

// TODO 4 - OK và UPDATE_PROFILE_SUCCESS
res.status(HttpStatus.OK).json({
  message: USERS_MESSAGES.UPDATE_PROFILE_SUCCESS,
  data: result
})
```

</details>

<details>
<summary>🔑 Bài 3: Middlewares</summary>

```typescript
// registerValidator
export const registerValidator = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: USERS_MESSAGES.VALIDATION_ERROR,
      errors: {
        name: !name ? 'Name is required' : undefined,
        email: !email ? 'Email is required' : undefined,
        password: !password ? 'Password is required' : undefined
      }
    })
  }

  next()
}

// loginValidator
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: USERS_MESSAGES.VALIDATION_ERROR
    })
  }

  next()
}

// accessTokenValidator
export const accessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization

  if (!authorization) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Access token is required'
    })
  }

  if (!authorization.startsWith('Bearer ')) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Invalid token format'
    })
  }

  const token = authorization.split(' ')[1]

  // Giả lập decode token (thực tế sẽ verify JWT)
  // Token format: fake_access_token_1 → user_id = 1
  const userId = token.replace('fake_access_token_', '')

  ;(req as any).decoded_authorization = { user_id: userId }

  next()
}
```

</details>

---

## Flow tổng quan

```
Request → app.use(express.json()) → usersRouter
                                        ↓
                              Middleware (validate)
                                        ↓
                                   Controller
                                        ↓
                                    Service
                                        ↓
                                  Response

Nếu có error → next(error) → errorHandler → Response
```
