/**
 * BÀI TẬP 1: EventEmitter Cơ Bản
 *
 * Yêu cầu: Tạo EventEmitter và test các methods
 *
 * Cách chạy: node exercises/01-basic-emitter.js
 *
 * Expected output:
 * ================
 * Received message: Hello Leminho!
 * Received message: Welcome to Node.js
 * Init called (chỉ 1 lần)
 * After remove: (không có output)
 */

import { EventEmitter } from "events";

const emitter = new EventEmitter();

// TODO 1: Đăng ký listener cho event 'message'
// Gợi ý: emitter.on('message', (msg) => { console.log('Received message:', msg); })
emitter.on("message", (msg) => {
  console.log("Received message:", msg);
});

// TODO 2: Emit event 'message' 2 lần với nội dung khác nhau
// Gợi ý: emitter.emit('message', 'Hello Leminho!')
emitter.emit("message", "Hello Leminho!");
emitter.emit("message", "Hello minhnhut!");
// TODO 3: Dùng once() cho event 'init' - chỉ chạy 1 lần
// Gợi ý: emitter.once('init', () => { console.log('Init called (chỉ 1 lần)'); })
emitter.once("init", () => {
  console.log("Init called (chỉ 1 lần)");
});
// TODO 4: Emit 'init' 2 lần, quan sát output
// Gợi ý: emitter.emit('init'); emitter.emit('init');
emitter.emit("init", "Hello Leminho!");
emitter.emit("init", "Hello minhnhut!");
// TODO 5: Test removeListener
// - Tạo handler function
// - Đăng ký với on()
// - Gỡ với off() hoặc removeListener()
// - Emit để test
console.log("\n--- Test removeListener ---");

function myHandler(data) {
  console.log("Handler received:", data);
}
emitter.on("haha", myHandler);
emitter.off("haha", myHandler);

// Đăng ký

// Emit - nên thấy output

// Gỡ listener

// Emit lại - không có output
console.log("After remove: (không có output nếu đúng)");
