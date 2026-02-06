# 📝 QUIZ - SESSION 2.1.1: ROUTING PATTERNS

> Trả lời các câu hỏi sau để kiểm tra kiến thức. Đáp án ở cuối file.

---

## PHẦN 1: URL PARSING (5 câu)

### Câu 1:
Cho URL: `https://api.example.com:8080/users/123?page=2&limit=10#section1`

Hãy điền giá trị:
- `url.protocol` = ?
- `url.hostname` = ?
- `url.port` = ?
- `url.pathname` = ?
- `url.search` = ?

---

### Câu 2:
Trong Node.js HTTP server, `req.url` chứa những gì?

A. Toàn bộ URL (protocol + host + path + query)
B. Chỉ pathname
C. pathname + search (query string)
D. Chỉ search (query string)

---

### Câu 3:
Đoạn code sau có lỗi gì?

```javascript
const server = http.createServer((req, res) => {
  const url = new URL(req.url);
  const pathname = url.pathname;
});
```

---

### Câu 4:
Cho code:

```javascript
const url = new URL('/products?color=red&size=42', 'http://localhost');
const color = url.searchParams.get('color');
```

`color` có giá trị và kiểu dữ liệu gì?

A. `"red"` (string)
B. `red` (string không có quotes)
C. `null`
D. `undefined`

---

### Câu 5:
Làm sao để lấy TẤT CẢ giá trị của param `tag` từ URL `/search?tag=js&tag=node&tag=react`?

A. `url.searchParams.get('tag')`
B. `url.searchParams.getAll('tag')`
C. `url.searchParams.tags`
D. `url.searchParams['tag']`

---

## PHẦN 2: ROUTE MATCHING (5 câu)

### Câu 6:
Static route và Dynamic route khác nhau như thế nào?

---

### Câu 7:
Regex `/^\/users\/(\d+)$/` sẽ match với URL nào?

A. `/users`
B. `/users/`
C. `/users/123`
D. `/users/abc`
E. `/users/123/posts`

---

### Câu 8:
Cho code:

```javascript
const pathname = '/users/456';
const match = pathname.match(/^\/users\/(\d+)$/);
```

`match[1]` có giá trị gì?

---

### Câu 9:
Giải thích ý nghĩa từng phần trong regex: `/^\/api\/users\/(\d+)$/`

- `^` = ?
- `\/` = ?
- `(\d+)` = ?
- `$` = ?

---

### Câu 10:
Tại sao thứ tự routes quan trọng? Cho ví dụ.

---

## PHẦN 3: ROUTER PATTERN (5 câu)

### Câu 11:
Đoạn code sau hoạt động như thế nào?

```javascript
const routes = {
  '/': handleHome,
  '/about': handleAbout,
};

const handler = routes['/about'];
handler(req, res);
```

---

### Câu 12:
Tại sao cần tách handler ra thành function riêng thay vì viết trực tiếp trong `if-else`?

---

### Câu 13:
Cho code:

```javascript
const routes = [
  ['GET', /^\/users$/, getUsers, []],
  ['POST', /^\/users$/, createUser, []],
  ['GET', /^\/users\/(\d+)$/, getUserById, ['id']],
];
```

Giải thích ý nghĩa của mỗi phần tử trong mảng con.

---

### Câu 14:
Đoạn code sau làm gì?

```javascript
req.params = {};
paramNames.forEach((name, index) => {
  req.params[name] = match[index + 1];
});
```

---

### Câu 15:
`req.params` và `req.query` khác nhau như thế nào? Cho ví dụ.

---

## PHẦN 4: THỰC HÀNH (5 câu)

### Câu 16:
Viết regex để match URL `/posts/:slug` (slug là chuỗi bất kỳ, không chứa `/`)

---

### Câu 17:
Viết regex để match URL `/users/:userId/posts/:postId` (cả 2 là số)

---

### Câu 18:
Cho request `POST /api/users` với body `{"name":"John"}`. Tại sao cần dùng `await parseBody(req)` thay vì đọc trực tiếp `req.body`?

---

### Câu 19:
Giải thích đoạn code:

```javascript
const deletedUser = users.splice(userIndex, 1)[0];
```

---

### Câu 20:
Khi nào trả về status code:
- `200` = ?
- `201` = ?
- `400` = ?
- `404` = ?
- `405` = ?

---

---

# ĐÁP ÁN

<details>
<summary>👉 Click để xem đáp án</summary>

## PHẦN 1: URL PARSING

### Câu 1:
- `url.protocol` = `"https:"`
- `url.hostname` = `"api.example.com"`
- `url.port` = `"8080"`
- `url.pathname` = `"/users/123"`
- `url.search` = `"?page=2&limit=10"`

### Câu 2:
**C. pathname + search (query string)**

Ví dụ: Khi truy cập `http://localhost:3000/users?page=1`, `req.url` = `"/users?page=1"`

### Câu 3:
**Lỗi: Thiếu baseURL**

`new URL(req.url)` sẽ báo lỗi vì `req.url` là relative URL (chỉ có `/users?...`).

