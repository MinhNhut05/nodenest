/**
 * BÀI TẬP 2: File Organizer
 *
 * Yêu cầu: Đọc files trong folder và nhóm theo extension
 *
 * Cách chạy: node exercises/02-file-organizer.js [folder]
 * Ví dụ:    node exercises/02-file-organizer.js ../session-1.2.1
 *
 * Expected output:
 * ================
 * === File Organizer ===
 * Folder: ../session-1.2.1
 *
 * [.js] 4 files
 *   - 01-read-file.js
 *   - 02-write-file.js
 *   - 03-directory-ops.js
 *   - 04-file-info.js
 *
 * [.txt] 2 files
 *   - sample.txt
 *   - output.txt
 *
 * [.json] 1 file
 *   - users.json
 * ======================
 */

import { readdir } from "fs/promises";
import path from "path";

async function main() {
  // TODO 1: Lấy folder từ arguments, mặc định là '.'
  const folder = process.argv[2] || ".";

  try {
    // TODO 2: Đọc tất cả files trong folder
    // Gợi ý: await readdir(folder, { withFileTypes: true })
    const entries = await readdir(folder, { withFileTypes: true }); // ← Sửa dòng này

    console.log("=== File Organizer ===");
    console.log("Folder:", folder);
    console.log("");

    // TODO 3: Tạo object để nhóm files theo extension
    // Ví dụ: { '.js': ['file1.js', 'file2.js'], '.txt': ['data.txt'] }
    const groups = {};

    // TODO 4: Duyệt qua entries, lấy extension và nhóm lại
    for (const entry of entries) {
      if (entry.isFile()) {
        // Lấy extension với path.extname()
        const ext = path.extname(entry.name);

        // Nếu chưa có group cho ext này, tạo mới
        if (!groups[ext]) {
          groups[ext] = [];
        }

        // Thêm filename vào group
        // Gợi ý: groups[ext].push(entry.name)
        groups[ext].push(entry.name);
      }
    }

    // TODO 5: In ra kết quả theo từng group
    // Gợi ý: Object.keys(groups) để lấy danh sách extensions
    // Gợi ý: groups[ext] là array các filenames

    for (const ext of Object.keys(groups)) {
      const files = groups[ext];
      const label = ext || "(no extension)";
      console.log(`[${label}] ${files.length} file(s)`);

      // In từng file trong group
      for (const file of files) {
        console.log(`  - ${file}`);
      }
      console.log("");
    }

    console.log("======================");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(`Error: Folder không tồn tại: ${folder}`);
    } else {
      console.error(`Error: ${error.message}`);
    }
  }
}

main();
