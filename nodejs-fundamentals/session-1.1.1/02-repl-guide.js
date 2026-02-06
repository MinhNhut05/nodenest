/**
 * SESSION 1.1.1 - PART 2: REPL (Read-Eval-Print-Loop)
 *
 * REPL là môi trường interactive để test code nhanh
 */

console.log('=== REPL GUIDE ===');
console.log(`
Cách mở REPL:
  $ node          (gõ 'node' trong terminal, không có arguments)

Các lệnh hữu ích trong REPL:
  .help           - Xem tất cả commands
  .exit           - Thoát REPL (hoặc Ctrl+D)
  .clear          - Xóa context
  .save file.js   - Lưu session vào file
  .load file.js   - Load file vào REPL

Phím tắt:
  Tab             - Auto-complete (thử gõ 'process.' rồi Tab)
  Up/Down Arrow   - Xem lịch sử commands
  Ctrl+C          - Cancel lệnh đang gõ
  Ctrl+D          - Thoát REPL

Thử trong REPL:
  > 1 + 1
  2
  > const x = 10
  undefined
  > x * 2
  20
  > console.log('Hello')
  Hello
  undefined
  > process.version
  'v20.x.x'
`);

// ============================================
// THỰC HÀNH
// ============================================
console.log('\n=== THỬ NGAY ===');
console.log('Mở terminal mới và chạy các lệnh sau:');
console.log('1. node                    # Mở REPL');
console.log('2. .help                   # Xem commands');
console.log('3. process.               # Rồi nhấn Tab để xem auto-complete');
console.log('4. global.                # Rồi nhấn Tab');
console.log('5. .exit                   # Thoát');
