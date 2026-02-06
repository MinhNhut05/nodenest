/**
 * SESSION 1.1.3 - PART 2: Import trong CommonJS
 *
 * Dùng require() để import modules
 */

// ============================================
// 1. IMPORT MODULE TỰ TẠO
// ============================================

console.log('=== CommonJS Import ===\n');

// Import module từ file khác (dùng đường dẫn relative)
const myModule = require('./01-commonjs-export.cjs');

console.log('Imported module:', myModule);
console.log('Name:', myModule.name);
console.log('Version:', myModule.version);
console.log('Greet:', myModule.greet('Leminho'));
console.log('Add:', myModule.add(5, 3));

// ============================================
// 2. DESTRUCTURING KHI IMPORT
// ============================================

console.log('\n--- Destructuring ---');

// Lấy từng property cần dùng
const { greet, add } = require('./01-commonjs-export.cjs');

console.log('Greet:', greet('World'));
console.log('Add:', add(10, 20));

// ============================================
// 3. IMPORT BUILT-IN MODULES
// ============================================

console.log('\n--- Built-in Modules ---');

// Node.js built-in modules (không cần đường dẫn)
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('Current directory:', path.basename(__dirname));
console.log('Home directory:', os.homedir());

// ============================================
// 4. IMPORT NPM PACKAGES
// ============================================

console.log('\n--- NPM Packages ---');

// Packages từ node_modules (sau khi npm/pnpm install)
// const lodash = require('lodash');
// const express = require('express');

console.log('(Cần install packages trước khi require)');

// ============================================
// 5. REQUIRE LÀ SYNCHRONOUS
// ============================================

/*
require() là ĐỒNG BỘ (synchronous):
- Module được load và execute NGAY LẬP TỨC
- Code tiếp theo phải CHỜ module load xong

Điều này khác với ES Modules (asynchronous)
*/

console.log('\n--- require() is Synchronous ---');
console.log('Before require');
const data = require('./01-commonjs-export.cjs');
console.log('After require - module đã load xong');

// ============================================
// 6. MODULE CACHING
// ============================================

console.log('\n--- Module Caching ---');

// require() cùng module nhiều lần → chỉ load 1 lần
const mod1 = require('./01-commonjs-export.cjs');
const mod2 = require('./01-commonjs-export.cjs');

console.log('mod1 === mod2:', mod1 === mod2);  // true!

// Module được cache, không chạy lại code trong module
