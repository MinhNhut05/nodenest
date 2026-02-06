/**
 * SESSION 1.3.1 - Exit Codes
 * Mã thoát của process
 *
 * Exit code cho biết process kết thúc thành công hay thất bại
 * 0 = success, khác 0 = error
 */

// ============================================
// 1. EXIT CODES CƠ BẢN
// ============================================

console.log('=== Exit Codes Basics ===\n');

// Exit code phổ biến:
// 0 - Success (thành công)
// 1 - General error (lỗi chung)
// 2 - Misuse of command (sai cú pháp)
// 126 - Permission denied
// 127 - Command not found
// 130 - Ctrl+C (SIGINT)

console.log('Current exit code:', process.exitCode || 0);

// ============================================
// 2. CÁCH SET EXIT CODE
// ============================================

console.log('\n=== Setting Exit Code ===\n');

// Cách 1: process.exit(code) - thoát ngay lập tức
// process.exit(0);  // Success
// process.exit(1);  // Error

// Cách 2: process.exitCode - set code nhưng không thoát ngay
// Cho phép cleanup trước khi thoát
process.exitCode = 0;
console.log('Exit code set to:', process.exitCode);

// ============================================
// 3. VÍ DỤ: VALIDATION SCRIPT
// ============================================

console.log('\n=== Validation Example ===\n');

function validateConfig() {
  const errors = [];

  // Giả sử check các điều kiện
  if (!process.env.API_KEY) {
    errors.push('Missing API_KEY');
  }

  if (!process.env.DATABASE_URL) {
    errors.push('Missing DATABASE_URL');
  }

  if (errors.length > 0) {
    console.error('Validation failed:');
    errors.forEach((e) => console.error(`  - ${e}`));
    return false;
  }

  console.log('Validation passed!');
  return true;
}

const isValid = validateConfig();

// Set exit code based on validation
process.exitCode = isValid ? 0 : 1;

console.log('\nFinal exit code:', process.exitCode);

// ============================================
// 4. EXIT EVENTS
// ============================================

console.log('\n=== Exit Events ===\n');

// 'beforeExit' - trước khi thoát (có thể async)
process.on('beforeExit', (code) => {
  console.log('[beforeExit] Code:', code);
  // Có thể làm async work ở đây
  // Nếu có work mới, process sẽ chưa thoát
});

// 'exit' - khi thoát (chỉ sync, không async)
process.on('exit', (code) => {
  console.log('[exit] Process ending with code:', code);
  // CHỈ sync code ở đây
  // Async code sẽ KHÔNG chạy
});

// ============================================
// 5. PATTERN: GRACEFUL SHUTDOWN
// ============================================

console.log('\n=== Graceful Shutdown Pattern ===\n');

// Bắt signal Ctrl+C
process.on('SIGINT', () => {
  console.log('\n[SIGINT] Received Ctrl+C');
  console.log('Cleaning up...');

  // Cleanup: close DB connections, finish writes, etc.
  setTimeout(() => {
    console.log('Cleanup done. Exiting.');
    process.exit(0);
  }, 100);
});

// Bắt signal terminate (kill command)
process.on('SIGTERM', () => {
  console.log('\n[SIGTERM] Received terminate signal');
  process.exit(0);
});

console.log('Press Ctrl+C to test SIGINT handling...');
console.log('(hoặc đợi 2 giây để tự thoát)\n');

// Auto exit after 2 seconds for demo
setTimeout(() => {
  console.log('Auto exiting...');
}, 2000);

// ============================================
// THỬ CHẠY:
// ============================================
// node 03-exit-codes.js
// API_KEY=test DATABASE_URL=test node 03-exit-codes.js
// node 03-exit-codes.js  (rồi bấm Ctrl+C)
//
// Check exit code sau khi chạy:
// node 03-exit-codes.js; echo "Exit code: $?"
