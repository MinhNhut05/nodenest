/**
 * SESSION 1.1.3 - PART 3: ES Modules (ESM) - Export
 *
 * ES Modules là chuẩn JavaScript hiện đại
 * Cần: "type": "module" trong package.json HOẶC dùng .mjs extension
 */

// ============================================
// 1. NAMED EXPORTS
// ============================================

// Export từng item riêng lẻ
export const name = 'ES Module';
export const version = '2.0.0';

export function greet(name) {
    return `Hello, ${name}! (from ESM)`;
}

export function add(a, b) {
    return a + b;
}

// Hoặc export nhiều items cùng lúc
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;

export { subtract, multiply };

// Export với alias (đổi tên)
const divide = (a, b) => a / b;
export { divide as div };

// ============================================
// 2. DEFAULT EXPORT
// ============================================

// Mỗi module chỉ có 1 default export
// Thường dùng cho class hoặc function chính của module

class Calculator {
    add(a, b) { return a + b; }
    subtract(a, b) { return a - b; }
    multiply(a, b) { return a * b; }
    divide(a, b) { return a / b; }
}

export default Calculator;

// ============================================
// 3. KẾT HỢP NAMED + DEFAULT
// ============================================

/*
Một module có thể có:
- 1 default export
- Nhiều named exports

Ví dụ: React
import React, { useState, useEffect } from 'react';
       ↑ default    ↑ named exports
*/

// ============================================
// 4. RE-EXPORT (Export lại từ module khác)
// ============================================

// export { something } from './other-module.js';
// export * from './other-module.js';

console.log('ES Module loaded!');
