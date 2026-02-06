/**
 * BÀI TẬP SESSION 1.1.4 - npm/pnpm
 *
 * Bài tập này thực hành:
 * 1. Cài đặt packages
 * 2. Sử dụng packages trong code
 * 3. Tạo scripts trong package.json
 */

// ============================================
// HƯỚNG DẪN
// ============================================

/*
BƯỚC 1: Cài đặt packages
Chạy trong terminal (ở folder nodejs-fundamentals):

  pnpm add lodash dayjs chalk@4
  pnpm add -D nodemon

Giải thích:
  - lodash: Utility functions (map, filter, chunk...)
  - dayjs: Xử lý date/time (nhẹ hơn moment.js)
  - chalk@4: In màu trong terminal (v4 cho CommonJS)
  - nodemon: Tự restart khi file thay đổi (dev tool)

BƯỚC 2: Hoàn thành code bên dưới

BƯỚC 3: Chạy thử
  node session-1.1.4/exercise.js
*/

// ============================================
// TODO 1: Import các packages đã cài
// Dùng require vì file này là CommonJS
// ============================================

// const _ = require('lodash');
// const dayjs = require('dayjs');
// const chalk = require('chalk');
const _ = require("lodash");
const dayjs = require("dayjs");
const chalk = require("chalk");
// VIẾT CODE Ở ĐÂY

console.log("=== BÀI TẬP NPM/PNPM ===\n");

// ============================================
// TODO 2: Sử dụng lodash
// ============================================

console.log("--- Lodash ---");

// TODO 2.1: Dùng _.chunk() để chia array thành chunks
// Input: [1, 2, 3, 4, 5, 6, 7, 8]
// Chunk size: 3
// Expected: [[1, 2, 3], [4, 5, 6], [7, 8]]
const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
const chunked = _.chunk(numbers, 3);
console.log("Chunked:", chunked);

// TODO 2.2: Dùng _.uniq() để loại bỏ duplicates
// Input: [1, 2, 2, 3, 3, 3, 4]
// Expected: [1, 2, 3, 4]
const duplicates = [1, 2, 2, 3, 3, 3, 4];
const unique = _.uniq(duplicates);
console.log("Unique:", unique);

// TODO 2.3: Dùng _.groupBy() để nhóm theo property
// Input: [{name: 'A', type: 'fruit'}, {name: 'B', type: 'veggie'}, {name: 'C', type: 'fruit'}]
// Group by: 'type'
const items = [
  { name: "Apple", type: "fruit" },
  { name: "Carrot", type: "veggie" },
  { name: "Banana", type: "fruit" },
  { name: "Broccoli", type: "veggie" },
];
const grouped = _.groupBy(items, "type");
console.log("Grouped:", grouped);

// ============================================
// TODO 3: Sử dụng dayjs
// ============================================

console.log("\n--- Day.js ---");

// TODO 3.1: In ra ngày hiện tại theo format 'DD/MM/YYYY'
// Expected: "24/01/2026" (hoặc ngày hiện tại)
const today = dayjs().format("DD/MM/YYYY");
console.log("Today:", today);

// TODO 3.2: In ra ngày 7 ngày sau
// Dùng: dayjs().add(7, 'day').format('DD/MM/YYYY')
const nextWeek = dayjs().add(7, "day").format("DD/MM/YYYY");
console.log("Next week:", nextWeek);

// TODO 3.3: Tính số ngày từ đầu năm đến hôm nay
// Dùng: dayjs().diff(dayjs('2026-01-01'), 'day')
const daysFromNewYear = dayjs().diff(dayjs("2026-01-01"), "day");
console.log("Days from New Year:", daysFromNewYear);

// ============================================
// TODO 4: Sử dụng chalk (in màu)
// ============================================

console.log("\n--- Chalk ---");

// TODO 4.1: In text màu xanh lá
console.log(chalk.green("Success message"));

// TODO 4.2: In text màu đỏ, bold
console.log(chalk.red.bold("Error message"));

// TODO 4.3: In text với background màu vàng
console.log(chalk.bgYellow.black("Warning message"));

// ============================================
// TODO 5: Tạo function sử dụng cả 3 packages
// ============================================

console.log("\n--- Combined ---");

// TODO 5: Tạo function formatReport
// Input: array of objects với date và status
// Output: In ra báo cáo đẹp với màu sắc

function formatReport(data) {
  console.log(chalk.bold("\n📊 BÁO CÁO:\n"));

  data.forEach((t) => {
    // Format date GỐC của item
    const formattedDate = dayjs(t.date).format("DD/MM/YYYY");

    // Tạo message với thông tin task
    const message = `${formattedDate} - ${t.task}`;

    // In với màu theo status
    if (t.status === "success") {
      console.log(chalk.green(`✅ ${message}`));
    } else if (t.status === "error") {
      console.log(chalk.red.bold(`❌ ${message}`));
    } else {
      console.log(chalk.yellow(`⏳ ${message}`));
    }
  });
}

const reportData = [
  { task: "Task 1", date: "2026-01-20", status: "success" },
  { task: "Task 2", date: "2026-01-21", status: "error" },
  { task: "Task 3", date: "2026-01-22", status: "pending" },
  { task: "Task 4", date: "2026-01-23", status: "success" },
];

formatReport(reportData);
