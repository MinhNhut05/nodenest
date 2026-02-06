/**
 * SESSION 1.2.2 - path Module
 * File 01: Join & Resolve Paths
 *
 * Chạy: node 01-join-resolve.js
 */

import path from 'path';

// ============================================
// 1. path.join() - Nối các phần của path
// ============================================

console.log('=== 1. path.join() ===\n');

// Nối đơn giản
const simple = path.join('src', 'utils', 'index.js');
console.log('join("src", "utils", "index.js"):');
console.log('  →', simple);

// Xử lý .. (parent directory)
const withParent = path.join('src', 'utils', '..', 'helpers', 'format.js');
console.log('\njoin("src", "utils", "..", "helpers", "format.js"):');
console.log('  →', withParent);
console.log('  (.. đi lên 1 cấp, bỏ qua utils)');

// Xử lý // (double slash)
const withDoubleSlash = path.join('src', '//utils//', 'index.js');
console.log('\njoin("src", "//utils//", "index.js"):');
console.log('  →', withDoubleSlash);
console.log('  (tự động chuẩn hóa //)');

// join với absolute paths
const joinAbsolute = path.join('/a', '/b', 'c');
console.log('\njoin("/a", "/b", "c"):');
console.log('  →', joinAbsolute);
console.log('  (join giữ nguyên tất cả, chỉ nối)');

// ============================================
// 2. path.resolve() - Tạo absolute path
// ============================================

console.log('\n=== 2. path.resolve() ===\n');

// Từ relative → absolute
const fromRelative = path.resolve('src', 'index.js');
console.log('resolve("src", "index.js"):');
console.log('  →', fromRelative);
console.log('  (bắt đầu từ cwd, thêm src/index.js)');

// Gặp absolute path → reset
const withAbsolute = path.resolve('/a', '/b');
console.log('\nresolve("/a", "/b"):');
console.log('  →', withAbsolute);
console.log('  (gặp /b là absolute → dừng lại, chỉ lấy /b)');

// Ví dụ phức tạp hơn
const complex = path.resolve('src', '/tmp', 'data', 'file.txt');
console.log('\nresolve("src", "/tmp", "data", "file.txt"):');
console.log('  →', complex);
console.log('  (gặp /tmp → reset, tiếp tục từ /tmp)');

// ============================================
// 3. SO SÁNH join() vs resolve()
// ============================================

console.log('\n=== 3. So sánh join() vs resolve() ===\n');

const testCases = [
  ['src', 'index.js'],
  ['/a', '/b'],
  ['..', 'file.txt'],
  ['/home', 'user', '..', 'admin'],
];

console.log('┌─────────────────────────┬─────────────────────┬─────────────────────────────────┐');
console.log('│ Input                   │ join()              │ resolve()                       │');
console.log('├─────────────────────────┼─────────────────────┼─────────────────────────────────┤');

for (const args of testCases) {
  const input = args.map(a => `"${a}"`).join(', ').padEnd(23);
  const joinResult = path.join(...args).padEnd(19);
  const resolveResult = path.resolve(...args);
  console.log(`│ ${input} │ ${joinResult} │ ${resolveResult.padEnd(31)} │`);
}

console.log('└─────────────────────────┴─────────────────────┴─────────────────────────────────┘');

// ============================================
// 4. Ứng dụng thực tế
// ============================================

console.log('\n=== 4. Ứng dụng thực tế ===\n');

// Lấy __dirname trong ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('__dirname:', __dirname);
console.log('__filename:', __filename);

// Đường dẫn tới file config
const configPath = path.join(__dirname, 'config', 'app.json');
console.log('\nConfig path (join với __dirname):');
console.log('  →', configPath);

// Đường dẫn tới thư mục cha
const parentDir = path.join(__dirname, '..');
console.log('\nParent directory:');
console.log('  →', parentDir);