**Sửa lại:**
```javascript
const url = new URL(req.url, `http://${req.headers.host}`);
```

### Câu 4:
**A. `"red"` (string)**

`searchParams.get()` luôn trả về **string**. Nếu cần number, phải convert: `parseInt(value, 10)`.

### Câu 5:
**B. `url.searchParams.getAll('tag')`**

- `get('tag')` chỉ trả về giá trị đầu tiên: `"js"`
- `getAll('tag')` trả về mảng: `["js", "node", "react"]`

---

## PHẦN 2: ROUTE MATCHING

### Câu 6:
| Static Route | Dynamic Route |
|--------------|---------------|
| URL cố định: `/users`, `/about` | URL có phần thay đổi: `/users/:id` |
| So sánh trực tiếp: `pathname === '/users'` | Dùng regex hoặc split để extract params |

### Câu 7:
**C. `/users/123`**

- `/users` ❌ - thiếu `/:id`
- `/users/` ❌ - thiếu số sau `/`
- `/users/123` ✅ - khớp hoàn toàn
- `/users/abc` ❌ - `\d+` chỉ match số
- `/users/123/posts` ❌ - có thêm `/posts` ở cuối

### Câu 8:
**`match[1]` = `"456"`**

- `match[0]` = `"/users/456"` (toàn bộ chuỗi match)
- `match[1]` = `"456"` (captured group từ `(\d+)`)

### Câu 9:
- `^` = Bắt đầu chuỗi
- `\/` = Ký tự `/` (escape vì `/` là ký tự đặc biệt trong regex)
- `(\d+)` = Bắt 1 hoặc nhiều chữ số, lưu vào captured group
- `$` = Kết thúc chuỗi

### Câu 10:
**Thứ tự quan trọng vì router kiểm tra từ trên xuống, dừng khi match.**

Ví dụ sai:
```javascript
// Nếu đặt dynamic route trước
router.get('/users/:id', getUserById);   // match trước!
router.get('/users/profile', getProfile); // không bao giờ được gọi
```

Khi request `/users/profile`:
- `/users/:id` match → `req.params.id = "profile"` ❌

**Sửa lại:** Đặt static route trước dynamic route.

---

## PHẦN 3: ROUTER PATTERN

### Câu 11:
1. `routes['/about']` lấy function `handleAbout` từ object
2. `handler` bây giờ là function `handleAbout`
3. `handler(req, res)` gọi function đó với tham số `req, res`
4. Tương đương: `handleAbout(req, res)`

### Câu 12:
- **Dễ đọc:** Code gọn gàng, không bị 1 file 1000+ dòng
- **Dễ maintain:** Tìm và sửa nhanh
- **Tái sử dụng:** Có thể dùng handler ở nhiều nơi
- **Dễ test:** Test từng handler riêng lẻ
- **Tránh conflict:** Nhiều người làm chung không đụng nhau

### Câu 13:
```javascript
['GET', /^\/users$/, getUsers, []]
//  ↑        ↑          ↑      ↑
//  │        │          │      └── paramNames: tên các params (rỗng = không có)
//  │        │          └── handler: function xử lý
//  │        └── regex: pattern để match URL
//  └── method: HTTP method
```

### Câu 14:
Extract params từ URL và gắn vào `req.params`.

Ví dụ với URL `/users/123`:
- `match = ["/users/123", "123"]`
- `paramNames = ["id"]`
- Sau khi chạy: `req.params = { id: "123" }`

### Câu 15:
| `req.params` | `req.query` |
|--------------|-------------|
| Từ URL path | Từ query string |
| `/users/:id` → `{ id: 1 }` | `?page=2` → `{ page: "2" }` |

Ví dụ: `GET /users/5?page=2&limit=10`
- `req.params` = `{ id: 5 }`
- `req.query` = `{ page: "2", limit: "10" }`

---

## PHẦN 4: THỰC HÀNH

### Câu 16:
```javascript
/^\/posts\/([^/]+)$/

// [^/]+ = 1 hoặc nhiều ký tự KHÔNG PHẢI "/"
```

### Câu 17:
```javascript
/^\/users\/(\d+)\/posts\/(\d+)$/

// Match: /users/5/posts/10
// match[1] = "5" (userId)
// match[2] = "10" (postId)
```

### Câu 18:
Node.js HTTP server **không tự động parse body**. Body được gửi dưới dạng **stream** (từng chunk).

Cần lắng nghe sự kiện:
- `req.on("data", ...)` - nhận từng chunk
- `req.on("end", ...)` - đã nhận xong, parse JSON

Express.js có middleware `express.json()` tự động làm việc này.

### Câu 19:
```javascript
const deletedUser = users.splice(userIndex, 1)[0];
```

1. `users.splice(userIndex, 1)` - Xóa 1 phần tử tại vị trí `userIndex`
2. `splice` trả về **mảng** các phần tử đã xóa: `[{ id: 2, ... }]`
3. `[0]` - Lấy phần tử đầu tiên của mảng đó
4. `deletedUser` = user vừa bị xóa

### Câu 20:
| Status | Ý nghĩa | Khi nào dùng |
|--------|---------|--------------|
| `200` | OK | Request thành công (GET, PUT, DELETE) |
| `201` | Created | Tạo mới thành công (POST) |
| `400` | Bad Request | Client gửi data sai (thiếu field, JSON invalid) |
| `404` | Not Found | Resource không tồn tại |
| `405` | Method Not Allowed | URL đúng nhưng method sai |

</details>

---

## 📊 ĐÁNH GIÁ

| Số câu đúng | Đánh giá |
|-------------|----------|
| 18-20 | ⭐⭐⭐ Xuất sắc! Sẵn sàng cho session tiếp theo |
| 14-17 | ⭐⭐ Tốt! Ôn lại một số phần chưa chắc |
| 10-13 | ⭐ Cần ôn lại theory và chạy lại các demo |
| < 10 | Đọc lại `00-theory-summary.md` và thực hành thêm |

---

**Chúc bạn làm bài tốt!** 🚀
