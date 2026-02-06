/**
 * SESSION 1.1.2 - PART 4: Blocking vs Non-blocking
 *
 * Blocking code là kẻ thù của Node.js performance!
 */

const fs = require('fs');
const path = require('path');

console.log('=== BLOCKING vs NON-BLOCKING ===\n');

// Tạo file test
const testFile = path.join(__dirname, 'test-file.txt');
const content = 'Hello from Node.js!\n'.repeat(1000);
fs.writeFileSync(testFile, content);

// ============================================
// 1. BLOCKING (Synchronous)
// ============================================

console.log('--- BLOCKING EXAMPLE ---');
console.log('1. Trước readFileSync');

const startSync = Date.now();
const dataSync = fs.readFileSync(testFile, 'utf-8');
const endSync = Date.now();

console.log(`2. Đọc xong: ${dataSync.length} bytes (${endSync - startSync}ms)`);
console.log('3. Sau readFileSync');
console.log('→ Code chạy TUẦN TỰ, chờ đọc xong mới tiếp\n');

/*
OUTPUT (tuần tự):
1. Trước readFileSync
2. Đọc xong: 21000 bytes
3. Sau readFileSync
*/

// ============================================
// 2. NON-BLOCKING (Asynchronous)
// ============================================

console.log('--- NON-BLOCKING EXAMPLE ---');
console.log('A. Trước readFile');

const startAsync = Date.now();
fs.readFile(testFile, 'utf-8', (err, data) => {
    const endAsync = Date.now();
    if (err) {
        console.log('Error:', err);
        return;
    }
    console.log(`C. Đọc xong: ${data.length} bytes (${endAsync - startAsync}ms)`);
});

console.log('B. Sau readFile (chạy ngay, không chờ!)');

/*
OUTPUT (không tuần tự):
A. Trước readFile
B. Sau readFile (chạy ngay, không chờ!)
C. Đọc xong: 21000 bytes

→ B chạy TRƯỚC C vì readFile là async!
*/

// ============================================
// 3. TẠI SAO BLOCKING LÀ VẤN ĐỀ?
// ============================================

setTimeout(() => {
    console.log('\n--- TẠI SAO BLOCKING LÀ VẤN ĐỀ? ---\n');

    console.log(`
Tưởng tượng Node.js server:

❌ BLOCKING:
┌─────────────────────────────────────────────────────┐
│ Request 1 ──────────────────────────────► Response  │
│            [đọc file 2s]                            │
│                                                     │
│ Request 2 ─────────────────────────────────────────►│
│            [phải CHỜ request 1 xong]                │
│                                                     │
│ Request 3 ─────────────────────────────────────────►│
│            [CHỜ request 1 + 2]                      │
└─────────────────────────────────────────────────────┘
→ 1000 users = 1000 x 2s = 2000s chờ đợi!

✅ NON-BLOCKING:
┌─────────────────────────────────────────────────────┐
│ Request 1 ──► [async read] ──────────────► Response │
│ Request 2 ──► [async read] ──────────────► Response │
│ Request 3 ──► [async read] ──────────────► Response │
└─────────────────────────────────────────────────────┘
→ 1000 users = xử lý đồng thời, ~2s cho tất cả!
    `);
}, 100);

// ============================================
// 4. QUY TẮC VÀNG
// ============================================

setTimeout(() => {
    console.log('=== QUY TẮC VÀNG ===');
    console.log(`
✅ LUÔN dùng async methods trong production:
   - fs.readFile() thay vì fs.readFileSync()
   - fs.writeFile() thay vì fs.writeFileSync()
   - Dùng async/await với fs.promises

⚠️ CHỈ dùng sync khi:
   - Scripts chạy 1 lần (CLI tools)
   - Khởi tạo app (đọc config lúc startup)
   - Testing

❌ TUYỆT ĐỐI KHÔNG:
   - Sync trong request handlers
   - Sync trong loops xử lý data
   - Sync trong production servers
    `);

    // Cleanup
    fs.unlinkSync(testFile);
}, 200);
