# SESSION 2.1.3: REQUEST BODY PARSING

> Học cách đọc và parse request body trong Node.js HTTP server thuần (không Express)

---

## PHẦN 1: REQUEST BODY LÀ GÌ?

**REQUEST BODY** là phần "thân" của HTTP request, chứa DATA mà client gửi lên server.

### Cấu trúc HTTP Request

```
POST /api/users HTTP/1.1           ← Request Line (method, path, version)
Host: localhost:3000               ← Headers bắt đầu từ đây
Content-Type: application/json     ← Header cho biết format của body
Content-Length: 42                 ← Header cho biết size của body
                                   ← Dòng trống (ngăn cách headers/body)
{"name": "Leminho", "age": 25}     ← REQUEST BODY (phần data)
```

### Khi nào cần đọc Request Body?

**✅ CÓ BODY (cần đọc):**
- `POST` → Tạo mới resource (vd: tạo user mới)
- `PUT` → Update toàn bộ resource (vd: cập nhật user)
- `PATCH` → Update một phần resource (vd: đổi email)

**❌ KHÔNG CÓ BODY:**
- `GET` → Chỉ lấy data, không gửi body
- `DELETE` → Thường không có body (chỉ cần ID trong URL)
- `HEAD` → Giống GET nhưng chỉ lấy headers

### Ví dụ thực tế

| Action | Method | Body |
|--------|--------|------|
| Đăng ký tài khoản | POST | `{ username, email, password }` |
| Đăng nhập | POST | `{ email, password }` |
| Cập nhật profile | PUT | `{ name, email, avatar, bio }` |
| Đổi mật khẩu | PATCH | `{ oldPassword, newPassword }` |
| Lấy danh sách users | GET | ❌ Không có body |
| Xóa user | DELETE | ❌ Không có body (ID trong URL: `/users/123`) |

---

## PHẦN 2: CONTENT-TYPE HEADER

**Content-Type** header cho server biết DATA trong body đang ở FORMAT gì. Server dựa vào đây để biết cách PARSE (phân tích) body.

| Content-Type | Mô tả | Phổ biến |
|--------------|-------|----------|
| `application/json` | JSON format | ⭐⭐⭐⭐⭐ |
| `application/x-www-form-urlencoded` | HTML form data | ⭐⭐⭐ |
| `multipart/form-data` | File upload + form data | ⭐⭐⭐ |
| `text/plain` | Plain text | ⭐ |
| `text/html` | HTML content | ⭐ |
| `application/xml` | XML format | ⭐ |

### Trong thực tế
- API modern (REST API, GraphQL) → **99% dùng `application/json`**
- HTML form submit → `application/x-www-form-urlencoded`
- Upload file → `multipart/form-data`

### Cách đọc Content-Type trong Node.js

```javascript
const contentType = req.headers['content-type'];
// Kết quả: 'application/json' hoặc 'application/x-www-form-urlencoded'
```

> ⚠️ **LƯU Ý:** Header names trong Node.js luôn là **LOWERCASE** (chữ thường)
> - `req.headers['content-type']` ✅ Đúng
> - `req.headers['Content-Type']` ❌ Sai (sẽ trả về undefined)

---

## PHẦN 3: BODY LÀ STREAM DATA

**QUAN TRỌNG:** Request body KHÔNG đến cùng lúc!

Body được gửi theo dạng **STREAM** (luồng dữ liệu), chia thành nhiều **CHUNKS** (mảnh). Giống như xem video streaming - không tải hết rồi mới xem, mà xem từng phần.

### Tại sao Stream?

Tưởng tượng upload file 1GB:

| Cách | Mô tả |
|------|-------|
| ❌ Không stream | Đợi nhận HẾT 1GB → tốn 1GB RAM → mới xử lý → Server có 8GB RAM chỉ handle được 8 requests! |
| ✅ Có stream | Nhận từng chunk 64KB → xử lý ngay → giải phóng memory → Server handle được HÀNG NGÀN requests cùng lúc! |

### Cách đọc Stream trong Node.js

```javascript
// req là một Readable Stream, có các events:

req.on('data', (chunk) => {
  // Event 'data' được emit mỗi khi nhận được 1 chunk
  // chunk là Buffer (binary data)
  console.log('Received chunk:', chunk.length, 'bytes');
});

req.on('end', () => {
  // Event 'end' được emit khi đã nhận TOÀN BỘ body
  console.log('Body received completely!');
});

req.on('error', (err) => {
  // Event 'error' khi có lỗi (vd: client disconnect giữa chừng)
  console.error('Error:', err.message);
});
```

### Minh họa quá trình nhận body

