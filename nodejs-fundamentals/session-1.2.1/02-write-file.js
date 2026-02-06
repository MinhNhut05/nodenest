/**
 * SESSION 1.2.1 - fs Module
 * File 02: Ghi file với fs
 *
 * Chạy: node 02-write-file.js
 */

import { writeFile, appendFile, readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// 1. writeFile - Ghi file (OVERWRITE)
// ============================================

async function demoWriteFile() {
  console.log('=== 1. writeFile - Ghi file (overwrite) ===\n');

  const filePath = join(__dirname, 'data', 'output.txt');

  // writeFile(path, content) → tạo file mới hoặc GHI ĐÈ
  // Tương đương Linux: echo "nội dung" > file.txt

  await writeFile(filePath, 'Dong 1: Hello World!\n');
  console.log('Đã ghi file lần 1');

  // Ghi lần 2 → NỘI DUNG CŨ BỊ XÓA!
  await writeFile(filePath, 'Dong 2: Noi dung moi (da ghi de)\n');
  console.log('Đã ghi file lần 2 (ghi đè)');

  // Đọc lại để verify
  const content = await readFile(filePath, 'utf8');
  console.log('Nội dung file sau khi ghi:');
  console.log(content);
}

// ============================================
// 2. appendFile - Thêm vào cuối file
// ============================================

async function demoAppendFile() {
  console.log('=== 2. appendFile - Thêm vào cuối ===\n');

  const logPath = join(__dirname, 'data', 'app.log');

  // appendFile(path, content) → thêm vào CUỐI file
  // Tương đương Linux: echo "nội dung" >> file.txt
  // Nếu file chưa tồn tại → tự động tạo mới

  const timestamp = new Date().toISOString();

  await appendFile(logPath, `[${timestamp}] App started\n`);
  console.log('Đã append log 1');

  await appendFile(logPath, `[${timestamp}] User logged in\n`);
  console.log('Đã append log 2');

  await appendFile(logPath, `[${timestamp}] User logged out\n`);
  console.log('Đã append log 3');

  // Đọc lại để verify
  const content = await readFile(logPath, 'utf8');
  console.log('\nNội dung file log:');
  console.log(content);
}

// ============================================
// 3. Ghi JSON file
// ============================================

async function demoWriteJSON() {
  console.log('=== 3. Ghi JSON file ===\n');

  const jsonPath = join(__dirname, 'data', 'users.json');

  const users = [
    { id: 1, name: 'Leminho', role: 'developer' },
    { id: 2, name: 'John', role: 'designer' },
    { id: 3, name: 'Jane', role: 'manager' }
  ];

  // JSON.stringify(data, null, 2) → format đẹp với 2 spaces
  const jsonString = JSON.stringify(users, null, 2);

  await writeFile(jsonPath, jsonString);
  console.log('Đã ghi file JSON');

  // Đọc lại và parse
  const content = await readFile(jsonPath, 'utf8');
  const parsed = JSON.parse(content);

  console.log('Đọc lại từ file:');
  console.log(parsed);
  console.log('User đầu tiên:', parsed[0].name);
}

// ============================================
// 4. writeFile với Options
// ============================================

async function demoWriteOptions() {
  console.log('\n=== 4. writeFile với options ===\n');

  const filePath = join(__dirname, 'data', 'options-demo.txt');

  // Options phổ biến:
  // - encoding: 'utf8' (default)
  // - flag: 'w' (write - default), 'a' (append), 'wx' (write exclusive)

  // flag: 'wx' → chỉ ghi nếu file CHƯA tồn tại (tránh ghi đè nhầm)
  try {
    await writeFile(filePath, 'Noi dung test\n', { flag: 'wx' });
    console.log('Tạo file mới thành công');
  } catch (error) {
    if (error.code === 'EEXIST') {
      console.log('File đã tồn tại, không ghi đè (flag: wx)');
    }
  }

  // flag: 'a' → tương đương appendFile
  await writeFile(filePath, 'Them dong moi\n', { flag: 'a' });
  console.log('Đã append với flag: a');
}

// ============================================
// BẢNG TÓM TẮT
// ============================================

function printSummary() {
  console.log('\n' + '='.repeat(50));
  console.log('BẢNG TÓM TẮT - GHI FILE');
  console.log('='.repeat(50));
  console.log(`
┌──────────────────┬────────────────────────────────┐
│ Method           │ Tác dụng                       │
├──────────────────┼────────────────────────────────┤
│ writeFile()      │ Ghi đè toàn bộ file            │
│ appendFile()     │ Thêm vào cuối file             │
│ flag: 'w'        │ Write (default) - ghi đè       │
│ flag: 'a'        │ Append - thêm cuối             │
│ flag: 'wx'       │ Write exclusive - lỗi nếu có  │
└──────────────────┴────────────────────────────────┘

So sánh với Linux:
- writeFile  → echo "text" > file   (ghi đè)
- appendFile → echo "text" >> file  (thêm cuối)
`);
}

// ============================================
// CHẠY CÁC VÍ DỤ
// ============================================

async function main() {
  try {
    await demoWriteFile();
    console.log('\n' + '-'.repeat(50) + '\n');

    await demoAppendFile();
    console.log('\n' + '-'.repeat(50) + '\n');

    await demoWriteJSON();

    await demoWriteOptions();

    printSummary();

  } catch (error) {
    console.error('Lỗi:', error.message);
  }
}

main();
