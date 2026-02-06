/**
 * SESSION 1.2.4 - events Module
 * File 01: EventEmitter Cơ Bản
 *
 * Chạy: node 01-basic-events.js
 */

import { EventEmitter } from 'events';

// ============================================
// 1. TẠO EVENTEMITTER
// ============================================

console.log('=== 1. EventEmitter Cơ Bản ===\n');

const emitter = new EventEmitter();

// ============================================
// 2. ON - Đăng ký Listener
// ============================================

// Đăng ký listener cho event 'greet'
// Tương tự: button.addEventListener('click', handler)
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Có thể đăng ký NHIỀU listeners cho cùng 1 event
emitter.on('greet', (name) => {
  console.log(`Welcome, ${name}!`);
});

// ============================================
// 3. EMIT - Phát Event
// ============================================

// emit(eventName, ...args) → trigger event
console.log('Emit "greet" với name = "Leminho":');
emitter.emit('greet', 'Leminho');
// Output:
// Hello, Leminho!
// Welcome, Leminho!

// ============================================
// 4. TRUYỀN NHIỀU ARGUMENTS
// ============================================

console.log('\n=== 2. Truyền nhiều arguments ===\n');

emitter.on('userCreated', (id, name, email) => {
  console.log(`User created:`);
  console.log(`  ID: ${id}`);
  console.log(`  Name: ${name}`);
  console.log(`  Email: ${email}`);
});

emitter.emit('userCreated', 1, 'Leminho', 'leminho@example.com');

// ============================================
// 5. TRUYỀN OBJECT
// ============================================

console.log('\n=== 3. Truyền object ===\n');

emitter.on('order', (order) => {
  console.log('New order received:');
  console.log(`  Product: ${order.product}`);
  console.log(`  Quantity: ${order.quantity}`);
  console.log(`  Total: $${order.total}`);
});

emitter.emit('order', {
  product: 'iPhone 15',
  quantity: 2,
  total: 1998
});

// ============================================
// 6. KIỂM TRA SỐ LISTENERS
// ============================================

console.log('\n=== 4. Số lượng listeners ===\n');

console.log('Số listeners cho "greet":', emitter.listenerCount('greet'));
console.log('Số listeners cho "order":', emitter.listenerCount('order'));
console.log('Số listeners cho "unknown":', emitter.listenerCount('unknown'));

// ============================================
// TÓM TẮT
// ============================================

console.log('\n' + '='.repeat(50));
console.log('TÓM TẮT');
console.log('='.repeat(50));
console.log(`
┌──────────────────────┬────────────────────────────┐
│ Method               │ Tác dụng                   │
├──────────────────────┼────────────────────────────┤
│ on(event, listener)  │ Đăng ký listener           │
│ emit(event, ...args) │ Phát event với data        │
│ listenerCount(event) │ Đếm số listeners           │
└──────────────────────┴────────────────────────────┘
`);
