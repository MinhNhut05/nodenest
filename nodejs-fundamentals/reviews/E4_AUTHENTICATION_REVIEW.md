# E4 Authentication Review - JWT & Validation

> **Phạm vi:** E4.1 - E4.8 (JWT, Access/Refresh Token, Validation, Token Generation)
> **Mục tiêu:** Ôn tập kiến thức Authentication trong Express.js

---

## Mục lục

1. [JWT Fundamentals](#1-jwt-fundamentals)
2. [Access Token](#2-access-token)
3. [Refresh Token](#3-refresh-token)
4. [Input Validation với Express Validator](#4-input-validation-với-express-validator)
5. [Token Generation](#5-token-generation)
6. [Best Practices & Security](#6-best-practices--security)
7. [Quiz - Câu hỏi kiểm tra](#7-quiz---câu-hỏi-kiểm-tra)

---

## 1. JWT Fundamentals

### 1.1 JWT là gì?

**JWT (JSON Web Token)** là một chuẩn mở (RFC 7519) định nghĩa cách truyền thông tin an toàn giữa các bên dưới dạng JSON object. Thông tin này có thể được **xác thực (verified)** và **tin cậy (trusted)** vì nó được **ký số (digitally signed)**.

```
┌─────────────────────────────────────────────────────────────────┐
│                         JWT TOKEN                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.                         │
│   eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4ifQ.               │
│   SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c                   │
│                                                                  │
│   ├── Header ──┤├────── Payload ──────┤├──── Signature ────┤    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 Cấu trúc JWT (3 phần)

JWT gồm **3 phần** được phân tách bởi dấu chấm (`.`):

#### Part 1: Header

```json
{
  "alg": "HS256",    // Algorithm: HS256, RS256, ES256...
  "typ": "JWT"       // Type: luôn là "JWT"
}
```

- **alg (algorithm):** Thuật toán mã hóa signature
  - `HS256`: HMAC + SHA256 (symmetric - dùng secret key)
  - `RS256`: RSA + SHA256 (asymmetric - dùng public/private key)
- **typ:** Loại token, luôn là "JWT"

#### Part 2: Payload (Claims)

```json
{
  // Registered claims (chuẩn)
  "iss": "https://myapp.com",     // Issuer - ai phát hành token
  "sub": "user_id_123",           // Subject - đối tượng của token
  "aud": "https://api.myapp.com", // Audience - đối tượng nhận token
  "exp": 1699999999,              // Expiration time (Unix timestamp)
  "iat": 1699990000,              // Issued at - thời điểm tạo
  "nbf": 1699990000,              // Not before - token có hiệu lực từ
  "jti": "unique-token-id",       // JWT ID - ID duy nhất của token

  // Private claims (custom)
  "user_id": "123",
  "role": "admin",
  "permissions": ["read", "write"]
}
```

**Các loại Claims:**

| Loại | Mô tả | Ví dụ |
|------|-------|-------|
| **Registered** | Claims chuẩn theo RFC | `iss`, `sub`, `exp`, `iat` |
| **Public** | Claims được định nghĩa công khai | Cần đăng ký với IANA |
| **Private** | Claims tự định nghĩa | `user_id`, `role` |

> ⚠️ **Quan trọng:** Payload được **encode** (Base64URL), KHÔNG phải **encrypt**. Bất kỳ ai cũng có thể đọc được nội dung payload. **KHÔNG bao giờ lưu thông tin nhạy cảm** (password, credit card) trong JWT!

#### Part 3: Signature

```javascript
// Với HS256
signature = HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

**Mục đích của Signature:**
- Đảm bảo token **không bị thay đổi** (integrity)
- Xác minh **nguồn gốc** token (authenticity)
- KHÔNG mã hóa nội dung (encryption)

### 1.3 JWT hoạt động như thế nào?

```
┌──────────────────────────────────────────────────────────────────────┐
│                        JWT Authentication Flow                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   Client                                              Server          │
│     │                                                   │             │
│     │ 1. POST /login {email, password}                  │             │
│     │ ──────────────────────────────────────────────►   │             │
│     │                                                   │             │
│     │                              2. Verify credentials │             │
│     │                              3. Generate JWT       │             │
│     │                                                   │             │
│     │ 4. Response: { accessToken: "eyJ..." }            │             │
│     │ ◄──────────────────────────────────────────────   │             │
│     │                                                   │             │
│     │ 5. GET /profile                                   │             │
│     │    Header: Authorization: Bearer eyJ...           │             │
│     │ ──────────────────────────────────────────────►   │             │
│     │                                                   │             │
│     │                              6. Verify JWT         │             │
│     │                              7. Extract user info  │             │
│     │                                                   │             │
│     │ 8. Response: { user: {...} }                      │             │
│     │ ◄──────────────────────────────────────────────   │             │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 1.4 Stateless vs Stateful Authentication

| Đặc điểm | JWT (Stateless) | Session (Stateful) |
|----------|-----------------|---------------------|
| **Lưu trữ** | Client giữ token | Server giữ session |
| **Database lookup** | Không cần | Cần query mỗi request |
| **Scalability** | Tốt (horizontal) | Cần session store (Redis) |
| **Revocation** | Khó (cần blacklist) | Dễ (xóa session) |
| **Payload** | Chứa user info | Chỉ session ID |

---

## 2. Access Token

### 2.1 Access Token là gì?

**Access Token** là JWT ngắn hạn được sử dụng để **xác thực (authenticate)** và **ủy quyền (authorize)** người dùng truy cập tài nguyên.

```javascript
// Ví dụ Access Token payload
{
  "user_id": "user_123",
  "email": "user@example.com",
  "role": "user",
  "iat": 1699990000,
  "exp": 1699990900  // Hết hạn sau 15 phút
}
```

### 2.2 Đặc điểm của Access Token

| Đặc điểm | Giá trị | Lý do |
|----------|---------|-------|
| **Thời gian sống** | 15 phút - 1 giờ | Giảm thiểu rủi ro nếu bị lộ |
| **Lưu ở đâu** | Memory / HttpOnly Cookie | Bảo mật, tránh XSS |
| **Chứa gì** | User ID, role, permissions | Để authorize request |
| **Gửi như thế nào** | Authorization header | `Bearer <token>` |

### 2.3 Cách sử dụng Access Token

```javascript
// Client gửi request với Access Token
fetch('/api/profile', {
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }
})

// Server verify Access Token
const jwt = require('jsonwebtoken')

const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded  // Attach user info to request
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res.status(403).json({ message: 'Invalid token' })
  }
}
```

### 2.4 Tại sao Access Token ngắn hạn?

```
┌─────────────────────────────────────────────────────────────────┐
│                    Tại sao Access Token ngắn hạn?               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Nếu Token bị lộ (stolen):                                      │
│                                                                  │
│  Token dài hạn (30 ngày):                                       │
│  ├── Hacker có 30 ngày để tấn công                              │
│  ├── Khó phát hiện và xử lý                                     │
│  └── Thiệt hại lớn                                              │
│                                                                  │
│  Token ngắn hạn (15 phút):                                      │
│  ├── Hacker chỉ có 15 phút                                      │
│  ├── Token tự hết hạn                                           │
│  └── Giảm thiểu thiệt hại                                       │
│                                                                  │
│  → Kết hợp với Refresh Token để UX tốt hơn                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Refresh Token

### 3.1 Refresh Token là gì?

**Refresh Token** là token dài hạn được sử dụng để **lấy Access Token mới** khi Access Token hết hạn, mà không cần user đăng nhập lại.

```javascript
// Ví dụ Refresh Token payload
{
  "user_id": "user_123",
  "token_id": "rt_abc123",  // Unique ID để revoke
  "iat": 1699990000,
  "exp": 1702582000  // Hết hạn sau 30 ngày
}
```

### 3.2 Đặc điểm của Refresh Token

| Đặc điểm | Giá trị | Lý do |
|----------|---------|-------|
| **Thời gian sống** | 7-30 ngày | Dài để user không phải login lại |
| **Lưu ở đâu** | HttpOnly Cookie / Database | Bảo mật tối đa |
| **Chứa gì** | User ID, token ID | Minimal, chỉ để refresh |
| **Khi nào dùng** | Khi Access Token hết hạn | Không gửi mỗi request |

### 3.3 Token Refresh Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                        Token Refresh Flow                             │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   Client                                              Server          │
│     │                                                   │             │
│     │ 1. GET /api/profile                               │             │
│     │    Authorization: Bearer <expired_access_token>   │             │
│     │ ──────────────────────────────────────────────►   │             │
│     │                                                   │             │
│     │ 2. 401 Unauthorized: Token expired                │             │
│     │ ◄──────────────────────────────────────────────   │             │
│     │                                                   │             │
│     │ 3. POST /auth/refresh                             │             │
│     │    Cookie: refreshToken=eyJ...                    │             │
│     │ ──────────────────────────────────────────────►   │             │
│     │                                                   │             │
│     │                        4. Verify refresh token     │             │
│     │                        5. Generate new tokens      │             │
│     │                                                   │             │
│     │ 6. Response: { accessToken: "new_eyJ..." }        │             │
│     │    Set-Cookie: refreshToken=new_eyJ... (optional) │             │
│     │ ◄──────────────────────────────────────────────   │             │
│     │                                                   │             │
│     │ 7. Retry original request với new access token    │             │
│     │ ──────────────────────────────────────────────►   │             │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.4 Token Rotation (Xoay vòng token)

**Token Rotation** là kỹ thuật tạo Refresh Token mới mỗi lần refresh, vô hiệu hóa token cũ.

```javascript
// Refresh Token Rotation Flow
async function refreshTokens(oldRefreshToken) {
  // 1. Verify old refresh token
  const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET)

  // 2. Check if token exists in database (not revoked)
  const storedToken = await db.refreshTokens.findOne({
    token_id: decoded.token_id
  })

  if (!storedToken) {
    // Token đã bị revoke hoặc không tồn tại
    throw new Error('Invalid refresh token')
  }

  // 3. Delete old refresh token
  await db.refreshTokens.delete({ token_id: decoded.token_id })

  // 4. Generate new token pair
  const newAccessToken = generateAccessToken(decoded.user_id)
  const newRefreshToken = generateRefreshToken(decoded.user_id)

  // 5. Store new refresh token
  await db.refreshTokens.create({
    token_id: newRefreshToken.token_id,
    user_id: decoded.user_id,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  })

  return { newAccessToken, newRefreshToken }
}
```

**Lợi ích của Token Rotation:**
- Phát hiện token bị đánh cắp (reuse detection)
- Giới hạn thời gian token có hiệu lực thực tế
- Tăng cường bảo mật

### 3.5 Revoke Refresh Token (Thu hồi token)

```javascript
// Các trường hợp cần revoke refresh token
const revokeScenarios = [
  'User logout',
  'Password changed',
  'User deactivated',
  'Suspicious activity detected',
  'User clicks "Logout all devices"'
]

// Revoke single token
async function revokeToken(tokenId) {
  await db.refreshTokens.delete({ token_id: tokenId })
}

// Revoke all user tokens (logout everywhere)
async function revokeAllUserTokens(userId) {
  await db.refreshTokens.deleteMany({ user_id: userId })
}
```

### 3.6 Access Token vs Refresh Token - So sánh

```
┌─────────────────────────────────────────────────────────────────┐
│              Access Token vs Refresh Token                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ACCESS TOKEN                    REFRESH TOKEN                   │
│  ─────────────                   ─────────────                   │
│  • Ngắn hạn (15 phút)           • Dài hạn (30 ngày)             │
│  • Gửi mỗi request              • Chỉ gửi khi refresh           │
│  • Chứa user info               • Chỉ chứa user ID              │
│  • Lưu trong memory             • Lưu trong HttpOnly cookie     │
│  • Không cần DB lookup          • Cần verify trong DB           │
│  • Khó revoke                   • Dễ revoke                     │
│                                                                  │
│  → Kết hợp cả 2 để có security + UX tốt nhất                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. Input Validation với Express Validator

### 4.1 Express Validator là gì?

**Express Validator** là thư viện validation phổ biến nhất cho Express.js, được xây dựng trên `validator.js`.

```bash
npm install express-validator
```

### 4.2 Validation cơ bản

```javascript
const { body, validationResult } = require('express-validator')

// Route với validation
app.post('/register',
  // Validation rules
  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password phải ít nhất 6 ký tự'),

  // Handler
  (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Proceed with registration...
  }
)
```

### 4.3 Các Validators phổ biến

| Validator | Mô tả | Ví dụ |
|-----------|-------|-------|
| `isEmail()` | Kiểm tra email hợp lệ | `body('email').isEmail()` |
| `isLength()` | Độ dài chuỗi | `body('name').isLength({ min: 2, max: 50 })` |
| `isStrongPassword()` | Password mạnh | `body('password').isStrongPassword()` |
| `isInt()` | Số nguyên | `body('age').isInt({ min: 0, max: 150 })` |
| `isBoolean()` | Boolean | `body('active').isBoolean()` |
| `isIn()` | Trong danh sách | `body('role').isIn(['user', 'admin'])` |
| `matches()` | Regex pattern | `body('phone').matches(/^0[0-9]{9}$/)` |
| `trim()` | Xóa khoảng trắng | `body('name').trim()` |
| `escape()` | Escape HTML | `body('bio').escape()` |
| `normalizeEmail()` | Chuẩn hóa email | `body('email').normalizeEmail()` |

### 4.4 checkSchema - Schema-based Validation

`checkSchema` cho phép định nghĩa validation rules dưới dạng object, dễ đọc và tái sử dụng hơn.

```javascript
const { checkSchema, validationResult } = require('express-validator')

// Định nghĩa schema
const registerSchema = {
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'Email không hợp lệ'
    },
    normalizeEmail: true,
    custom: {
      options: async (value) => {
        const existingUser = await User.findOne({ email: value })
        if (existingUser) {
          throw new Error('Email đã được sử dụng')
        }
        return true
      }
    }
  },
  password: {
    in: ['body'],
    isLength: {
      options: { min: 6, max: 50 },
      errorMessage: 'Password phải từ 6-50 ký tự'
    },
    isStrongPassword: {
      options: {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0
      },
      errorMessage: 'Password phải có chữ hoa, chữ thường và số'
    }
  },
  confirm_password: {
    in: ['body'],
    custom: {
      options: (value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Confirm password không khớp')
        }
        return true
      }
    }
  },
  name: {
    in: ['body'],
    trim: true,
    isLength: {
      options: { min: 2, max: 100 },
      errorMessage: 'Tên phải từ 2-100 ký tự'
    }
  }
}

// Sử dụng schema
app.post('/register',
  checkSchema(registerSchema),
  (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    // ...
  }
)
```

### 4.5 Custom Validators

```javascript
const { body } = require('express-validator')

// Custom async validator - Kiểm tra email tồn tại
const emailExistsValidator = body('email').custom(async (email) => {
  const user = await User.findOne({ email })
  if (user) {
    throw new Error('Email đã được đăng ký')
  }
  return true
})

// Custom validator với access to request
const confirmPasswordValidator = body('confirm_password')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Mật khẩu xác nhận không khớp')
    }
    return true
  })

