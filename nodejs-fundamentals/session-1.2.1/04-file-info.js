/**
 * SESSION 1.2.1 - fs Module
 * File 04: Kiểm tra file & lấy thông tin (File Info)
 *
 * Chạy: node 04-file-info.js
 */

import { stat, access, constants } from "fs/promises";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// 1. stat - Lấy thông tin file/folder
// ============================================

async function demoStat() {
  console.log("=== 1. stat - Thông tin file ===\n");

  const filePath = join(__dirname, "data", "sample.txt");

  // stat(path) → trả về object Stats
  // Tương đương Linux: stat file.txt
  const stats = await stat(filePath);

  console.log("File:", filePath);
  console.log("---");

  // Các properties quan trọng
  console.log(stats);

  console.log("Là file?:", stats.isFile()); // true
  console.log("Là folder?:", stats.isDirectory()); // false
  console.log("Kích thước:", stats.size, "bytes");

  // Timestamps
  console.log("Tạo lúc:", stats.birthtime.toLocaleString());
  console.log("Sửa lúc:", stats.mtime.toLocaleString());
  console.log("Truy cập lúc:", stats.atime.toLocaleString());

  // Permissions (dạng octal như Linux)
  console.log("Mode:", stats.mode.toString(8));

  // Kiểm tra folder
  console.log("\n--- Kiểm tra folder ---");
  const dirStats = await stat(join(__dirname, "data"));
  console.log("data/ là folder?:", dirStats.isDirectory());
}

// ============================================
// 2. Kiểm tra file tồn tại
// ============================================

async function demoCheckExists() {
  console.log("\n=== 2. Kiểm tra file tồn tại ===\n");

  const existingFile = join(__dirname, "data", "sample.txt");
  const notExistFile = join(__dirname, "data", "not-exist.txt");

  // CÁCH 1: existsSync (sync - nhanh gọn cho check đơn giản)
  // CHÚ Ý: Đây là hàm SYNC, chỉ dùng khi cần check nhanh
  console.log("existsSync:");
  console.log("  sample.txt tồn tại?:", existsSync(existingFile));
  console.log("  not-exist.txt tồn tại?:", existsSync(notExistFile));

  // CÁCH 2: Dùng stat + try/catch (async)
  console.log("\nDùng stat + try/catch:");
  try {
    await stat(existingFile);
    console.log("  sample.txt → tồn tại");
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("  sample.txt → không tồn tại");
    }
  }

  // CÁCH 3: access - kiểm tra quyền truy cập
  console.log("\nDùng access:");
  try {
    await access(existingFile, constants.R_OK);
    console.log("  sample.txt → có quyền đọc");
  } catch {
    console.log("  sample.txt → không có quyền đọc");
  }
}

// ============================================
// 3. access - Kiểm tra quyền
// ============================================

async function demoAccess() {
  console.log("\n=== 3. access - Kiểm tra quyền ===\n");

  const filePath = join(__dirname, "data", "sample.txt");

  // constants chứa các flags để check quyền
  // F_OK: file tồn tại
  // R_OK: có quyền đọc
  // W_OK: có quyền ghi
  // X_OK: có quyền execute

  console.log("Kiểm tra quyền cho sample.txt:");

  // Check tồn tại
  try {
    await access(filePath, constants.F_OK);
    console.log("  [OK] File tồn tại");
  } catch {
    console.log("  [X] File không tồn tại");
  }

  // Check quyền đọc
  try {
    await access(filePath, constants.R_OK);
    console.log("  [OK] Có quyền đọc (R_OK)");
  } catch {
    console.log("  [X] Không có quyền đọc");
  }

  // Check quyền ghi
  try {
    await access(filePath, constants.W_OK);
    console.log("  [OK] Có quyền ghi (W_OK)");
  } catch {
    console.log("  [X] Không có quyền ghi");
  }

  // Check nhiều quyền cùng lúc (bitwise OR)
  try {
    await access(filePath, constants.R_OK | constants.W_OK);
    console.log("  [OK] Có cả quyền đọc VÀ ghi");
  } catch {
    console.log("  [X] Thiếu quyền đọc hoặc ghi");
  }
}

// ============================================
// 4. Ví dụ thực tế: Safe file read
// ============================================

async function safeReadFile(filePath) {
  console.log("\n=== 4. Ví dụ: Safe file read ===\n");

  const { readFile } = await import("fs/promises");

  // Bước 1: Check file tồn tại và có quyền đọc
  try {
    await access(filePath, constants.R_OK);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`File không tồn tại: ${filePath}`);
    }
    if (error.code === "EACCES") {
      throw new Error(`Không có quyền đọc: ${filePath}`);
    }
    throw error;
  }

  // Bước 2: Check không phải folder
  const stats = await stat(filePath);
  if (stats.isDirectory()) {
    throw new Error(`Path là folder, không phải file: ${filePath}`);
  }

  // Bước 3: Check size (tránh đọc file quá lớn)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (stats.size > MAX_SIZE) {
    throw new Error(`File quá lớn (${stats.size} bytes). Max: ${MAX_SIZE}`);
  }

  // Bước 4: Đọc file
  const content = await readFile(filePath, "utf8");
  console.log("Đọc file thành công!");
  console.log("Kích thước:", stats.size, "bytes");
  console.log("Nội dung:", content.substring(0, 50) + "...");

  return content;
}

// ============================================
// BẢNG TÓM TẮT
// ============================================

function printSummary() {
  console.log("\n" + "=".repeat(55));
  console.log("BẢNG TÓM TẮT - FILE INFO");
  console.log("=".repeat(55));
  console.log(`
┌────────────────────────┬────────────────────────────┐
│ Method                 │ Tác dụng                   │
├────────────────────────┼────────────────────────────┤
│ stat(path)             │ Lấy thông tin file/folder  │
│ stats.isFile()         │ Kiểm tra là file?          │
│ stats.isDirectory()    │ Kiểm tra là folder?        │
│ stats.size             │ Kích thước (bytes)         │
│ stats.mtime            │ Thời gian sửa đổi          │
├────────────────────────┼────────────────────────────┤
│ existsSync(path)       │ Check tồn tại (sync)       │
│ access(path, mode)     │ Check quyền (async)        │
│ constants.R_OK         │ Quyền đọc                  │
│ constants.W_OK         │ Quyền ghi                  │
└────────────────────────┴────────────────────────────┘

Error codes thường gặp:
- ENOENT: File/folder không tồn tại
- EACCES: Không có quyền truy cập
- EISDIR: Path là folder (khi cần file)
- ENOTDIR: Path là file (khi cần folder)
`);
}

// ============================================
// CHẠY CÁC VÍ DỤ
// ============================================

async function main() {
  try {
    await demoStat();
    await demoCheckExists();
    await demoAccess();

    const testFile = join(__dirname, "data", "sample.txt");
    await safeReadFile(testFile);

    printSummary();
  } catch (error) {
    console.error("Lỗi:", error.message);
  }
}

main();
