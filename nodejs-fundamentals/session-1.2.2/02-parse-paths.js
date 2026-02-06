/**
 * SESSION 1.2.2 - path Module
 * File 02: Phân tích Path (Parse Paths)
 *
 * Chạy: node 02-parse-paths.js
 */

import path from 'path';

// ============================================
// 1. dirname() - Lấy thư mục chứa file
// ============================================

console.log('=== 1. path.dirname() ===\n');

const examples = [
  '/home/user/project/src/index.js',
  '/home/user/file.txt',
  'src/utils/helper.js',
  'file.txt',
];

for (const p of examples) {
  console.log(`dirname("${p}")`);
  console.log(`  → "${path.dirname(p)}"\n`);
}

// ============================================
// 2. basename() - Lấy tên file
// ============================================

console.log('=== 2. path.basename() ===\n');

const filePath = '/home/user/project/src/index.js';

// Lấy tên file có extension
console.log(`basename("${filePath}")`);
console.log(`  → "${path.basename(filePath)}"`);

// Lấy tên file không có extension
console.log(`\nbasename("${filePath}", ".js")`);
console.log(`  → "${path.basename(filePath, '.js')}"`);

// Với các extension khác
const cssFile = '/styles/main.css';
console.log(`\nbasename("${cssFile}", ".css")`);
console.log(`  → "${path.basename(cssFile, '.css')}"`);

// ============================================
// 3. extname() - Lấy extension
// ============================================

console.log('\n=== 3. path.extname() ===\n');

const files = [
  'index.js',
  'styles.min.css',
  'data.json',
  'README',
  '.gitignore',
  'archive.tar.gz',
];

for (const file of files) {
  const ext = path.extname(file) || '(no extension)';
  console.log(`extname("${file}") → "${ext}"`);
}

// ============================================
// 4. parse() - Phân tích toàn bộ
// ============================================

console.log('\n=== 4. path.parse() ===\n');

const fullPath = '/home/user/project/src/index.js';
const parsed = path.parse(fullPath);

console.log(`parse("${fullPath}"):`);
console.log(parsed);

console.log('\nMiễn họa các thành phần:');
console.log(`
  ${fullPath}
  ├── root: "${parsed.root}"
  ├── dir:  "${parsed.dir}"
  ├── base: "${parsed.base}"
  ├── name: "${parsed.name}"
  └── ext:  "${parsed.ext}"
`);

// Visual breakdown
console.log('Visual breakdown:');
console.log(`
  /home/user/project/src/index.js
  │                      │
  │                      └── base: "index.js"
  │                          ├── name: "index"
  │                          └── ext: ".js"
  │
  └── dir: "/home/user/project/src"
      │
      └── root: "/"
`);

// ============================================
// 5. format() - Ngược lại với parse()
// ============================================

console.log('=== 5. path.format() ===\n');

// Từ object → path string
const pathObject = {
  dir: '/home/user/documents',
  name: 'report',
  ext: '.pdf'
};

const formatted = path.format(pathObject);
console.log('Input object:');
console.log(pathObject);
console.log(`\nformat() → "${formatted}"`);

// Ví dụ: Đổi extension
console.log('\n--- Ứng dụng: Đổi extension ---');
const originalPath = '/data/image.png';
const parsedPath = path.parse(originalPath);

// Đổi từ .png → .jpg
parsedPath.ext = '.jpg';
parsedPath.base = parsedPath.name + parsedPath.ext;

const newPath = path.format(parsedPath);
console.log(`Original: ${originalPath}`);
console.log(`New:      ${newPath}`);

// ============================================
// 6. isAbsolute() - Kiểm tra absolute path
// ============================================

console.log('\n=== 6. path.isAbsolute() ===\n');

const paths = [
  '/home/user/file.txt',
  'src/index.js',
  './config.json',
  '../data.txt',
];

for (const p of paths) {
  const isAbs = path.isAbsolute(p);
  const icon = isAbs ? '✓' : '✗';
  console.log(`${icon} isAbsolute("${p}") → ${isAbs}`);
}