// Custom validator - format cụ thể
const phoneValidator = body('phone')
  .custom((value) => {
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/
    if (!vnPhoneRegex.test(value)) {
      throw new Error('Số điện thoại Việt Nam không hợp lệ')
    }
    return true
  })
```

### 4.6 Validation Middleware Pattern

```javascript
// middlewares/users.middlewares.js
const { checkSchema, validationResult } = require('express-validator')

// Tách schema ra file riêng
const registerSchema = { /* ... */ }
const loginSchema = { /* ... */ }

// Wrapper middleware để handle validation result
const validate = (schema) => {
  return async (req, res, next) => {
    await checkSchema(schema).run(req)

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: 'Validation failed',
        errors: errors.array().map(err => ({
          field: err.path,
          message: err.msg
        }))
      })
    }

    next()
  }
}

// Export middleware
module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema)
}

// Sử dụng trong routes
const { validateRegister } = require('./middlewares/users.middlewares')

router.post('/register', validateRegister, usersController.register)
```

### 4.7 Validation Error Response Format

```javascript
// Response khi validation fail
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email không hợp lệ"
    },
    {
      "field": "password",
      "message": "Password phải ít nhất 6 ký tự"
    }
  ]
}
```

---

## 5. Token Generation

### 5.1 Cài đặt jsonwebtoken

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken  # TypeScript
```

