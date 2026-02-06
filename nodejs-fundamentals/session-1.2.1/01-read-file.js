/**
 * SESSION 1.2.1 - fs Module
 * File 01: Đọc file với fs
 *
 * Chạy: node 01-read-file.js
 */

// ============================================
// CÁCH IMPORT fs MODULE
// ============================================

// Promise style (RECOMMENDED - dùng cách này!)
import { readFile } from 'fs/promises';

// Callback style (để so sánh - ít dùng)
import fs from 'fs';

// Lấy __dirname trong ES Modules (sẽ học kỹ ở session path)
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ============================================
// CÁCH 1: PROMISE STYLE (RECOMMENDED ✅)
// ============================================

async function readWithPromise() {
  console.log('=== CÁCH 1: Promise style ===\n');

  try {
    // readFile(path, encoding) → trả về Promise<string>
    // 'utf8' → trả về string (nếu không có → trả về Buffer)
    const filePath = join(__dirname, 'data', 'sample.txt');
    const content = await readFile(filePath, 'utf8');

    console.log('Nội dung file:');
    console.log(content);
    console.log('---');

    // Có thể xử lý content như string bình thường
    const lines = content.split('\n');
    console.log(`File có ${lines.length} dòng`);

  } catch (error) {
    // Các lỗi thường gặp:
    // - ENOENT: File không tồn tại
    // - EACCES: Không có quyền đọc
    // - EISDIR: Path là folder, không phải file

    if (error.code === 'ENOENT') {
      console.error('Lỗi: File không tồn tại!');
    } else {
      console.error('Lỗi khác:', error.message);
    }
  }
}

// ============================================
// CÁCH 2: CALLBACK STYLE (Legacy - ít dùng)
// ============================================

function readWithCallback() {
  console.log('\n=== CÁCH 2: Callback style ===\n');

  const filePath = join(__dirname, 'data', 'sample.txt');

  // fs.readFile(path, encoding, callback)
  // callback: (error, data) => {}
  fs.readFile(filePath, 'utf8', (error, data) => {
    if (error) {
      console.error('Lỗi:', error.message);
      return;
    }

    console.log('Nội dung (callback):');
    console.log(data);
  });

  // CHÚ Ý: Code này chạy TRƯỚC callback!
  console.log('(Dòng này in ra trước nội dung file - vì async)');
}

// ============================================
// CÁCH 3: SYNC STYLE (Tránh dùng ⚠️)
// ============================================

function readWithSync() {
  console.log('\n=== CÁCH 3: Sync style (tránh dùng) ===\n');

  const filePath = join(__dirname, 'data', 'sample.txt');

  try {
    // readFileSync BLOCK event loop!
    // Chỉ dùng khi đọc config lúc app startup
    const content = fs.readFileSync(filePath, 'utf8');

    console.log('Nội dung (sync):');
    console.log(content);

  } catch (error) {
    console.error('Lỗi:', error.message);
  }
}

// ============================================
// ĐỌC FILE KHÔNG CÓ ENCODING (trả về Buffer)
// ============================================

async function readAsBuffer() {
  console.log('\n=== Đọc file không có encoding ===\n');

  const filePath = join(__dirname, 'data', 'sample.txt');

  // Không có 'utf8' → trả về Buffer
  const buffer = await readFile(filePath);

  console.log('Kiểu dữ liệu:', typeof buffer);        // object
  console.log('Là Buffer?:', Buffer.isBuffer(buffer)); // true
  console.log('Buffer:', buffer);
  console.log('---');

  // Convert Buffer → String
  const text = buffer.toString('utf8');
  console.log('Sau khi convert:', text);
}

// ============================================
// CHẠY CÁC VÍ DỤ
// ============================================

async function main() {
  await readWithPromise();

  // Callback style - để demo
  readWithCallback();

  // Đợi 100ms để callback hoàn thành
  await new Promise(resolve => setTimeout(resolve, 100));

  readWithSync();
  await readAsBuffer();
}

main();
