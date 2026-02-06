/**
 * SESSION 1.1.3 - PART 4: ES Modules (ESM) - Import
 */

// ============================================
// 1. IMPORT NAMED EXPORTS
// ============================================

console.log('=== ES Modules Import ===\n');

// Import từng item (phải đúng tên)
import { name, version, greet, add } from './03-esm-export.mjs';

console.log('Name:', name);
console.log('Version:', version);
console.log('Greet:', greet('Leminho'));
console.log('Add:', add(5, 3));

// ============================================
// 2. IMPORT VỚI ALIAS
// ============================================

console.log('\n--- Import with Alias ---');

// Đổi tên khi import
import { subtract as sub, multiply as mul } from './03-esm-export.mjs';

console.log('Subtract (alias sub):', sub(10, 3));
console.log('Multiply (alias mul):', mul(4, 5));

// Import alias từ export
import { div } from './03-esm-export.mjs';
console.log('Divide (exported as div):', div(20, 4));

// ============================================
// 3. IMPORT DEFAULT EXPORT
// ============================================

console.log('\n--- Import Default ---');

// Default export có thể đặt tên bất kỳ
import Calculator from './03-esm-export.mjs';
// import MyCalc from './03-esm-export.mjs';  // Cũng OK

const calc = new Calculator();
console.log('Calculator add:', calc.add(100, 50));

// ============================================
// 4. IMPORT CẢ DEFAULT VÀ NAMED
// ============================================

console.log('\n--- Import Default + Named ---');

// Giống React: import React, { useState } from 'react'
import Calc, { name as moduleName } from './03-esm-export.mjs';

console.log('Module name:', moduleName);
console.log('Calc multiply:', new Calc().multiply(3, 3));

// ============================================
// 5. IMPORT TẤT CẢ (Namespace Import)
// ============================================

console.log('\n--- Namespace Import ---');

// Import tất cả named exports vào một object
import * as MathModule from './03-esm-export.mjs';

console.log('All exports:', Object.keys(MathModule));
console.log('MathModule.add:', MathModule.add(1, 2));
console.log('MathModule.default:', MathModule.default);  // default export

// ============================================
// 6. IMPORT BUILT-IN MODULES
// ============================================

console.log('\n--- Built-in Modules ---');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM không có __dirname, phải tự tạo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('__dirname (tự tạo):', __dirname);
console.log('__filename (tự tạo):', __filename);

// import.meta chứa metadata về module
console.log('import.meta.url:', import.meta.url);

// ============================================
// 7. TOP-LEVEL AWAIT (Chỉ có trong ESM!)
// ============================================

console.log('\n--- Top-level Await ---');

// Có thể dùng await ở top-level (không cần async function)
const data = await Promise.resolve('Data from async operation');
console.log('Top-level await result:', data);

// Điều này KHÔNG THỂ làm được trong CommonJS!