### 5.2 Tạo Access Token

```javascript
const jwt = require('jsonwebtoken')

// Environment variables
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET  // Random string, ít nhất 32 chars
const ACCESS_TOKEN_EXPIRES_IN = '15m'  // 15 phút

function generateAccessToken(user) {
  const payload = {
    user_id: user._id,
    email: user.email,
    role: user.role
    // Không lưu password hay thông tin nhạy cảm!
  }

  const options = {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    // algorithm: 'HS256'  // Default
  }

  return jwt.sign(payload, ACCESS_TOKEN_SECRET, options)
}

// Kết quả: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzIn0.xxx
```

### 5.3 Tạo Refresh Token

```javascript
const crypto = require('crypto')

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET
const REFRESH_TOKEN_EXPIRES_IN = '30d'  // 30 ngày

function generateRefreshToken(userId) {
  const payload = {
    user_id: userId,
    token_id: crypto.randomUUID()  // Unique ID để track/revoke
  }

  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN
  })
}
```

### 5.4 Sign Token với Promise (Async)

```javascript
// Promisify jwt.sign để dùng async/await
const signToken = (payload, secret, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (error, token) => {
      if (error) {
        reject(error)
      }
      resolve(token)
    })
  })
}

// Sử dụng
async function generateTokens(user) {
  const [accessToken, refreshToken] = await Promise.all([
    signToken(
      { user_id: user._id, email: user.email },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    ),
    signToken(
      { user_id: user._id, token_id: crypto.randomUUID() },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '30d' }
    )
  ])

  return { accessToken, refreshToken }
}
```

