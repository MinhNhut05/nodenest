/**
 * BÀI TẬP 2: Custom Logger Class
 *
 * Yêu cầu: Tạo Logger class kế thừa EventEmitter
 *
 * Cách chạy: node exercises/02-event-logger.js
 *
 * Expected output:
 * ================
 * [INFO] Application started
 *   → Logged to file: app.log
 * [WARN] High memory usage
 *   ⚠️ Warning alert sent!
 * [ERROR] Database connection failed
 *   🔴 Error alert sent to admin!
 */

import { log } from "console";
import { EventEmitter } from "events";

// TODO 1: Tạo class Logger extends EventEmitter
// Gợi ý:
// class Logger extends EventEmitter {
//   constructor(name) {
//     super();  // QUAN TRỌNG!
//     this.name = name;
//   }
// }
class Logger extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }
  log(message) {
    const entry = { level: "INFO", message, timestamp: new Date() };
    console.log(`[INFO] ${message}`);
    this.emit("log", entry);
  }
  warn(message) {
    const entry = { level: "WARN", message, timestamp: new Date() };
    console.log(`[WARN] ${message}`);
    this.emit("log", entry); // Event chung
    this.emit("warn", entry); // Event riêng cho warning
  }
  error(message) {
    const entry = { level: "ERROR", message, timestamp: new Date() };
    console.log(`[ERROR] ${message}`);
    this.emit("log", entry); // Event chung
    this.emit("error", entry); // Event riêng cho error
  }
}

// TODO 2: Thêm method log(message)
// - Tạo entry object: { level: 'INFO', message, timestamp }
// - console.log(`[INFO] ${message}`)
// - this.emit('log', entry)

// TODO 3: Thêm method warn(message)
// - Tương tự log(), nhưng level = 'WARN'
// - Emit thêm event 'warn'

// TODO 4: Thêm method error(message)
// - Tương tự, level = 'ERROR'
// - Emit thêm event 'error'

// ============================================
// SỬ DỤNG LOGGER
// ============================================

const logger = new Logger("AppLogger");

// Listener cho tất cả logs - giả lập ghi file
logger.on("log", (entry) => {
  console.log("  → Logged to file: app.log");
});

// Listener riêng cho warnings
logger.on("warn", (entry) => {
  console.log("  ⚠️ Warning alert sent!");
});

// Listener riêng cho errors
logger.on("error", (entry) => {
  console.log("  🔴 Error alert sent to admin!");
});

// Test
logger.log("Application started");
logger.warn("High memory usage");
logger.error("Database connection failed");
