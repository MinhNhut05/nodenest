# 🛒 BÀI TẬP: PRODUCTS API

## Mục tiêu
Xây dựng REST API quản lý sản phẩm từ đầu, áp dụng kiến thức đã học trong Session 2.1.1.

---

## Yêu cầu

### API Endpoints cần tạo:

| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/` | Trang chủ (HTML) |
| GET | `/api/products` | Lấy tất cả sản phẩm |
| GET | `/api/products/:id` | Lấy 1 sản phẩm theo ID |
| POST | `/api/products` | Tạo sản phẩm mới |
| PUT | `/api/products/:id` | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Xóa sản phẩm |
| GET | `/api/products/category/:category` | Lấy sản phẩm theo category |

### Bonus (nếu muốn thử thách):
| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/api/products?minPrice=100&maxPrice=500` | Lọc theo giá |
| GET | `/api/products?search=phone` | Tìm kiếm theo tên |

---

## Cấu trúc project

```
exercises/products-api/
├── index.js              ← Entry point (TỰ VIẾT)
├── router.js             ← Router class (ĐÃ CHO SẴN)
├── routes/
│   ├── index.js          ← Đăng ký routes (TỰ VIẾT)
│   └── products.js       ← Product routes (TỰ VIẾT)
├── handlers/
│   └── products.js       ← Product handlers (TỰ VIẾT)
├── data/
│   └── db.js             ← Fake database (ĐÃ CHO SẴN)
└── utils/
    └── helpers.js        ← Helper functions (ĐÃ CHO SẴN)
```

---

## Hướng dẫn làm bài

### Bước 1: Đọc hiểu các file đã cho sẵn
- `router.js` - Router class
- `data/db.js` - Fake database
- `utils/helpers.js` - Helper functions

### Bước 2: Viết file `handlers/products.js`
Tạo các handler functions:
- `getProducts(req, res)`
- `getProductById(req, res)`
- `createProduct(req, res)`
- `updateProduct(req, res)`
- `deleteProduct(req, res)`
- `getProductsByCategory(req, res)`

### Bước 3: Viết file `routes/products.js`
Đăng ký routes cho products

### Bước 4: Viết file `routes/index.js`
Gom tất cả routes lại

### Bước 5: Viết file `index.js`
Entry point - khởi động server

### Bước 6: Test với Postman

---

## Dữ liệu mẫu (trong db.js)

```javascript
const products = [
  { id: 1, name: "iPhone 15", price: 999, category: "phone", stock: 50 },
  { id: 2, name: "Samsung Galaxy S24", price: 899, category: "phone", stock: 30 },
  { id: 3, name: "MacBook Pro", price: 1999, category: "laptop", stock: 20 },
  { id: 4, name: "Dell XPS 15", price: 1599, category: "laptop", stock: 15 },
  { id: 5, name: "AirPods Pro", price: 249, category: "accessory", stock: 100 },
];
```

---

## Gợi ý

### Handler `getProducts`:
```javascript
export function getProducts(req, res) {
  // 1. Lấy query params (nếu có): minPrice, maxPrice, search
  // 2. Lọc products theo điều kiện
  // 3. Trả về kết quả
}
```

### Handler `getProductsByCategory`:
```javascript
export function getProductsByCategory(req, res) {
  // 1. Lấy category từ req.params
  // 2. Lọc products theo category
  // 3. Trả về kết quả (hoặc 404 nếu không có)
}
```

### Route cho category:
```javascript
router.get('/api/products/category/:category', getProductsByCategory);
```

---

## Cách chạy

```bash
cd exercises/products-api
node index.js
```

---

## Test với Postman

### GET tất cả products
```
GET http://localhost:3005/api/products
```

### GET product theo ID
```
GET http://localhost:3005/api/products/1
```

### POST tạo product mới
```
POST http://localhost:3005/api/products
Body (JSON):
{
  "name": "iPad Pro",
  "price": 1099,
  "category": "tablet",
  "stock": 25
}
```

### GET products theo category
```
GET http://localhost:3005/api/products/category/phone
```

### GET products với filter (Bonus)
```
GET http://localhost:3005/api/products?minPrice=500&maxPrice=1000
```

---

## Checklist

- [ ] GET `/api/products` - Lấy tất cả
- [ ] GET `/api/products/:id` - Lấy 1 product
- [ ] POST `/api/products` - Tạo mới
- [ ] PUT `/api/products/:id` - Cập nhật
- [ ] DELETE `/api/products/:id` - Xóa
- [ ] GET `/api/products/category/:category` - Lọc theo category
- [ ] (Bonus) Filter theo price
- [ ] (Bonus) Search theo name

---

**Chúc bạn làm bài tốt!** 🚀

Khi xong hoặc gặp khó khăn, hãy hỏi để được hướng dẫn.