### 5.5 Verify Token

```javascript
// Verify Access Token
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET)
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired')
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token')
    }
    throw error
  }
}

// Promisify verify
const verifyToken = (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (error, decoded) => {
      if (error) {
        reject(error)
      }
      resolve(decoded)
    })
  })
}
```

### 5.6 Complete Token Service

```javascript
// services/token.service.js
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

class TokenService {
  constructor() {
    this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
    this.accessTokenExpiresIn = '15m'
    this.refreshTokenExpiresIn = '30d'
  }

  signToken(payload, secret, expiresIn) {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn }, (err, token) => {
        if (err) reject(err)
        resolve(token)
      })
    })
  }

  verifyToken(token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) reject(err)
        resolve(decoded)
      })
    })
  }

  async generateAccessToken(user) {
    return this.signToken(
      { user_id: user._id, email: user.email, role: user.role },
      this.accessTokenSecret,
      this.accessTokenExpiresIn
    )
  }

  async generateRefreshToken(userId) {
    return this.signToken(
      { user_id: userId, token_id: crypto.randomUUID() },
      this.refreshTokenSecret,
      this.refreshTokenExpiresIn
    )
  }

  async generateTokenPair(user) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user._id)
    ])
    return { accessToken, refreshToken }
  }

  async verifyAccessToken(token) {
    return this.verifyToken(token, this.accessTokenSecret)
  }

  async verifyRefreshToken(token) {
    return this.verifyToken(token, this.refreshTokenSecret)
  }
}

module.exports = new TokenService()
```

