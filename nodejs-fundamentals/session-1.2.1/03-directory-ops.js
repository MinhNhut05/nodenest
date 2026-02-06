/**
 * SESSION 1.2.1 - fs Module
 * File 03: Thao tác với thư mục (Directory Operations)
 *
 * Chạy: node 03-directory-ops.js
 */

import { mkdir, readdir, rm, rename } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// 1. mkdir - Tạo thư mục
// ============================================

async function demoMkdir() {
  console.log('=== 1. mkdir - Tạo thư mục ===\n');

  const baseDir = join(__dirname, 'data');

  // Tạo folder đơn
  const simpleDir = join(baseDir, 'simple-folder');
  try {
    await mkdir(simpleDir);
    console.log('Đã tạo:', simpleDir);
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('Folder đã tồn tại:', simpleDir);
    }
  }

  // Tạo nested folders với recursive: true
  // Tương đương Linux: mkdir -p path/to/nested/folder
  const nestedDir = join(baseDir, 'level1', 'level2', 'level3');
  await mkdir(nestedDir, { recursive: true });
  console.log('Đã tạo nested:', nestedDir);

  // recursive: true cũng không lỗi nếu folder đã tồn tại
  await mkdir(nestedDir, { recursive: true });
  console.log('Gọi lại mkdir recursive → không lỗi');
}

// ============================================
// 2. readdir - Liệt kê files trong thư mục
// ============================================

async function demoReaddir() {
  console.log('\n=== 2. readdir - Liệt kê files ===\n');

  const dataDir = join(__dirname, 'data');

  // Cách 1: Chỉ lấy tên files/folders
  // Tương đương Linux: ls
  const items = await readdir(dataDir);
  console.log('Danh sách trong data/:');
  items.forEach(item => console.log('  -', item));

  // Cách 2: Lấy thêm thông tin với withFileTypes
  // Tương đương Linux: ls -la
  console.log('\nVới withFileTypes:');
  const entries = await readdir(dataDir, { withFileTypes: true });

  for (const entry of entries) {
    const type = entry.isDirectory() ? '[DIR]' : '[FILE]';
    console.log(`  ${type} ${entry.name}`);
  }

  // Lọc chỉ files hoặc chỉ folders
  const onlyFiles = entries.filter(e => e.isFile());
  const onlyDirs = entries.filter(e => e.isDirectory());

  console.log(`\nTổng: ${onlyFiles.length} files, ${onlyDirs.length} folders`);
}

// ============================================
// 3. rm - Xóa file/folder
// ============================================

async function demoRm() {
  console.log('\n=== 3. rm - Xóa file/folder ===\n');

  const baseDir = join(__dirname, 'data');

  // Tạo folder để test xóa
  const testDir = join(baseDir, 'to-delete');
  const nestedTest = join(testDir, 'nested', 'deep');
  await mkdir(nestedTest, { recursive: true });
  console.log('Đã tạo folder test:', testDir);

  // Xóa folder rỗng - vẫn cần recursive trong Node.js mới
  await rm(nestedTest, { recursive: true });
  console.log('Đã xóa folder rỗng (deep)');

  // Xóa folder có nội dung → cần recursive: true
  // Tương đương Linux: rm -rf folder
  await mkdir(nestedTest, { recursive: true }); // Tạo lại
  await rm(testDir, { recursive: true });
  console.log('Đã xóa folder có nội dung (với recursive)');

  // force: true → không lỗi nếu file/folder không tồn tại
  await rm(join(baseDir, 'not-exist'), { force: true });
  console.log('rm với force: true → không lỗi dù không tồn tại');
}

// ============================================
// 4. rename - Đổi tên / Di chuyển
// ============================================

async function demoRename() {
  console.log('\n=== 4. rename - Đổi tên / Di chuyển ===\n');

  const baseDir = join(__dirname, 'data');

  // Tạo folder để test
  const oldName = join(baseDir, 'old-name');
  const newName = join(baseDir, 'new-name');

  await mkdir(oldName, { recursive: true });
  console.log('Tạo folder:', oldName);

  // Đổi tên folder
  // Tương đương Linux: mv old-name new-name
  await rename(oldName, newName);
  console.log('Đổi tên thành:', newName);

  // Cleanup
  await rm(newName, { recursive: true });
  console.log('Đã xóa folder test');
}

// ============================================
// BẢNG TÓM TẮT
// ============================================

function printSummary() {
  console.log('\n' + '='.repeat(55));
  console.log('BẢNG TÓM TẮT - DIRECTORY OPERATIONS');
  console.log('='.repeat(55));
  console.log(`
┌─────────────────────────────────┬─────────────────────┐
│ Node.js                         │ Linux equivalent    │
├─────────────────────────────────┼─────────────────────┤
│ mkdir('dir')                    │ mkdir dir           │
│ mkdir('a/b/c', {recursive:true})│ mkdir -p a/b/c      │
│ readdir('dir')                  │ ls dir              │
│ readdir('dir', {withFileTypes}) │ ls -la dir          │
│ rm('file')                      │ rm file             │
│ rm('dir', {recursive: true})    │ rm -rf dir          │
│ rm('x', {force: true})          │ rm -f x             │
│ rename('old', 'new')            │ mv old new          │
└─────────────────────────────────┴─────────────────────┘
`);
}

// ============================================
// CHẠY CÁC VÍ DỤ
// ============================================

async function main() {
  try {
    await demoMkdir();
    await demoReaddir();
    await demoRm();
    await demoRename();
    printSummary();

  } catch (error) {
    console.error('Lỗi:', error.message);
    console.error(error.stack);
  }
}

main();
