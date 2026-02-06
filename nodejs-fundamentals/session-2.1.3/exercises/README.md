# Bài tập - Session 2.1.3: Request Body Parsing

---

## Bài 1: Parse JSON cơ bản (Dễ)

Tạo server với endpoint:

```
POST /api/message
Body: { "text": "Hello World" }
```

**Yêu cầu:**
- Parse JSON body
- Trả về: `{ received: true, message: "Hello World", length: 11 }`

<details>
<summary>Gợi ý</summary>

1. Collect chunks với `req.on('data')`
2. Parse JSON trong `req.on('end')`
3. Lấy `data.text` và `data.text.length`

</details>

---

## Bài 2: Validate Contact Form (Trung bình)

Tạo server với endpoint:

```
POST /api/contact
Body: { "name": "...", "email": "...", "message": "..." }
```

**Validation rules:**
- `name`: required, 2-50 ký tự
- `email`: required, đúng format email
- `message`: required, 10-500 ký tự

**Response:**
- Success: `201` + `{ success: true }`
- Fail: `400` + `{ success: false, errors: [...] }`

<details>
<summary>Gợi ý</summary>

```javascript
function validateContact(data) {
  const errors = [];

  // Check name
  if (!data.name) errors.push('Name is required');
  else if (data.name.length < 2 || data.name.length > 50) {
    errors.push('Name must be 2-50 characters');
  }

  // Check email...
  // Check message...

  return { valid: errors.length === 0, errors };
}
```

</details>

---

## Bài 3: Multi Content-Type (Trung bình)

Tạo server nhận được CẢ 2 loại Content-Type:

```
POST /api/login

# JSON
Content-Type: application/json
{ "email": "...", "password": "..." }

# Form
Content-Type: application/x-www-form-urlencoded
email=...&password=...
```

**Yêu cầu:**
- Detect Content-Type và parse phù hợp
- Validate: email required + password min 6 ký tự
- Response cho biết đã parse từ JSON hay Form

<details>
<summary>Gợi ý</summary>

```javascript
const contentType = req.headers['content-type'];

if (contentType.includes('application/json')) {
  // JSON.parse()
} else if (contentType.includes('application/x-www-form-urlencoded')) {
  // new URLSearchParams()
}
```

</details>

---

## Bài 4: Body Size Limit (Khó)

Tạo server với body size limit 1KB.

**Yêu cầu:**
- Nếu body > 1024 bytes → reject ngay, trả về `413 Payload Too Large`
- Nếu body <= 1024 bytes → parse và xử lý bình thường

**Test:**
- Gửi body nhỏ → OK
- Gửi body lớn (vd: 2000 ký tự) → 413 error

<details>
<summary>Gợi ý</summary>

```javascript
const MAX_SIZE = 1024;
let totalSize = 0;

req.on('data', (chunk) => {
  totalSize += chunk.length;

  if (totalSize > MAX_SIZE) {
    req.destroy();
    // Send 413 response
    return;
  }

  chunks.push(chunk);
});
```

</details>

---

## Bài 5: Product API (Khó)

Tạo CRUD API cho products:

```
GET    /api/products      → Lấy tất cả
GET    /api/products/:id  → Lấy 1 product
POST   /api/products      → Tạo mới
PUT    /api/products/:id  → Update
DELETE /api/products/:id  → Xóa
```

**Product schema:**
```javascript
{
  id: number,
  name: string,      // required, 2-100 chars
  price: number,     // required, > 0
  quantity: number,  // required, >= 0
  category: string   // optional
}
```

**Yêu cầu:**
- Lưu vào array (fake database)
- Validate khi POST/PUT
- Chia code thành nhiều files (như bài 5 demo)

<details>
<summary>Gợi ý cấu trúc</summary>

```
bai-5-product-api/
├── index.js        # Entry + routing
├── routes.js       # Route handlers
├── helpers.js      # Parse body, send response
├── validators.js   # validateProduct()
└── data.js         # products = []
```

</details>

---

## Checklist hoàn thành

- [ ] Bài 1: Parse JSON cơ bản
- [ ] Bài 2: Validate Contact Form
- [ ] Bài 3: Multi Content-Type
- [ ] Bài 4: Body Size Limit
- [ ] Bài 5: Product API

---

## Nộp bài

Tạo folder `exercises/` và làm bài trong đó. Mỗi bài 1 file hoặc 1 folder.
