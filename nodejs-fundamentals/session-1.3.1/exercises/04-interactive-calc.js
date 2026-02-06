/**
 * BÀI 4: Interactive Calculator
 *
 * Máy tính tương tác dùng readline
 * Commands: add <a> <b>, sub <a> <b>, mul <a> <b>, div <a> <b>
 * Type 'exit' to quit
 */

import readline from 'readline';

// ============================================
// BƯỚC 1: TẠO READLINE INTERFACE
// ============================================

// readline.createInterface() tạo "cầu nối" giữa stdin/stdout
const rl = readline.createInterface({
  input: process.stdin,   // Đọc từ keyboard
  output: process.stdout, // Ghi ra terminal
});

// ============================================
// BƯỚC 2: HÀM TÍNH TOÁN
// ============================================

/**
 * calculate - Thực hiện phép tính
 *
 * @param {string} operation - Phép toán (add, sub, mul, div)
 * @param {number} a - Số thứ nhất
 * @param {number} b - Số thứ hai
 * @returns {number|null} - Kết quả hoặc null nếu lỗi
 */
function calculate(operation, a, b) {
  switch (operation) {
    case 'add':
      return a + b;

    case 'sub':
      return a - b;

    case 'mul':
      return a * b;

    case 'div':
      // Kiểm tra chia cho 0
      if (b === 0) {
        console.log('❌ Error: Cannot divide by zero!');
        return null;
      }
      return a / b;

    default:
      console.log(`❌ Unknown operation: ${operation}`);
      console.log('   Available: add, sub, mul, div');
      return null;
  }
}

// ============================================
// BƯỚC 3: HÀM XỬ LÝ INPUT
// ============================================

/**
 * processInput - Xử lý input từ user
 *
 * @param {string} input - Input string (VD: "add 10 5")
 * @returns {string|null} - 'exit' để thoát, null nếu lỗi, hoặc tiếp tục
 */
function processInput(input) {
  // Trim để bỏ khoảng trắng thừa
  input = input.trim();

  // Bỏ qua input rỗng
  if (input === '') {
    return null;
  }

  // ===== BƯỚC 1: SPLIT INPUT =====
  // "add 10 5" → ['add', '10', '5']
  const parts = input.split(' ');
  const operation = parts[0];

  // ===== BƯỚC 2: CHECK EXIT =====
  if (operation === 'exit') {
    console.log('\n👋 Goodbye!\n');
    return 'exit';
  }

  // ===== BƯỚC 3: VALIDATE CÚ PHÁP =====
  // Cần đủ 3 phần: operation a b
  if (parts.length < 3) {
    console.log('❌ Invalid syntax!');
    console.log('   Example: add 10 5\n');
    return null;
  }

  // ===== BƯỚC 4: PARSE STRING → NUMBER =====
  // parseFloat() chuyển string thành số
  const a = parseFloat(parts[1]);
  const b = parseFloat(parts[2]);

  // ===== BƯỚC 5: VALIDATE LÀ SỐ =====
  // isNaN() kiểm tra có phải số không
  // isNaN('hello') → true (không phải số)
  // isNaN(10) → false (là số)
  if (isNaN(a) || isNaN(b)) {
    console.log('❌ Invalid numbers!');
    console.log(`   You entered: a="${parts[1]}", b="${parts[2]}"\n`);
    return null;
  }

  // ===== BƯỚC 6: TÍNH TOÁN =====
  const result = calculate(operation, a, b);

  // Nếu có kết quả (không null), in ra
  if (result !== null) {
    // Tìm ký hiệu phép toán
    const symbols = {
      add: '+',
      sub: '-',
      mul: '*',
      div: '/',
    };
    const symbol = symbols[operation] || '?';

    console.log(`\n✅ ${a} ${symbol} ${b} = ${result}\n`);
  }

  return null;  // Tiếp tục loop
}

// ============================================
// BƯỚC 4: MAIN LOOP
// ============================================

/**
 * startCalculator - Khởi động calculator
 */
function startCalculator() {
  // In welcome message
  console.log('\n=== Interactive Calculator ===');
  console.log('Commands: add <a> <b>, sub <a> <b>, mul <a> <b>, div <a> <b>');
  console.log("Type 'exit' to quit\n");

  // Hàm hỏi user (recursive)
  function askQuestion() {
    // rl.question(prompt, callback)
    // - In prompt ra màn hình
    // - Đợi user nhập và bấm Enter
    // - Gọi callback với câu trả lời
    rl.question('> ', (input) => {
      // Xử lý input
      const signal = processInput(input);

      // Nếu user gõ 'exit'
      if (signal === 'exit') {
        rl.close();  // Đóng readline
        return;      // Thoát hàm
      }

      // Nếu không, hỏi tiếp (recursive call)
      askQuestion();
    });
  }

  // Bắt đầu vòng lặp
  askQuestion();
}

// ============================================
// BƯỚC 5: CHẠY CHƯƠNG TRÌNH
// ============================================

startCalculator();

// ============================================
// TEST CASES
// ============================================
/*

$ node 04-interactive-calc.js

=== Interactive Calculator ===
Commands: add <a> <b>, sub <a> <b>, mul <a> <b>, div <a> <b>
Type 'exit' to quit

> add 10 5
✅ 10 + 5 = 15

> sub 20 8
✅ 20 - 8 = 12

> mul 3.5 2
✅ 3.5 * 2 = 7

> div 10 0
❌ Error: Cannot divide by zero!

> div 20 4
✅ 20 / 4 = 5

> add hello world
❌ Invalid numbers!
   You entered: a="hello", b="world"

> add 5
❌ Invalid syntax!
   Example: add 10 5

> xyz 1 2
❌ Unknown operation: xyz
   Available: add, sub, mul, div

> exit
👋 Goodbye!

*/