### 5.7 Complete Login/Register Flow

```javascript
// controllers/auth.controller.js
const tokenService = require('../services/token.service')
const bcrypt = require('bcrypt')

const authController = {
  async register(req, res) {
    const { email, password, name } = req.body

    // 1. Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 2. Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name
    })

    // 3. Generate tokens
    const { accessToken, refreshToken } = await tokenService.generateTokenPair(user)

    // 4. Save refresh token to DB (optional, for revocation)
    await RefreshToken.create({
      user_id: user._id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    })

    // 5. Response
    res.status(201).json({
      message: 'Đăng ký thành công',
      result: {
        accessToken,
        refreshToken,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      }
    })
  },

  async login(req, res) {
    const { email, password } = req.body

    // 1. Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
    }

    // 2. Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
    }

    // 3. Generate tokens
    const { accessToken, refreshToken } = await tokenService.generateTokenPair(user)

    // 4. Response
    res.json({
      message: 'Đăng nhập thành công',
      result: { accessToken, refreshToken }
    })
  }
}
```

---

## 6. Best Practices & Security

### 6.1 Secret Key Best Practices

```bash
# .env
# Sử dụng random string đủ dài (ít nhất 32 characters)
ACCESS_TOKEN_SECRET=a3f8b2c1d4e5f6789012345678901234567890abcdef
REFRESH_TOKEN_SECRET=x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f

# Generate random secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**DO:**
- Sử dụng secret key riêng biệt cho Access và Refresh Token
- Secret key ít nhất 256 bits (32 characters)
- Lưu trong environment variables
- Rotate secrets định kỳ

**DON'T:**
- Hardcode secret trong code
- Sử dụng cùng secret cho cả 2 loại token
- Commit secrets vào git

### 6.2 Token Storage Best Practices

```
┌─────────────────────────────────────────────────────────────────┐
│                   Token Storage Security                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ❌ LocalStorage                                                 │
│     - Vulnerable to XSS attacks                                 │
│     - JavaScript có thể đọc được                                │
│                                                                  │
│  ⚠️  SessionStorage                                              │
│     - Tốt hơn localStorage                                      │
│     - Vẫn vulnerable to XSS                                     │
│                                                                  │
│  ✅ HttpOnly Cookie (Recommended)                                │
│     - JavaScript không đọc được                                 │
│     - Tự động gửi với mỗi request                               │
│     - Cần CSRF protection                                       │
│                                                                  │
│  ✅ Memory (In-memory variable)                                  │
│     - Secure nhất cho Access Token                              │
│     - Mất khi refresh page                                      │
│     - Kết hợp với Refresh Token trong HttpOnly cookie           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 HttpOnly Cookie Setup

