/**
 * BÀI TẬP 2: Interactive Calculator CLI
 *
 * Tạo calculator tương tác:
 * - Nhận input từ user qua stdin
 * - Hỗ trợ: add, sub, mul, div
 * - Gõ 'exit' hoặc Ctrl+C để thoát
 */

import readline from "readline";

// ============================================
// SETUP READLINE
// ============================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ============================================
// TODO 1: Hiển thị welcome message
// ============================================
// In ra:
// "=== Interactive Calculator ==="
// "Commands: add <a> <b>, sub <a> <b>, mul <a> <b>, div <a> <b>"
// "Type 'exit' to quit"
// ""
console.log("=== Interactive Calculator ===");
console.log("Commands: add <a> <b>, sub <a> <b>, mul <a> <b>, div <a> <b>");
console.log("Type 'exit' to quit");
console.log(""); // Dòng trống
// TODO: Điền code ở đây

// ============================================
// TODO 2: Implement calculate function
// ============================================
// Input: operation (string), a (number), b (number)
// Return: result (number) hoặc throw Error nếu invalid

function calculate(operation, a, b) {
  switch (operation) {
    case "add":
      return a + b;  // RETURN thay vì console.log

    case "sub":
      return a - b;

    case "mul":
      return a * b;

    case "div":
      if (b === 0) {
        console.log("❌ Error: Cannot divide by zero!");
        return null;
      }
      return a / b;

    default:
      console.log(`❌ Unknown operation: ${operation}`);
      return null;
  }
}

// ============================================
// TODO 3: Implement processInput function
// ============================================
// Parse input string và gọi calculate
// Format: "operation a b" (vd: "add 5 3")

function processInput(input) {
  input = input.trim();
  if (input === "") {
    return null;
  }
  const parts = input.split(" ");
  const operation = parts[0];
  if (operation === "exit") {
    console.log("\n👋 Goodbye!\n");
    return "exit";
  }
  if (parts.length < 3) {
    console.log("❌ Invalid syntax!");
    console.log("   Example: add 10 5\n");
    return null;
  }
  const a = parseFloat(parts[1]);
  const b = parseFloat(parts[2]);
  if (isNaN(a) || isNaN(b)) {
    console.log("❌ Vui lòng nhập số hợp lệ!");
    console.log(`   You entered: a="${parts[1]}", b="${parts[2]}"\n`);
    return null; // Dừng lại, không tính toán
  }
  const result = calculate(operation, a, b);
  if (result !== null) {
    const symbols = {
      add: "+",
      sub: "-",
      mul: "*",
      div: "/",
    };
    const symbol = symbols[operation] || "?";

    console.log(`\n✅ ${a} ${symbol} ${b} = ${result}\n`);
  }
  return null;
}
// ============================================
// TODO 4: Main prompt loop
// ============================================
// Dùng rl.question() để hỏi user
// Xử lý input:
// - 'exit' hoặc 'quit': đóng rl và thoát
// - Khác: gọi processInput(), in kết quả, hỏi tiếp

function prompt() {
  console.log("\n=== Interactive Calculator ===");
  console.log("Commands: add <a> <b>, sub <a> <b>, mul <a> <b>, div <a> <b>");
  console.log("Type 'exit' to quit\n");

  // Hàm hỏi user (recursive)
  function askQuestion() {
    // rl.question(prompt, callback)
    // - In prompt ra màn hình
    // - Đợi user nhập và bấm Enter
    // - Gọi callback với câu trả lời
    rl.question("> ", (input) => {
      // Xử lý input
      const signal = processInput(input);

      // Nếu user gõ 'exit'
      if (signal === "exit") {
        rl.close(); // Đóng readline
        return; // Thoát hàm
      }

      // Nếu không, hỏi tiếp (recursive call)
      askQuestion();
    });
  }

  // Bắt đầu vòng lặp
  askQuestion();
}

// ============================================
// TODO 5: Handle Ctrl+C (SIGINT)
// ============================================
// Khi user bấm Ctrl+C:
// - In "Goodbye!"
// - Đóng readline
// - Exit với code 0

// TODO: Điền code ở đây
// Gợi ý: process.on('SIGINT', ...)

// ============================================
// START THE APP
// ============================================

prompt();

// ============================================
// EXPECTED OUTPUT
// ============================================
