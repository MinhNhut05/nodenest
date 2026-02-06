# Quiz - Session 2.1.3: Request Body Parsing

Trả lời các câu hỏi sau để kiểm tra kiến thức.

---

## Câu 1: Khi nào cần đọc request body?

A. GET request
B. DELETE request
C. POST request
D. HEAD request

<details>
<summary>Đáp án</summary>

**C. POST request**

POST, PUT, PATCH mới có body. GET, DELETE, HEAD thường không có body.

</details>

---

## Câu 2: `req.headers['content-type']` hay `req.headers['Content-Type']`?

A. `req.headers['Content-Type']` - giữ nguyên như client gửi
B. `req.headers['content-type']` - Node.js tự động lowercase

<details>
<summary>Đáp án</summary>

**B. `req.headers['content-type']`**

Node.js tự động convert tất cả header names thành lowercase.

</details>

---

## Câu 3: Tại sao body được gửi theo dạng stream (chunks)?

A. Để code phức tạp hơn
B. Để tiết kiệm memory, handle được body lớn
C. Vì HTTP bắt buộc
D. Để chạy nhanh hơn

<details>
<summary>Đáp án</summary>

**B. Để tiết kiệm memory, handle được body lớn**

Stream cho phép xử lý từng phần, không cần load toàn bộ vào RAM.

</details>

---

## Câu 4: Đoạn code này thiếu gì?

```javascript
req.on('data', (chunk) => {
  chunks.push(chunk);
});

const body = Buffer.concat(chunks).toString();
```

A. Thiếu `req.on('error')`
B. Thiếu `req.on('end')` - phải đợi nhận hết mới concat
C. Không thiếu gì
D. Thiếu `req.on('close')`

<details>
<summary>Đáp án</summary>

**B. Thiếu `req.on('end')`**

Phải đặt `Buffer.concat()` trong callback của `req.on('end')`, vì cần đợi nhận hết chunks.

```javascript
req.on('data', (chunk) => chunks.push(chunk));
req.on('end', () => {
  const body = Buffer.concat(chunks).toString();
});
```

</details>

---

## Câu 5: Parse URL-encoded body, giá trị `age` có type gì?

```javascript
const body = 'name=Leminho&age=25';
const params = new URLSearchParams(body);
const age = params.get('age');
```

A. number (25)
B. string ('25')
C. undefined
D. null

<details>
<summary>Đáp án</summary>

**B. string ('25')**

URL-encoded luôn trả về string. Cần `parseInt(age, 10)` để convert sang number.

</details>

---

## Câu 6: JSON.parse() fail sẽ xảy ra gì?

```javascript
const data = JSON.parse('{invalid json}');
```

A. Trả về null
B. Trả về undefined
C. Throw SyntaxError
D. Trả về empty object {}

<details>
<summary>Đáp án</summary>

**C. Throw SyntaxError**

Cần dùng try-catch để handle:

```javascript
try {
  const data = JSON.parse(body);
} catch (error) {
  // Handle error
}
```

</details>

---

## Câu 7: HTTP status code nào khi validation fail?

A. 200 OK
B. 400 Bad Request
C. 404 Not Found
D. 500 Internal Server Error

<details>
<summary>Đáp án</summary>

**B. 400 Bad Request**

- 400: Client gửi data sai
- 415: Wrong Content-Type
- 404: URL không tồn tại
- 500: Server error

</details>

---

## Điểm số

| Số câu đúng | Đánh giá |
|-------------|----------|
| 7/7 | Xuất sắc! |
| 5-6/7 | Tốt |
| 3-4/7 | Cần xem lại |
| 0-2/7 | Đọc lại lý thuyết |