```javascript
// Set Refresh Token as HttpOnly cookie
res.cookie('refreshToken', refreshToken, {
  httpOnly: true,        // JavaScript không đọc được
  secure: true,          // Chỉ gửi qua HTTPS
  sameSite: 'strict',    // CSRF protection
  maxAge: 30 * 24 * 60 * 60 * 1000,  // 30 days
  path: '/api/auth'      // Chỉ gửi đến auth endpoints
})
```

### 6.4 Common Security Vulnerabilities

| Vulnerability | Nguyên nhân | Giải pháp |
|---------------|-------------|-----------|
| **Token Leak** | Lưu trong localStorage | Dùng HttpOnly cookie |
| **XSS Attack** | Inject script đọc token | HttpOnly + Content Security Policy |
| **CSRF Attack** | Cookie tự động gửi | SameSite=Strict + CSRF token |
| **Brute Force** | Thử nhiều password | Rate limiting + Account lockout |
| **Token Theft** | Man-in-the-middle | HTTPS only |

### 6.5 Checklist bảo mật JWT

```markdown
## JWT Security Checklist

### Token Generation
- [ ] Sử dụng secret key đủ mạnh (≥256 bits)
- [ ] Secret key khác nhau cho Access và Refresh Token
- [ ] Access Token ngắn hạn (15 phút - 1 giờ)
- [ ] Không lưu sensitive data trong payload

### Token Storage
- [ ] Access Token trong memory hoặc HttpOnly cookie
- [ ] Refresh Token trong HttpOnly cookie
- [ ] Cookie có flag: httpOnly, secure, sameSite

### Token Transmission
- [ ] Chỉ gửi qua HTTPS
- [ ] Authorization header cho Access Token
- [ ] Không đặt token trong URL

### Token Validation
- [ ] Validate signature
- [ ] Check expiration (exp claim)
- [ ] Validate issuer (iss claim)
- [ ] Validate audience (aud claim)

### Token Revocation
- [ ] Có cơ chế revoke Refresh Token
- [ ] Blacklist cho Access Token (optional)
- [ ] Revoke khi logout, change password
```

---

## 7. Quiz - Câu hỏi kiểm tra

### Phần A: Multiple Choice (15 câu)

**Câu 1:** JWT gồm mấy phần?
- A) 2 phần
- B) 3 phần
- C) 4 phần
- D) 5 phần

**Câu 2:** Phần nào của JWT chứa thông tin user?
- A) Header
- B) Payload
- C) Signature
- D) Cả A và B

**Câu 3:** Thuật toán `HS256` trong JWT header có nghĩa là gì?
- A) Hash SHA256
- B) HMAC với SHA256
- C) RSA với SHA256
- D) AES 256

**Câu 4:** Claim `exp` trong JWT payload dùng để làm gì?
- A) Xác định ai phát hành token
- B) Xác định thời điểm token hết hạn
- C) Xác định ID của token
- D) Xác định audience của token

**Câu 5:** Thời gian sống (TTL) phù hợp cho Access Token là?
- A) 30 ngày
- B) 7 ngày
- C) 15 phút - 1 giờ
- D) 1 năm

**Câu 6:** Refresh Token nên được lưu ở đâu trên client?
- A) localStorage
- B) sessionStorage
- C) HttpOnly cookie
- D) URL query string

**Câu 7:** Khi nào cần sử dụng Refresh Token?
- A) Mỗi request đến API
- B) Khi Access Token hết hạn
- C) Khi user logout
- D) Khi user đăng ký

