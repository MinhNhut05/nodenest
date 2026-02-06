/**
 * BÀI TẬP 1: File Reader CLI
 *
 * Yêu cầu: Tạo CLI tool đọc file và hiển thị nội dung
 *
 * Cách chạy: node exercises/01-file-reader.js <filepath>
 * Ví dụ:    node exercises/01-file-reader.js data/sample.txt
 *
 * Expected output:
 * ================
 * $ node exercises/01-file-reader.js data/sample.txt
 *
 * === File: data/sample.txt ===
 * Hello Leminho!
 * Day la file sample de test fs module.
 * ...
 * === End of file (5 lines, 92 bytes) ===
 *
 * $ node exercises/01-file-reader.js not-exist.txt
 * Error: File không tồn tại: not-exist.txt
 */

import { readFile } from "fs/promises";

async function main() {
  // TODO 1: Lấy filepath từ command line arguments
  // Gợi ý: process.argv là array chứa arguments
  //        process.argv[0] = "node"
  //        process.argv[1] = "path/to/script.js"
  //        process.argv[2] = argument đầu tiên của user
  const filepath = process.argv[2];

  // TODO 2: Kiểm tra nếu không có filepath thì báo lỗi và thoát
  // Gợi ý: if (!filepath) { console.error(...); process.exit(1); }
  if (!filepath) {
    console.error("Usage: node 01-file-reader.js <filepath>");
    process.exit(1);
  }
  // TODO 3: Đọc file với try/catch
  // Gợi ý: await readFile(filepath, 'utf8')
  // Nếu lỗi ENOENT → "File không tồn tại"
  // Nếu lỗi khác → hiển thị error.message
  try {
    const content = await readFile(filepath, "utf8");
    const lineCount = content.split("\n").length;
    const bytesCount = Buffer.byteLength(content);
    console.log(`\n=== File: ${filepath} ===`);
    console.log(content);
    console.log(
      `=== End of file (${lineCount} lines, ${bytesCount} bytes) ===`,
    );
    // Đọc file ở đây
    // TODO 4: Hiển thị nội dung với format:
    // === File: <filepath> ===
    // <nội dung file>
    // === End of file (<số dòng> lines, <số bytes> bytes) ===
    //
    // Gợi ý: Đếm dòng với content.split('\n').length
    // Gợi ý: Đếm bytes với Buffer.byteLength(content)
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Error: File không tồn tại: ${filepath}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

main();
