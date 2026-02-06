/**
 * BÀI TẬP 3: Simple Logger
 *
 * Yêu cầu: Tạo logger ghi log vào file với timestamp
 *
 * Cách chạy: node exercises/03-simple-logger.js
 *
 * Expected output (terminal):
 * ===========================
 * [2024-01-25T10:30:00.000Z] [INFO] Application started
 * [2024-01-25T10:30:00.001Z] [INFO] User logged in
 * [2024-01-25T10:30:00.002Z] [WARN] High memory usage
 * [2024-01-25T10:30:00.003Z] [ERROR] Database connection failed
 * [2024-01-25T10:30:00.004Z] [INFO] Application stopped
 *
 * Log file created: logs/app.log
 *
 * Expected file content (logs/app.log):
 * =====================================
 * [2024-01-25T10:30:00.000Z] [INFO] Application started
 * [2024-01-25T10:30:00.001Z] [INFO] User logged in
 * ...
 */

import { appendFile, mkdir } from "fs/promises";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Đường dẫn file log
const LOG_DIR = join(__dirname, "..", "logs");
const LOG_FILE = join(LOG_DIR, "app.log");

/**
 * Hàm log - ghi message vào file và console
 * @param {string} level - INFO, WARN, ERROR
 * @param {string} message - Nội dung log
 */
async function log(level, message) {
  // TODO 1: Tạo timestamp
  // Gợi ý: new Date().toISOString()
  const timestamp = new Date().toISOString();

  // TODO 2: Tạo log entry với format:
  // [timestamp] [LEVEL] message\n
  // Ví dụ: [2024-01-25T10:30:00.000Z] [INFO] Application started\n
  const logEntry = `[${timestamp}] [${level}] ${message}\n`;

  // TODO 3: In ra console
  // Gợi ý: console.log(logEntry) hoặc process.stdout.write(logEntry)
  console.log(logEntry);

  await appendFile(LOG_FILE, logEntry);
  // TODO 4: Ghi vào file với appendFile
  // Gợi ý: await appendFile(LOG_FILE, logEntry)
}

// Shorthand functions
async function info(message) {
  await log("INFO", message);
}

async function warn(message) {
  await log("WARN", message);
}

async function error(message) {
  await log("ERROR", message);
}

async function main() {
  try {
    // TODO 5: Tạo thư mục logs nếu chưa tồn tại
    // Gợi ý: await mkdir(LOG_DIR, { recursive: true })
    await mkdir(LOG_DIR, { recursive: true });
    // Test logger
    await info("Application started");
    await info("User logged in");
    await warn("High memory usage");
    await error("Database connection failed");
    await info("Application stopped");

    console.log(`\nLog file created: ${LOG_FILE}`);
  } catch (err) {
    console.error("Logger error:", err.message);
  }
}

main();
