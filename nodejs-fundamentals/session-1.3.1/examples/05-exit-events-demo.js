/**
 * DEMO: beforeExit vs exit
 *
 * Sự khác biệt quan trọng:
 * - beforeExit: CÓ THỂ chạy async code
 * - exit: CHỈ chạy sync code (async bị bỏ qua)
 */

console.log('=== Demo beforeExit vs exit ===\n');

// ============================================
// 1. EVENT 'exit' - CHỈ SYNC
// ============================================

process.on('exit', (code) => {
  console.log('[exit] Process đang thoát với code:', code);

  // ❌ ASYNC CODE SẼ KHÔNG CHẠY
  setTimeout(() => {
    console.log('[exit] Async code - BẠN SẼ KHÔNG THẤY DÒNG NÀY!');
  }, 100);

  // ✅ SYNC CODE CHẠY BÌNH THƯỜNG
  console.log('[exit] Sync code - Dòng này hiện bình thường');

  // Thường dùng để: log cuối cùng, cleanup đơn giản
});

// ============================================
// 2. EVENT 'beforeExit' - CÓ THỂ ASYNC
// ============================================

let beforeExitCount = 0;

process.on('beforeExit', (code) => {
  beforeExitCount++;
  console.log(`[beforeExit] Lần ${beforeExitCount}, code: ${code}`);

  // ✅ ASYNC CODE CHẠY ĐƯỢC
  // NHƯNG: nếu có async work → process CHƯA thoát
  // → beforeExit sẽ được gọi LẠI khi async xong

  if (beforeExitCount === 1) {
    console.log('[beforeExit] Bắt đầu async work...');

    // Async work: setTimeout
    setTimeout(() => {
      console.log('[beforeExit] Async work HOÀN THÀNH!');
      // Sau khi xong → beforeExit được gọi LẠI (lần 2)
    }, 500);
  }

  if (beforeExitCount === 2) {
    console.log('[beforeExit] Không có work mới → process sẽ thoát');
    // Không thêm async work → process thoát
  }

  // Tránh vòng lặp vô hạn
  if (beforeExitCount > 3) {
    console.log('[beforeExit] Dừng để tránh loop vô hạn');
    process.exit(0);
  }
});

// ============================================
// 3. MAIN CODE
// ============================================

console.log('[main] Bắt đầu chương trình');
console.log('[main] Làm một số việc...');

// Simulate some work
for (let i = 0; i < 3; i++) {
  console.log(`[main] Đang xử lý bước ${i + 1}...`);
}

console.log('[main] Xong! Chờ process thoát...\n');

// ============================================
// KẾT QUẢ KHI CHẠY:
// ============================================
/*
=== Demo beforeExit vs exit ===

[main] Bắt đầu chương trình
[main] Làm một số việc...
[main] Đang xử lý bước 1...
[main] Đang xử lý bước 2...
[main] Đang xử lý bước 3...
[main] Xong! Chờ process thoát...

[beforeExit] Lần 1, code: 0           ← beforeExit lần 1
[beforeExit] Bắt đầu async work...
[beforeExit] Async work HOÀN THÀNH!   ← Async chạy được!
[beforeExit] Lần 2, code: 0           ← beforeExit lần 2 (vì có async)
[beforeExit] Không có work mới → process sẽ thoát
[exit] Process đang thoát với code: 0 ← exit event
[exit] Sync code - Dòng này hiện bình thường

(Không thấy dòng "[exit] Async code..." vì async bị bỏ qua)
*/

// ============================================
// THỬ CHẠY:
// ============================================
// node 05-exit-events-demo.js
