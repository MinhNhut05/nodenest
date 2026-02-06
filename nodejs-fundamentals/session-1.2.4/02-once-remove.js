/**
 * SESSION 1.2.4 - events Module
 * File 02: once, off, removeListener
 *
 * Chạy: node 02-once-remove.js
 */

import { EventEmitter } from 'events';

// ============================================
// 1. ONCE - Chỉ chạy 1 lần
// ============================================

console.log('=== 1. once() - Chỉ chạy 1 lần ===\n');

const emitter = new EventEmitter();

// once() tự động gỡ listener sau khi chạy 1 lần
emitter.once('init', () => {
  console.log('Initialized! (chỉ chạy 1 lần)');
});

console.log('Emit lần 1:');
emitter.emit('init');  // "Initialized!"

console.log('Emit lần 2:');
emitter.emit('init');  // Không có gì (listener đã bị gỡ)

console.log('Emit lần 3:');
emitter.emit('init');  // Không có gì

// ============================================
// 2. REMOVELISTENER / OFF - Gỡ listener cụ thể
// ============================================

console.log('\n=== 2. removeListener() / off() ===\n');

// Phải lưu reference của function để gỡ được
function dataHandler(data) {
  console.log('Received:', data);
}

// Đăng ký
emitter.on('data', dataHandler);

console.log('Emit trước khi gỡ:');
emitter.emit('data', 'Hello');  // "Received: Hello"

// Gỡ listener
emitter.removeListener('data', dataHandler);
// hoặc: emitter.off('data', dataHandler);

console.log('Emit sau khi gỡ:');
emitter.emit('data', 'World');  // Không có gì

// ============================================
// 3. LƯU Ý: Arrow function không gỡ được
// ============================================

console.log('\n=== 3. Lưu ý với Arrow Function ===\n');

// ❌ SAI - Không thể gỡ vì mỗi lần là function khác
emitter.on('test', (x) => console.log(x));
emitter.off('test', (x) => console.log(x));  // Không có tác dụng!

console.log('Arrow function sau khi "gỡ":');
emitter.emit('test', 'Vẫn chạy!');  // Vẫn chạy!

// ✅ ĐÚNG - Lưu reference
const myHandler = (x) => console.log('Handler:', x);
emitter.on('correct', myHandler);
emitter.off('correct', myHandler);  // Gỡ được!

console.log('Named function sau khi gỡ:');
emitter.emit('correct', 'Không chạy');  // Không có gì

// ============================================
// 4. REMOVEALLLISTENERS - Gỡ tất cả
// ============================================

console.log('\n=== 4. removeAllListeners() ===\n');

const em2 = new EventEmitter();

em2.on('msg', () => console.log('Handler 1'));
em2.on('msg', () => console.log('Handler 2'));
em2.on('msg', () => console.log('Handler 3'));

console.log('Trước khi gỡ - có', em2.listenerCount('msg'), 'listeners');
emitter.emit('msg');

// Gỡ tất cả listeners của event 'msg'
em2.removeAllListeners('msg');

console.log('Sau khi gỡ - có', em2.listenerCount('msg'), 'listeners');

// ============================================
// TÓM TẮT
// ============================================

console.log('\n' + '='.repeat(50));
console.log('TÓM TẮT');
console.log('='.repeat(50));
console.log(`
┌─────────────────────────────┬─────────────────────────────┐
│ Method                      │ Tác dụng                    │
├─────────────────────────────┼─────────────────────────────┤
│ once(event, listener)       │ Chạy 1 lần rồi tự gỡ        │
│ off(event, listener)        │ Gỡ listener cụ thể          │
│ removeListener(event, fn)   │ Giống off()                 │
│ removeAllListeners(event)   │ Gỡ tất cả listeners         │
└─────────────────────────────┴─────────────────────────────┘

Lưu ý: Phải lưu reference của function mới gỡ được!
`);
