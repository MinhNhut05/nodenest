/**
 * BÀI TẬP 3: Task Queue với Events
 *
 * Yêu cầu: Tạo TaskQueue xử lý tasks và emit events
 *
 * Cách chạy: node exercises/03-task-queue.js
 *
 * Expected output:
 * ================
 * 📋 Task added: Send emails
 * 📋 Task added: Generate report
 * 📋 Task added: Backup database
 *
 * 🚀 Starting queue with 3 tasks...
 *   ⏳ Processing: Send emails
 *   ✅ Completed: Send emails
 *   ⏳ Processing: Generate report
 *   ✅ Completed: Generate report
 *   ⏳ Processing: Backup database
 *   ✅ Completed: Backup database
 * 🎉 All tasks completed!
 */

import { EventEmitter } from "events";

// TODO 1: Tạo class TaskQueue extends EventEmitter
// Gợi ý:
// class TaskQueue extends EventEmitter {
//   constructor() {
//     super();
//     this.tasks = [];
//   }
// }

class TaskQueue extends EventEmitter {
  constructor() {
    super();
    this.tasks = [];
  }
  addTask(task) {
    this.tasks.push(task);
    this.emit("taskAdded", task);
  }
  async process() {
    // 1. Emit 'started' với số lượng tasks
    this.emit('started', this.tasks.length);

    // 2. Duyệt qua từng task
    for (const task of this.tasks) {
      // 2.1. Emit 'taskStarted'
      this.emit('taskStarted', task);

      // 2.2. Giả lập xử lý (delay 500ms)
      await new Promise(r => setTimeout(r, 500));

      // 2.3. Emit 'taskCompleted'
      this.emit('taskCompleted', task);
    }

    // 3. Emit 'completed'
    this.emit('completed');

    // 4. Clear tasks
    this.tasks = [];
  }

  // Sửa và thêm code ở đây
}

// TODO 2: Thêm method addTask(task)
// - Push task vào this.tasks
// - this.emit('taskAdded', task)

// TODO 3: Thêm method async process()
// - Emit 'started' với số lượng tasks
// - Duyệt qua từng task:
//   - Emit 'taskStarted' với task
//   - Giả lập xử lý: await new Promise(r => setTimeout(r, 500))
//   - Emit 'taskCompleted' với task
// - Sau khi xong tất cả, emit 'completed'
// - Clear this.tasks = []

// ============================================
// SỬ DỤNG TASK QUEUE
// ============================================

const queue = new TaskQueue();

// Đăng ký listeners
queue.on("taskAdded", (task) => {
  console.log(`📋 Task added: ${task}`);
});

queue.on("started", (count) => {
  console.log(`\n🚀 Starting queue with ${count} tasks...`);
});

queue.on("taskStarted", (task) => {
  console.log(`  ⏳ Processing: ${task}`);
});

queue.on("taskCompleted", (task) => {
  console.log(`  ✅ Completed: ${task}`);
});

queue.on("completed", () => {
  console.log("🎉 All tasks completed!");
});

// Error handler (quan trọng!)
queue.on("error", (err) => {
  console.error("🔴 Queue error:", err.message);
});

// Add tasks
queue.addTask("Send emails");
queue.addTask("Generate report");
queue.addTask("Backup database");

// Process all tasks
queue.process();
