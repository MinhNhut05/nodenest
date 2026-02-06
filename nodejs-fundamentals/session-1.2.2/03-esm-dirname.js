/**
 * SESSION 1.2.2 - path Module
 * File 03: ESM __dirname & Cross-platform
 *
 * Chạy: node 03-esm-dirname.js
 */

import path from 'path';
import { fileURLToPath } from 'url';

// ============================================
// 1. VẤN ĐỀ: ESM không có __dirname
// ============================================

console.log('=== 1. Vấn đề với ESM ===\n');

console.log('Trong CommonJS (require):');
console.log('  __dirname và __filename có sẵn');

console.log('\nTrong ES Modules (import):');
console.log('  __dirname và __filename KHÔNG có sẵn!');
console.log('  Phải tự tạo từ import.meta.url');

// ============================================
// 2. GIẢI PHÁP: Tạo __dirname từ import.meta.url
// ============================================

console.log('\n=== 2. Tạo __dirname trong ESM ===\n');

// import.meta.url chứa URL của file hiện tại
console.log('import.meta.url:');
console.log(' ', import.meta.url);
// Kết quả: file:///home/user/project/03-esm-dirname.js

// Bước 1: Convert URL → path
const __filename = fileURLToPath(import.meta.url);
console.log('\n__filename (sau fileURLToPath):');
console.log(' ', __filename);
// Kết quả: /home/user/project/03-esm-dirname.js

// Bước 2: Lấy dirname
const __dirname = path.dirname(__filename);
console.log('\n__dirname (sau path.dirname):');
console.log(' ', __dirname);
// Kết quả: /home/user/project

// ============================================
// 3. SỬ DỤNG __dirname
// ============================================

console.log('\n=== 3. Sử dụng __dirname ===\n');

// Đường dẫn tới file trong cùng thư mục
const siblingFile = path.join(__dirname, 'data.json');
console.log('File cùng thư mục:');
console.log(' ', siblingFile);

// Đường dẫn tới thư mục con
const subDir = path.join(__dirname, 'src', 'utils');
console.log('\nThư mục con:');
console.log(' ', subDir);

// Đường dẫn tới thư mục cha
const parentDir = path.join(__dirname, '..');
console.log('\nThư mục cha:');
console.log(' ', parentDir);

// ============================================
// 4. HELPER FUNCTION (Tái sử dụng)
// ============================================

console.log('\n=== 4. Helper Function ===\n');

/**
 * Lấy __dirname từ import.meta.url
 * @param {string} importMetaUrl - import.meta.url
 * @returns {string} - Đường dẫn thư mục
 */
function getDirname(importMetaUrl) {
  return path.dirname(fileURLToPath(importMetaUrl));
}

// Sử dụng
const currentDir = getDirname(import.meta.url);
console.log('getDirname(import.meta.url):');
console.log(' ', currentDir);

console.log(`
Tip: Tạo file utils/paths.js với nội dung:

  import { fileURLToPath } from 'url';
  import { dirname } from 'path';

  export function getDirname(importMetaUrl) {
    return dirname(fileURLToPath(importMetaUrl));
  }

Sau đó import và dùng:

  import { getDirname } from './utils/paths.js';
  const __dirname = getDirname(import.meta.url);
`);

// ============================================
// 5. CROSS-PLATFORM
// ============================================

console.log('=== 5. Cross-platform ===\n');

// path.sep - Separator của OS hiện tại
console.log('path.sep (separator):');
console.log(`  Linux/Mac: "/" | Windows: "\\\\"`);
console.log(`  Hiện tại:  "${path.sep}"`);

// path.delimiter - Delimiter trong PATH env
console.log('\npath.delimiter (PATH env separator):');
console.log(`  Linux/Mac: ":" | Windows: ";"`);
console.log(`  Hiện tại:  "${path.delimiter}"`);

// Ví dụ: Split PATH env
console.log('\nPATH environment (5 entries đầu):');
const pathEnv = process.env.PATH || '';
const pathEntries = pathEnv.split(path.delimiter).slice(0, 5);
pathEntries.forEach((entry, i) => {
  console.log(`  ${i + 1}. ${entry}`);
});

// path.normalize - Chuẩn hóa path
console.log('\npath.normalize() - Chuẩn hóa path:');
const messyPath = 'src//utils/../helpers//./format.js';
const cleanPath = path.normalize(messyPath);
console.log(`  Input:  "${messyPath}"`);
console.log(`  Output: "${cleanPath}"`);

// ============================================
// TÓM TẮT
// ============================================

console.log('\n' + '='.repeat(50));
console.log('TÓM TẮT - ESM __dirname');
console.log('='.repeat(50));
console.log(`
// Template để có __dirname trong ES Modules:

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sau đó dùng như CommonJS:
const configPath = path.join(__dirname, 'config.json');
`);
