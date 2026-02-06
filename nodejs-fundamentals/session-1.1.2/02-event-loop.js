/**
 * SESSION 1.1.2 - PART 2: Event Loop & Callback Queue
 *
 * Event Loop là cơ chế giúp Node.js xử lý async mà không block
 */

console.log('=== EVENT LOOP DEMO ===\n');

// ============================================
// 1. CƠ CHẾ HOẠT ĐỘNG
// ============================================

/*
┌─────────────────────────────────────────────────────────────┐
│                        NODE.JS                               │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────┐  │
│  │ Call Stack  │    │ Node APIs   │    │ Callback Queue  │  │
│  │             │    │ (setTimeout │    │                 │  │
│  │  [empty]  ◄─┼────┤  fs.read    │────►  [callbacks]   │  │
│  │             │    │  http, etc) │    │                 │  │
│  └─────────────┘    └─────────────┘    └─────────────────┘  │
│         ▲                                      │            │
│         │            EVENT LOOP                │            │
│         └──────────────────────────────────────┘            │
│                                                              │
│   Event Loop check: "Call Stack trống?" → Lấy callback      │
└─────────────────────────────────────────────────────────────┘

QUY TRÌNH:
1. Code sync chạy trong Call Stack
2. Async operations (setTimeout, fs.read...) được gửi đến Node APIs
3. Khi async xong → callback được đẩy vào Callback Queue
4. Event Loop check: Call Stack trống? → Lấy callback từ Queue → Push vào Stack
*/

// ============================================
// 2. VÍ DỤ KINH ĐIỂN
// ============================================

console.log('1. Bắt đầu (sync)');

setTimeout(() => {
    console.log('2. Timeout callback (async)');
}, 0);  // 0ms nhưng vẫn async!

console.log('3. Kết thúc (sync)');

/*
OUTPUT:
1. Bắt đầu (sync)
3. Kết thúc (sync)
2. Timeout callback (async)

TẠI SAO?
- console.log('1') → chạy ngay trong Call Stack
- setTimeout → gửi đến Node APIs, callback vào Queue
- console.log('3') → chạy ngay trong Call Stack
- Call Stack trống → Event Loop lấy callback → chạy console.log('2')
*/

// ============================================
// 3. DEMO CHI TIẾT HƠN
// ============================================

console.log('\n--- Demo chi tiết ---\n');

console.log('A: Sync 1');

setTimeout(() => {
    console.log('B: Timeout 1 (0ms)');
}, 0);

setTimeout(() => {
    console.log('C: Timeout 2 (100ms)');
}, 100);

setTimeout(() => {
    console.log('D: Timeout 3 (0ms)');
}, 0);

console.log('E: Sync 2');

/*
OUTPUT:
A: Sync 1
E: Sync 2
B: Timeout 1 (0ms)
D: Timeout 3 (0ms)
C: Timeout 2 (100ms)

GIẢI THÍCH:
- A, E: Sync → chạy ngay
- B, D: 0ms nhưng vẫn vào queue, chạy sau sync
- C: 100ms → chạy sau B, D
*/

// ============================================
// 4. SETINTERVAL
// ============================================

console.log('\n--- setInterval demo ---');
console.log('(Ctrl+C để dừng nếu cần)\n');

let count = 0;
const intervalId = setInterval(() => {
    count++;
    console.log(`Interval tick: ${count}`);

    if (count >= 3) {
        clearInterval(intervalId);
        console.log('Interval cleared!\n');
    }
}, 500);

// ============================================
// TÓM TẮT
// ============================================

setTimeout(() => {
    console.log('=== TÓM TẮT ===');
    console.log(`
• Event Loop = vòng lặp kiểm tra Call Stack và Queue
• Khi Stack trống → lấy callback từ Queue
• setTimeout(..., 0) KHÔNG chạy ngay → vẫn vào Queue
• Đây là lý do Node.js xử lý được nhiều requests cùng lúc
    `);
}, 2000);
