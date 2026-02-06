/**
 * BÀI TẬP 1: Path Parser CLI
 *
 * Yêu cầu: Tạo tool phân tích path và hiển thị thông tin
 *
 * Cách chạy: node exercises/01-path-parser.js <path>
 * Ví dụ:    node exercises/01-path-parser.js /home/user/project/index.js
 *
 * Expected output:
 * ================
 * === Path Analysis ===
 * Input:      /home/user/project/index.js
 * ---
 * dirname:    /home/user/project
 * basename:   index.js
 * name:       index
 * extension:  .js
 * isAbsolute: true
 * =====================
 */

import path, { isAbsolute } from "path";

async function main() {
  // TODO 1: Lấy path từ process.argv[2]
  const inputPath = process.argv[2]; // ← Sửa dòng này

  // TODO 2: Kiểm tra nếu không có path thì báo lỗi
  // Gợi ý: if (!inputPath) { console.error(...); process.exit(1); }
  if (!inputPath) {
    console.error("loi");
    process.exit(1);
  }
  console.log("=== Path Analysis ===");
  console.log("Input:     ", inputPath);
  console.log("---");

  // TODO 3: Dùng các methods của path module để lấy thông tin
  // Gợi ý:
  // - path.dirname(inputPath)
  // - path.basename(inputPath)
  // - path.basename(inputPath, path.extname(inputPath))  ← name không có ext
  // - path.extname(inputPath)
  // - path.isAbsolute(inputPath)

  console.log("dirname:   ", path.dirname(inputPath)); // ← Sửa
  console.log("basename:  ", path.basename(inputPath)); // ← Sửa
  console.log("name:      ", path.basename(inputPath, path.extname(inputPath))); // ← Sửa
  console.log("extension: ", path.extname(inputPath)); // ← Sửa
  console.log("isAbsolute:", isAbsolute(inputPath)); // ← Sửa

  console.log("=====================");
}

main();
