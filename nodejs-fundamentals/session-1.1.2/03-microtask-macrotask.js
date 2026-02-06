/**
 * SESSION 1.1.2 - PART 3: Microtask vs Macrotask
 *
 * Không phải tất cả async đều như nhau!
 * Có 2 loại queue với độ ưu tiên khác nhau.
 */

console.log('=== MICROTASK vs MACROTASK ===\n');

// ============================================
// 1. HAI LOẠI TASK
// ============================================

/*
MACROTASK (Task Queue):
- setTimeout
- setInterval
- setImmediate (Node.js)
- I/O operations (fs.readFile, http request)

MICROTASK (Microtask Queue):
- Promise.then/catch/finally
- process.nextTick() (Node.js)
- queueMicrotask()

ĐỘ ƯU TIÊN:
┌────────────────────────────────────────────────────┐
│  1. Sync code (Call Stack)                         │
│  2. process.nextTick() queue     ← Cao nhất        │
│  3. Promise microtask queue                        │
│  4. Macrotask queue (setTimeout...)  ← Thấp nhất   │
└────────────────────────────────────────────────────┘

SAU MỖI MACROTASK, tất cả MICROTASKS được xử lý hết!
*/

// ============================================
// 2. VÍ DỤ SO SÁNH
// ============================================

console.log('1. Sync');

setTimeout(() => {
    console.log('5. setTimeout (macrotask)');
}, 0);

Promise.resolve().then(() => {
    console.log('3. Promise (microtask)');
});

process.nextTick(() => {
    console.log('2. nextTick (microtask - ưu tiên cao nhất)');
});

console.log('4. Sync end');

/*
OUTPUT:
1. Sync
4. Sync end
2. nextTick (microtask - ưu tiên cao nhất)
3. Promise (microtask)
5. setTimeout (macrotask)

THỨ TỰ:
1. Sync chạy trước (1, 4)
2. nextTick queue (2) - ưu tiên cao hơn Promise
3. Promise microtask (3)
4. setTimeout macrotask (5)
*/

// ============================================
// 3. VÍ DỤ PHỨC TẠP HƠN
// ============================================

setTimeout(() => {
    console.log('\n--- Ví dụ phức tạp ---\n');

    console.log('A: Sync');

    setTimeout(() => console.log('F: setTimeout 1'), 0);
    setTimeout(() => console.log('G: setTimeout 2'), 0);

    Promise.resolve()
        .then(() => console.log('C: Promise 1'))
        .then(() => console.log('D: Promise 2'));

    process.nextTick(() => console.log('B: nextTick'));

    Promise.resolve().then(() => console.log('E: Promise 3'));

    console.log('H: Sync end');

    /*
    OUTPUT:
    A: Sync
    H: Sync end
    B: nextTick
    C: Promise 1
    E: Promise 3
    D: Promise 2
    F: setTimeout 1
    G: setTimeout 2

    GIẢI THÍCH:
    - A, H: Sync
    - B: nextTick (ưu tiên cao nhất trong microtask)
    - C, E: Promise.then cùng level
    - D: .then chain của C
    - F, G: setTimeout (macrotask, chạy sau tất cả microtask)
    */
}, 100);

// ============================================
// 4. THỰC TẾ: KHI NÀO DÙNG?
// ============================================

setTimeout(() => {
    console.log('\n=== KHI NÀO DÙNG? ===');
    console.log(`
process.nextTick():
  - Xử lý errors ngay sau sync code
  - Cho phép user set event handlers trước khi emit
  - ⚠️ Cẩn thận: quá nhiều nextTick có thể starve I/O

Promise:
  - Async operations thông thường
  - Chain nhiều operations

setTimeout(..., 0):
  - Defer execution sang tick tiếp theo
  - Cho phép I/O operations chạy

setImmediate:
  - Giống setTimeout(0) nhưng cho I/O callbacks
  - Thường dùng trong I/O cycle
    `);
}, 200);
