/**
 * BÀI TẬP 2: Directory Lister
 *
 * Yêu cầu: Liệt kê files/folders trong thư mục, hiển thị giống ls -la
 *
 * Cách chạy: node exercises/02-dir-lister.js [path]
 * Ví dụ:    node exercises/02-dir-lister.js data
 *           node exercises/02-dir-lister.js      (mặc định = thư mục hiện tại)
 *
 * Expected output:
 * ================
 * $ node exercises/02-dir-lister.js data
 *
 * === Directory: data ===
 * [DIR]   level1/
 * [DIR]   simple-folder/
 * [FILE]  app.log              (156 bytes)
 * [FILE]  sample.txt           (92 bytes)
 * [FILE]  users.json           (245 bytes)
 * ========================
 * Total: 3 files, 2 folders
 */

import { readdir, stat } from "fs/promises";
import { join } from "path";

async function main() {
  // TODO 1: Lấy path từ arguments, mặc định là '.' (thư mục hiện tại)
  const dirPath = process.argv[2] || ".";

  try {
    // TODO 2: Đọc danh sách files/folders với withFileTypes
    const entries = await readdir(dirPath, { withFileTypes: true });

    console.log(`\n=== Directory: ${dirPath} ===`);

    let fileCount = 0;
    let dirCount = 0;

    // TODO 3: Duyệt qua entries và hiển thị thông tin
    for (const entry of entries) {
      if (entry.isDirectory()) {
        // TODO 3a: Hiển thị folder
        console.log(`[DIR]   ${entry.name}/`);
        dirCount++;  // ← Tăng biến đơn giản như này

      } else if (entry.isFile()) {
        // TODO 3b: Hiển thị file với size
        const filePath = join(dirPath, entry.name);
        const fileStats = await stat(filePath);
        console.log(`[FILE]  ${entry.name.padEnd(20)} (${fileStats.size} bytes)`);
        fileCount++;  // ← Tăng biến đơn giản như này
      }
    }

    // TODO 4: Hiển thị tổng kết
    console.log("========================");
    console.log(`Total: ${fileCount} files, ${dirCount} folders`);

  } catch (error) {
    // TODO 5: Xử lý lỗi
    if (error.code === "ENOENT") {
      console.error(`Error: Thư mục không tồn tại: ${dirPath}`);
    } else if (error.code === "ENOTDIR") {
      console.error(`Error: Đây không phải thư mục: ${dirPath}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

main();