**Câu 8:** Token Rotation có nghĩa là gì?
- A) Xoay vòng secret key
- B) Tạo Refresh Token mới mỗi lần refresh, vô hiệu hóa token cũ
- C) Thay đổi thuật toán mã hóa
- D) Rotate user password

**Câu 9:** Trong Express Validator, method nào dùng để kiểm tra email hợp lệ?
- A) `isValid()`
- B) `isEmail()`
- C) `checkEmail()`
- D) `validateEmail()`

**Câu 10:** `checkSchema()` trong Express Validator dùng để làm gì?
- A) Kiểm tra database schema
- B) Định nghĩa validation rules dạng object
- C) Tạo GraphQL schema
- D) Validate JSON schema

**Câu 11:** Trong custom validator, làm sao để truy cập request object?
- A) `req.body`
- B) `this.req`
- C) `{ req }` trong parameter thứ 2
- D) `global.req`

**Câu 12:** Method nào của `jsonwebtoken` dùng để tạo token?
- A) `jwt.create()`
- B) `jwt.generate()`
- C) `jwt.sign()`
- D) `jwt.encode()`

**Câu 13:** Lỗi `TokenExpiredError` xuất hiện khi nào?
- A) Secret key sai
- B) Token đã hết hạn
- C) Token bị thay đổi
- D) Algorithm không đúng

**Câu 14:** Tại sao KHÔNG nên lưu token trong localStorage?
- A) Quá chậm
- B) Hết dung lượng
- C) Vulnerable to XSS attacks
- D) Không hỗ trợ trên mobile

**Câu 15:** Khi user thay đổi password, nên làm gì với tokens?
- A) Không cần làm gì
- B) Revoke tất cả Refresh Tokens
- C) Tăng thời gian sống token
- D) Tạo thêm token mới

---

### Phần B: True/False (10 câu)

**Câu 16:** JWT payload được mã hóa (encrypted) nên an toàn để lưu password.
- [ ] True
- [ ] False

**Câu 17:** Access Token nên có thời gian sống dài hơn Refresh Token.
- [ ] True
- [ ] False

**Câu 18:** Signature trong JWT đảm bảo nội dung token không bị thay đổi.
- [ ] True
- [ ] False

**Câu 19:** HttpOnly cookie có thể được đọc bằng JavaScript.
- [ ] True
- [ ] False

**Câu 20:** Nên sử dụng cùng một secret key cho cả Access Token và Refresh Token.
- [ ] True
- [ ] False

**Câu 21:** Express Validator có thể thực hiện async validation (ví dụ: check email trong database).
- [ ] True
- [ ] False

**Câu 22:** JWT là stateless, server không cần lưu trữ gì.
- [ ] True
- [ ] False

**Câu 23:** `SameSite=Strict` trên cookie giúp chống CSRF attack.
- [ ] True
- [ ] False

**Câu 24:** Khi Refresh Token bị đánh cắp, hacker có thể tạo Access Token mới vô hạn.
- [ ] True
- [ ] False

**Câu 25:** `jwt.verify()` sẽ throw error nếu token hết hạn.
- [ ] True
- [ ] False

---

### Phần C: Code Scenarios (5 câu)

**Câu 26:** Đoạn code sau có vấn đề gì?

```javascript
const token = jwt.sign(
  { user_id: user._id, password: user.password },
  'secret123',
  { expiresIn: '30d' }
)
```

---

**Câu 27:** Sửa đoạn code validation sau để kiểm tra `confirm_password` khớp với `password`:

```javascript
const registerSchema = {
  password: {
    isLength: { options: { min: 6 } }
  },
  confirm_password: {
    // TODO: Thêm validation
  }
}
```

---

**Câu 28:** Viết middleware kiểm tra Access Token và attach user vào request:

```javascript
const authMiddleware = async (req, res, next) => {
  // TODO: Implement
}
```

---

**Câu 29:** Response sau có vấn đề gì về security?

```javascript
res.json({
  accessToken: 'eyJ...',
  refreshToken: 'eyJ...',
  user: {
    id: user._id,
    email: user.email,
    password: user.password  // ???
  }
})
```

---

**Câu 30:** Giải thích flow khi Access Token hết hạn và client cần refresh:

```
1. Client gửi request với expired Access Token
2. Server trả về ???
3. Client gửi request đến ???
4. Server verify Refresh Token và ???
5. Client nhận được ??? và retry request
```

