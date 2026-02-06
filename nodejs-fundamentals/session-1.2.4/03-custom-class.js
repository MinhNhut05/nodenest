/**
 * SESSION 1.2.4 - events Module
 * File 03: Custom EventEmitter Class
 *
 * Chạy: node 03-custom-class.js
 */

import { EventEmitter } from "events";

// ============================================
// 1. TẠO CLASS KẾ THỪA EVENTEMITTER
// ============================================

console.log("=== Custom EventEmitter Class ===\n");

/**
 * Logger class - emit events khi log
 */
class Logger extends EventEmitter {
  constructor(name) {
    super(); // QUAN TRỌNG: Phải gọi super()
    this.name = name;
  }

  log(message) {
    const entry = {
      level: "INFO",
      message,
      timestamp: new Date().toISOString(),
      logger: this.name,
    };
    console.log(`[${entry.level}] ${message} `);
    this.emit("log", entry); // Emit event
  }

  warn(message) {
    const entry = {
      level: "WARN",
      message,
      timestamp: new Date().toISOString(),
      logger: this.name,
    };
    console.log(`[${entry.level}] ${message}`);
    this.emit("log", entry);
    this.emit("warn", entry); // Emit event riêng cho warn
  }

  error(message) {
    const entry = {
      level: "ERROR",
      message,
      timestamp: new Date().toISOString(),
      logger: this.name,
    };
    console.log(`[${entry.level}] ${message}`);
    this.emit("log", entry);
    this.emit("error", entry); // Emit event riêng cho error
  }
}

// ============================================
// 2. SỬ DỤNG CUSTOM CLASS
// ============================================

const logger = new Logger("AppLogger");

// Đăng ký listeners
logger.on("log", (entry) => {
  // Có thể ghi vào file, gửi lên server, etc.
  // console.log('  → Log entry:', entry);
});

logger.on("warn", (entry) => {
  console.log("  ⚠️  Warning detected!");
});

logger.on("error", (entry) => {
  console.log("  🔴 Error detected! Alert admin!");
});

// Test
console.log("--- Testing Logger ---\n");
logger.log("Application started");
logger.log("User logged in");
logger.warn("High memory usage");
logger.error("Database connection failed");

// ============================================
// 3. VÍ DỤ 2: TASK PROCESSOR
// ============================================

console.log("\n=== Task Processor ===\n");

class TaskProcessor extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
  }

  addTask(task) {
    this.tasks.push(task);
    this.emit("taskAdded", task);
  }

  async process() {
    this.emit("started", this.tasks.length);

    for (let i = 0; i < this.tasks.length; i++) {
      const task = this.tasks[i];

      this.emit("taskStarted", task, i + 1, this.tasks.length);

      // Giả lập xử lý task
      await new Promise((resolve) => setTimeout(resolve, 500));

      this.emit("taskCompleted", task, i + 1, this.tasks.length);
    }

    this.emit("completed", this.tasks.length);
    this.tasks = [];
  }
}

// Sử dụng
const processor = new TaskProcessor();

processor.on("taskAdded", (task) => {
  console.log(`📋 Task added: ${task}`);
});

processor.on("started", (count) => {
  console.log(`\n🚀 Processing ${count} tasks...`);
});

processor.on("taskStarted", (task, current, total) => {
  console.log(`  ⏳ [${current}/${total}] Processing: ${task}`);
});

processor.on("taskCompleted", (task, current, total) => {
  console.log(`  ✅ [${current}/${total}] Completed: ${task}`);
});

processor.on("completed", (count) => {
  console.log(`\n🎉 All ${count} tasks completed!`);
});

// Add và process tasks
processor.addTask("Send emails");
processor.addTask("Generate report");
processor.addTask("Backup database");

processor.process();