```
Client gửi body: {"name": "Leminho", "email": "test@mail.com"}

Server nhận:
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Chunk 1   │ → │   Chunk 2   │ → │   Chunk 3   │ → END
│ '{"name":'  │   │ '"Leminho",'│   │ '"email":..}│
└─────────────┘   └─────────────┘   └─────────────┘
     ↓ data           ↓ data           ↓ data        ↓ end

(Thực tế với body nhỏ, thường chỉ có 1 chunk)
```

---

## PHẦN 4: GỘP CHUNKS THÀNH BODY

Vì body đến theo chunks, ta cần:
1. Thu thập (collect) tất cả chunks
2. Gộp (concatenate) chúng lại
3. Convert thành string để xử lý

### Cách 1: Gộp string (đơn giản, ok cho body nhỏ)

```javascript
let body = '';
req.on('data', (chunk) => {
  body += chunk.toString(); // Convert Buffer → String rồi nối
});
req.on('end', () => {
  console.log('Full body:', body);
});
```

### Cách 2: Dùng Buffer.concat() (tốt hơn, handle được binary)

```javascript
const chunks = [];
req.on('data', (chunk) => {
  chunks.push(chunk); // Lưu từng chunk (vẫn là Buffer)
});
req.on('end', () => {
  const buffer = Buffer.concat(chunks); // Gộp tất cả Buffers
  const body = buffer.toString('utf8'); // Convert sang string
  console.log('Full body:', body);
});
```

### So sánh 2 cách

| Tiêu chí | Cách 1 (string +=) | Cách 2 (Buffer.concat) |
|----------|-------------------|------------------------|
| Đơn giản | ✅ Dễ hiểu | Phức tạp hơn chút |
| Performance | Chậm với body lớn | ✅ Tối ưu hơn |
| Binary data | ❌ Không handle được | ✅ Handle được |
| Encoding issues | Có thể bị lỗi | ✅ An toàn hơn |
| Nên dùng khi | Body nhỏ, text only | ✅ Mọi trường hợp |

> 💡 **KHUYẾN NGHỊ:** Dùng **Cách 2 (Buffer.concat)** để tạo thói quen tốt!

---

## PHẦN 5: PARSE JSON BODY

Sau khi có body string, cần **PARSE** thành JavaScript object để sử dụng.

### Flow đầy đủ để parse JSON

1. Check Content-Type có phải `application/json` không
2. Collect tất cả chunks
3. Gộp thành string
4. `JSON.parse()` với try-catch
5. Handle errors nếu có

### Code Pattern

```javascript
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    // Check Content-Type
    const contentType = req.headers['content-type'];
    if (contentType !== 'application/json') {
      reject(new Error('Content-Type must be application/json'));
      return;
    }

    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {
      try {
        const body = Buffer.concat(chunks).toString('utf8');
        const data = JSON.parse(body); // Parse JSON
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON format'));
      }
    });

    req.on('error', reject);
  });
}

// Sử dụng:
const data = await parseJsonBody(req);
console.log(data.name); // "Leminho"
```

### Common Errors khi parse JSON

| Lỗi | Nguyên nhân | HTTP Status |
|-----|-------------|-------------|
| Unexpected token | JSON syntax sai | 400 Bad Request |
| Unexpected end of input | JSON không đóng `}` | 400 Bad Request |
| Empty body | Client gửi body rỗng | 400 Bad Request |
| Wrong Content-Type | Gửi JSON nhưng ko set header | 415 Unsupported |

---

## PHẦN 6: PARSE URL-ENCODED FORM

Khi HTML form submit với `method="POST"` (không set enctype):
→ Browser tự động dùng `Content-Type: application/x-www-form-urlencoded`

### Format của URL-Encoded

```
name=Leminho&email=test%40mail.com&age=25
│            │                      │
│            │                      └─ Cặp key=value thứ 3
│            └─ @ được encode thành %40
└─ Các cặp key=value ngăn cách bởi &
```

### Cách parse bằng URLSearchParams

```javascript
const body = 'name=Leminho&email=test%40mail.com&age=25';
const params = new URLSearchParams(body);

console.log(params.get('name'));   // 'Leminho'
console.log(params.get('email'));  // 'test@mail.com' (tự decode %40 → @)
console.log(params.get('age'));    // '25' (LƯU Ý: luôn là STRING!)

// Convert sang object
const data = Object.fromEntries(params);
// { name: 'Leminho', email: 'test@mail.com', age: '25' }
```

### So sánh JSON vs URL-Encoded