---

## Đáp án

<details>
<summary>Click để xem đáp án</summary>

### Phần A: Multiple Choice

| Câu | Đáp án | Giải thích |
|-----|--------|------------|
| 1 | B | JWT gồm 3 phần: Header, Payload, Signature |
| 2 | B | Payload chứa claims (thông tin user) |
| 3 | B | HS256 = HMAC + SHA256 (symmetric algorithm) |
| 4 | B | `exp` (expiration) = thời điểm token hết hạn |
| 5 | C | Access Token ngắn hạn (15 phút - 1 giờ) để giảm risk |
| 6 | C | HttpOnly cookie an toàn nhất, JavaScript không đọc được |
| 7 | B | Refresh Token dùng khi Access Token hết hạn |
| 8 | B | Token Rotation = tạo Refresh Token mới mỗi lần refresh |
| 9 | B | `body('email').isEmail()` |
| 10 | B | checkSchema cho phép định nghĩa validation rules dạng object |
| 11 | C | `custom: (value, { req }) => { ... }` |
| 12 | C | `jwt.sign(payload, secret, options)` |
| 13 | B | TokenExpiredError khi token đã hết hạn |
| 14 | C | localStorage vulnerable to XSS attacks |
| 15 | B | Revoke tất cả Refresh Tokens khi đổi password |

### Phần B: True/False

| Câu | Đáp án | Giải thích |
|-----|--------|------------|
| 16 | False | Payload chỉ được encode (Base64URL), KHÔNG encrypt. Ai cũng đọc được! |
| 17 | False | Access Token ngắn hạn, Refresh Token dài hạn |
| 18 | True | Signature đảm bảo integrity (không bị thay đổi) |
| 19 | False | HttpOnly cookie KHÔNG thể đọc bằng JavaScript |
| 20 | False | Nên dùng secret key khác nhau cho mỗi loại token |
| 21 | True | Express Validator hỗ trợ async custom validators |
| 22 | True | JWT stateless, server không cần lưu session |
| 23 | True | SameSite=Strict ngăn cookie gửi từ cross-site requests |
| 24 | True | Nếu không có Token Rotation hoặc revocation, hacker có thể dùng vô hạn |
| 25 | True | jwt.verify() throw TokenExpiredError nếu token hết hạn |

### Phần C: Code Scenarios

**Câu 26:** Vấn đề:
1. Lưu password trong payload (NEVER DO THIS!)
2. Secret key quá đơn giản và hardcode
3. Access Token 30 ngày quá dài

**Câu 27:**
```javascript
confirm_password: {
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password không khớp')
      }
      return true
    }
  }
}
```

**Câu 28:**
```javascript
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' })
    }
    return res.status(403).json({ message: 'Invalid token' })
  }
}
```

**Câu 29:** Vấn đề:
- Trả về password trong response (CRITICAL SECURITY ISSUE!)
- Không bao giờ trả về password cho client

**Câu 30:**
```
1. Client gửi request với expired Access Token
2. Server trả về 401 Unauthorized với message "Token expired"
3. Client gửi request đến /auth/refresh với Refresh Token
4. Server verify Refresh Token và tạo Access Token mới (có thể cả Refresh Token mới nếu dùng rotation)
5. Client nhận được Access Token mới và retry request ban đầu
```

</details>

---

## Tổng kết

### Key Takeaways

1. **JWT Structure:** 3 phần - Header, Payload, Signature
2. **Access Token:** Ngắn hạn (15m), chứa user info, gửi mỗi request
3. **Refresh Token:** Dài hạn (30d), chỉ dùng để lấy Access Token mới
4. **Token Rotation:** Tạo Refresh Token mới mỗi lần refresh
5. **Validation:** Dùng Express Validator với checkSchema cho code clean
6. **Security:** HttpOnly cookie, separate secrets, không lưu sensitive data

### Điểm phỏng vấn hay hỏi

- JWT là gì? Cấu trúc như thế nào?
- Access Token vs Refresh Token khác gì?
- Tại sao Access Token ngắn hạn?
- Token lưu ở đâu? Tại sao?
- Làm sao revoke JWT?
- XSS và CSRF attack là gì? Cách phòng chống?

---

> **Next Step:** Tiếp tục với E4.9-E4.11 (Error Handling) hoặc chuyển sang NestJS (N1)
