/**
 * SESSION 1.1.2 - PART 1: Call Stack
 *
 * Call Stack là nơi JavaScript thực thi code SYNCHRONOUS
 * Node.js là SINGLE-THREADED → chỉ có 1 Call Stack
 */

// ============================================
// 1. CALL STACK LÀ GÌ?
// ============================================

/*
Call Stack hoạt động theo nguyên tắc LIFO (Last In, First Out)
- Khi gọi function → PUSH vào stack
- Khi function return → POP khỏi stack

Ví dụ minh họa:
*/

function first() {
  console.log("1. First bắt đầu");
  second();
  console.log("4. First kết thúc");
}

function second() {
  console.log("2. Second bắt đầu");
  third();
  console.log("3. Second kết thúc");
}

function third() {
  console.log("   Third chạy (đỉnh stack)");
}

console.log("=== CALL STACK DEMO ===\n");
first();

/*
CALL STACK diễn biến:

1. first() được gọi      → Stack: [first]
2. second() được gọi     → Stack: [first, second]
3. third() được gọi      → Stack: [first, second, third]
4. third() return        → Stack: [first, second]
5. second() return       → Stack: [first]
6. first() return        → Stack: []

OUTPUT:
1. First bắt đầu
2. Second bắt đầu
   Third chạy (đỉnh stack)
3. Second kết thúc
4. First kết thúc
*/

// ============================================
// 2. STACK OVERFLOW
// ============================================

console.log("\n=== STACK OVERFLOW ===");

function recursive() {
  recursive(); // Gọi chính nó vô hạn
}

// Uncomment để thấy lỗi:
// recursive();
// → RangeError: Maximum call stack size exceeded

console.log("Stack có giới hạn! Recursive không có base case → Stack Overflow");

// ============================================
// 3. SINGLE-THREADED NGHĨA LÀ GÌ?
// ============================================

console.log("\n=== SINGLE-THREADED ===");

/*
- JavaScript chỉ có 1 thread chính (Main Thread)
- Chỉ có 1 Call Stack
- Chỉ làm được 1 việc tại 1 thời điểm

VẤN ĐỀ: Nếu 1 task chạy lâu (đọc file lớn, gọi API) → BLOCK toàn bộ app!

GIẢI PHÁP: Event Loop + Callback Queue (xem file tiếp theo)
*/

// Ví dụ blocking:
function heavyTask() {
  const start = Date.now();
  // Giả lập task nặng (3 giây)
  while (Date.now() - start < 3000) {
    // Blocking loop
  }
  console.log("Heavy task done!");
}

console.log("Nếu chạy heavyTask(), UI sẽ đứng 3 giây!");
console.log("(Không chạy ở đây để demo tiếp)");

// ============================================
// TÓM TẮT
// ============================================

console.log("\n=== TÓM TẮT ===");
console.log(`
• Call Stack = nơi code synchronous thực thi
• LIFO: Last In, First Out
• Single-threaded = 1 stack = 1 việc tại 1 thời điểm
• Blocking code = giữ stack = app đứng yên
`);
