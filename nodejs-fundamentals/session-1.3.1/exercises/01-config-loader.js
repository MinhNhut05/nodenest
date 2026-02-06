/**
 * BÀI 1: CONFIG LOADER
 * Đọc config từ environment variables
 *
 * Chạy: NODE_ENV=production PORT=8080 DB_HOST=localhost node 01-config-loader.js
 */

// ============================================
// BƯỚC 1: ĐỌC BIẾN MÔI TRƯỜNG
// ============================================

// process.env là object chứa TẤT CẢ biến môi trường
// Ví dụ: { USER: 'leminho', HOME: '/home/leminho', NODE_ENV: 'production', ... }

// Cú pháp: process.env.TÊN_BIẾN
// Nếu biến không tồn tại → trả về undefined

// ===== ĐỌC NODE_ENV =====
// process.env.NODE_ENV có thể là:
// - "production" (nếu set NODE_ENV=production)
// - "development" (nếu set NODE_ENV=development)
// - undefined (nếu không set)

// Dùng || để set giá trị mặc định
// Cách đọc: "Lấy NODE_ENV, nếu không có thì dùng 'development'"
const env = process.env.NODE_ENV || 'development';
//          ^                    ^
//          |                    └─ Giá trị mặc định nếu undefined
//          └─ Đọc biến NODE_ENV

// ===== ĐỌC PORT =====
// LƯU Ý: process.env LUÔN trả về STRING, không phải number!
// PORT=8080 → process.env.PORT = "8080" (string)

// Nếu cần number, dùng parseInt() hoặc Number()
const port = process.env.PORT || '3000';
//           ^                   ^
//           |                   └─ Mặc định là "3000" (string)
//           └─ Có thể là "8080" nếu set PORT=8080

// ===== ĐỌC DB_HOST =====
const dbHost = process.env.DB_HOST || 'localhost';
//             ^                      ^
//             |                      └─ Mặc định là 'localhost'
//             └─ Đọc biến DB_HOST

// ===== ĐỌC DEBUG =====
// DEBUG có thể là: "true", "false", hoặc undefined
// Ta muốn chuyển thành boolean true/false

// Cách 1: So sánh với string "true"
const debug = process.env.DEBUG === 'true';
//            ^                  ^
//            |                  └─ So sánh với STRING "true"
//            └─ Có thể là "true", "false", hoặc undefined

// Kết quả:
// - DEBUG=true   → process.env.DEBUG = "true"  → "true" === "true" → true
// - DEBUG=false  → process.env.DEBUG = "false" → "false" === "true" → false
// - Không set    → process.env.DEBUG = undefined → undefined === "true" → false

// ============================================
// BƯỚC 2: TẠO CONFIG OBJECT
// ============================================

// Gom tất cả config vào 1 object để dễ quản lý
const config = {
  env: env,         // Có thể viết tắt: env (ES6 shorthand)
  port: port,       // Có thể viết tắt: port
  dbHost: dbHost,   // Có thể viết tắt: dbHost
  debug: debug,     // Có thể viết tắt: debug
};

// Viết tắt ES6 (tương đương):
// const config = { env, port, dbHost, debug };

// ============================================
// BƯỚC 3: IN RA CONFIG
// ============================================

console.log('=== App Configuration ===');
console.log('Environment:', config.env);
console.log('Port:', config.port);
console.log('Database Host:', config.dbHost);
console.log('Debug Mode:', config.debug);

// ============================================
// BƯỚC 4: THÔNG BÁO THÀNH CÔNG
// ============================================

console.log('\n✓ Config loaded successfully!');

// ============================================
// BONUS: IN TOÀN BỘ CONFIG OBJECT
// ============================================

console.log('\n--- Full config object ---');
console.log(config);

// ============================================
// THỬ CHẠY:
// ============================================
// 1. Không set biến (dùng default):
//    node 01-config-loader.js
//
// 2. Set một số biến:
//    PORT=8080 node 01-config-loader.js
//
// 3. Set tất cả biến:
//    NODE_ENV=production PORT=8080 DB_HOST=mydb.com DEBUG=true node 01-config-loader.js