| Tiêu chí | JSON | URL-Encoded |
|----------|------|-------------|
| Content-Type | `application/json` | `application/x-www-form-urlencoded` |
| Format | `{"name":"Leminho"}` | `name=Leminho` |
| Data types | ✅ Có (string, number) | ❌ Mọi thứ là string |
| Nested objects | ✅ Hỗ trợ tốt | ❌ Phức tạp |
| Arrays | ✅ `[1, 2, 3]` | ⚠️ `a=1&a=2&a=3` |
| Readable | ✅ Dễ đọc | Khó đọc hơn |
| Browser support | Cần JavaScript | ✅ HTML form native |
| Phổ biến với | ⭐ REST API, SPA | Traditional HTML forms |

> 💡 **KHUYẾN NGHỊ:** Dùng JSON cho API, URL-encoded cho HTML forms đơn giản.

---

## PHẦN 7: BODY VALIDATION CƠ BẢN

Sau khi parse body thành object, **LUÔN PHẢI VALIDATE** trước khi sử dụng!

### Tại sao cần Validate?
- Client có thể gửi data sai/thiếu
- Hacker có thể gửi data độc hại
- Tránh lỗi khi xử lý data không hợp lệ

### Các loại Validation cơ bản

```javascript
// 1. Required fields (bắt buộc)
if (!data.name) {
  return { valid: false, error: 'Name is required' };
}

// 2. Type checking (kiểm tra kiểu dữ liệu)
if (typeof data.name !== 'string') {
  return { valid: false, error: 'Name must be a string' };
}

// 3. Format checking (kiểm tra định dạng)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(data.email)) {
  return { valid: false, error: 'Invalid email format' };
}

// 4. Range checking (kiểm tra phạm vi)
if (data.age < 0 || data.age > 150) {
  return { valid: false, error: 'Age must be between 0 and 150' };
}

// 5. Length checking (kiểm tra độ dài)
if (data.password.length < 8) {
  return { valid: false, error: 'Password must be at least 8 characters' };
}
```

### Validation Function Pattern

```javascript
function validateUser(data) {
  const errors = [];

  // Required
  if (!data.name) errors.push('Name is required');
  if (!data.email) errors.push('Email is required');

  // Format
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Range
  if (data.age !== undefined && (data.age < 0 || data.age > 150)) {
    errors.push('Age must be between 0 and 150');
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}
```

### Response khi Validation Fail

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "errors": [
    "Name is required",
    "Invalid email format"
  ]
}
```

---

## PHẦN 8: HANDLING LARGE BODIES

**NGUY CƠ:** Client có thể gửi body CỰC LỚN để tấn công server (DoS attack)!

### Ví dụ tấn công
- Gửi body 10GB → Server hết RAM → Crash!
- Gửi 1000 requests với body 100MB → Server quá tải

### Giải pháp: Set LIMIT cho body size

```javascript
const MAX_BODY_SIZE = 1024 * 1024; // 1MB limit

function parseBodyWithLimit(req) {
  return new Promise((resolve, reject) => {
    let totalSize = 0;
    const chunks = [];

    req.on('data', (chunk) => {
      totalSize += chunk.length;

      // Check nếu vượt quá limit
      if (totalSize > MAX_BODY_SIZE) {
        req.destroy(); // Ngắt connection ngay lập tức
        reject(new Error('Body too large'));
        return;
      }

      chunks.push(chunk);
    });

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');
      resolve(body);
    });

    req.on('error', reject);
  });
}
```

### Best Practices

1. Luôn set body size limit
2. Check Content-Length header trước khi đọc body
3. Set timeout cho request
4. Với file upload, dùng streaming write thay vì load vào memory

### Typical Limits

| Use case | Limit |
|----------|-------|
| JSON API | 1MB - 10MB |
| File upload | 10MB - 100MB (tùy use case) |
| Express mặc định | 100KB (khá nhỏ!) |

---

## TÓM TẮT SESSION

| # | Nội dung |
|---|----------|
| 1 | **REQUEST BODY** chứa data client gửi lên (thường với POST/PUT/PATCH) |
| 2 | **CONTENT-TYPE** header cho biết format: `application/json` hoặc `application/x-www-form-urlencoded` |
| 3 | **BODY LÀ STREAM**, cần collect chunks: `req.on('data')` → `req.on('end')` → `Buffer.concat()` |
| 4 | **PARSE JSON:** `JSON.parse()` với try-catch |
| 5 | **PARSE URL-ENCODED:** `new URLSearchParams(body)` |
| 6 | **LUÔN VALIDATE** data trước khi sử dụng |
| 7 | **SET LIMIT** cho body size để tránh DoS attack |

---

## NEXT STEPS

Xem các file demo để thực hành từng concept:

1. `01-read-raw-body.js` - Demo đọc raw body
2. `02-parse-json.js` - Demo parse JSON
3. `03-parse-form.js` - Demo parse form data
4. `04-validation.js` - Demo validation
5. `05-user-api.js` - Mini project
