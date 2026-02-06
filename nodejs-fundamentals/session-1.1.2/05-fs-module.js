/**
 * SESSION 1.1.2 - BONUS: fs Module - 3 cách đọc/ghi file
 */

const fs = require('fs');
const path = require('path');

const testFile = path.join(__dirname, 'demo.txt');

// ============================================
// 1. SYNCHRONOUS (Blocking) - fs.readFileSync / fs.writeFileSync
// ============================================

console.log('=== 1. SYNCHRONOUS (Blocking) ===\n');

// Ghi file - chương trình DỪNG LẠI chờ ghi xong
fs.writeFileSync(testFile, 'Hello từ Sync!\n');
console.log('Ghi xong (sync)');

// Đọc file - chương trình DỪNG LẠI chờ đọc xong
const dataSync = fs.readFileSync(testFile, 'utf-8');
console.log('Đọc được:', dataSync);

/*
  Ưu điểm: Code đơn giản, dễ hiểu
  Nhược điểm: BLOCKING - không dùng trong production server!

  Khi nào dùng:
  - Scripts chạy 1 lần
  - Đọc config lúc app khởi động
  - CLI tools
*/

// ============================================
// 2. CALLBACK-BASED (Non-blocking) - fs.readFile / fs.writeFile
// ============================================

console.log('\n=== 2. CALLBACK-BASED (Non-blocking) ===\n');

console.log('A. Bắt đầu ghi file...');

fs.writeFile(testFile, 'Hello từ Callback!\n', (err) => {
    if (err) {
        console.log('Lỗi ghi:', err);
        return;
    }
    console.log('C. Ghi xong! Bắt đầu đọc...');

    // Đọc file SAU KHI ghi xong (nested callback)
    fs.readFile(testFile, 'utf-8', (err, data) => {
        if (err) {
            console.log('Lỗi đọc:', err);
            return;
        }
        console.log('D. Đọc được:', data);
    });
});

console.log('B. Code này chạy NGAY, không chờ ghi!');

/*
  OUTPUT:
  A. Bắt đầu ghi file...
  B. Code này chạy NGAY, không chờ ghi!
  C. Ghi xong! Bắt đầu đọc...
  D. Đọc được: Hello từ Callback!

  Ưu điểm: Non-blocking
  Nhược điểm: Callback Hell nếu nhiều operations

  Callback Hell:
  fs.readFile('a.txt', (err, a) => {
      fs.readFile('b.txt', (err, b) => {
          fs.readFile('c.txt', (err, c) => {
              fs.readFile('d.txt', (err, d) => {
                  // Pyramid of doom! 😱
              });
          });
      });
  });
*/

// ============================================
// 3. PROMISE-BASED (Modern) - fs.promises
// ============================================

// Chờ callback ở trên chạy xong
setTimeout(async () => {
    console.log('\n=== 3. PROMISE-BASED với async/await ===\n');

    const fsPromises = require('fs').promises;
    // Hoặc: const fsPromises = require('fs/promises');

    try {
        // Ghi file
        await fsPromises.writeFile(testFile, 'Hello từ Promise!\n');
        console.log('Ghi xong!');

        // Đọc file
        const data = await fsPromises.readFile(testFile, 'utf-8');
        console.log('Đọc được:', data);

        // Thêm nội dung (append)
        await fsPromises.appendFile(testFile, 'Dòng thứ 2\n');
        console.log('Append xong!');

        // Đọc lại
        const dataFinal = await fsPromises.readFile(testFile, 'utf-8');
        console.log('Nội dung cuối:\n', dataFinal);

    } catch (err) {
        console.log('Lỗi:', err.message);
    }

    /*
      Ưu điểm:
      - Non-blocking
      - Code sạch, dễ đọc như sync
      - Dễ handle errors với try/catch
      - Không bị callback hell

      Nhược điểm:
      - Cần hiểu async/await

      → ĐÂY LÀ CÁCH ĐƯỢC KHUYẾN KHÍCH DÙNG!
    */

    console.log('\n=== SO SÁNH 3 CÁCH ===');
    console.log(`
┌─────────────────────────────────────────────────────────────────┐
│  Cách          │ Blocking? │ Code style    │ Dùng khi           │
├─────────────────────────────────────────────────────────────────┤
│  Sync          │ CÓ        │ Đơn giản      │ Scripts, startup   │
│  Callback      │ KHÔNG     │ Nested        │ Legacy code        │
│  Promise/await │ KHÔNG     │ Sạch, dễ đọc  │ Production ✅      │
└─────────────────────────────────────────────────────────────────┘
    `);

    // Cleanup
    fs.unlinkSync(testFile);

}, 500);
