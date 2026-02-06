/**
 * SESSION 1.2.4 - events Module
 * File 04: Error Handling với Events
 *
 * Chạy: node 04-error-handling.js
 */

import { EventEmitter } from 'events';

// ============================================
// 1. ERROR EVENT - ĐẶC BIỆT!
// ============================================

console.log('=== 1. Error Event - Đặc biệt ===\n');

const emitter = new EventEmitter();

// ⚠️ QUAN TRỌNG: Nếu emit 'error' mà KHÔNG có listener
// → Node.js sẽ THROW exception và crash app!

// ✅ LUÔN đăng ký error handler
emitter.on('error', (err) => {
  console.log('🔴 Error caught:', err.message);
});

// Giờ có thể emit error an toàn
emitter.emit('error', new Error('Something went wrong'));
emitter.emit('error', new Error('Another error'));

console.log('✅ App vẫn chạy bình thường!\n');

// ============================================
// 2. DEMO: KHÔNG CÓ ERROR HANDLER
// ============================================

console.log('=== 2. Demo: Không có error handler ===\n');

const badEmitter = new EventEmitter();

// Uncomment dòng dưới để thấy app crash:
// badEmitter.emit('error', new Error('This will crash!'));

console.log('(Đã comment để tránh crash)\n');

// ============================================
// 3. CUSTOM CLASS VỚI ERROR HANDLING
// ============================================

console.log('=== 3. Custom Class với Error Handling ===\n');

class Database extends EventEmitter {
  constructor(connectionString) {
    super();
    this.connectionString = connectionString;
    this.connected = false;
  }

  connect() {
    console.log('Connecting to database...');

    // Giả lập connection
    setTimeout(() => {
      // Giả lập: 50% thành công, 50% lỗi
      const success = Math.random() > 0.5;

      if (success) {
        this.connected = true;
        this.emit('connected', this.connectionString);
      } else {
        this.emit('error', new Error('Connection timeout'));
      }
    }, 1000);
  }

  query(sql) {
    if (!this.connected) {
      // Emit error thay vì throw
      this.emit('error', new Error('Not connected to database'));
      return;
    }

    console.log('Executing query:', sql);
    this.emit('query', sql);

    // Giả lập query result
    setTimeout(() => {
      this.emit('result', { rows: [], sql });
    }, 500);
  }

  disconnect() {
    this.connected = false;
    this.emit('disconnected');
  }
}

// Sử dụng
const db = new Database('mongodb://localhost:27017');

// ✅ Đăng ký error handler TRƯỚC khi làm gì khác
db.on('error', (err) => {
  console.log('🔴 DB Error:', err.message);
});

db.on('connected', (connStr) => {
  console.log('✅ Connected to:', connStr);

  // Thử query
  db.query('SELECT * FROM users');
});

db.on('query', (sql) => {
  console.log('📝 Query executed');
});

db.on('result', (data) => {
  console.log('📊 Got result for:', data.sql);
});

db.on('disconnected', () => {
  console.log('👋 Disconnected');
});

// Thử connect (có thể thành công hoặc lỗi)
db.connect();

// ============================================
// 4. TIP: CAPTUREREJECTIONS
// ============================================

console.log('\n=== 4. Tip: captureRejections ===\n');

// Trong Node.js 12.16+, có thể bắt Promise rejections
class AsyncEmitter extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }
}

const asyncEm = new AsyncEmitter();

// Error handler sẽ bắt cả Promise rejections
asyncEm.on('error', (err) => {
  console.log('Async error caught:', err.message);
});

console.log('(captureRejections là tính năng nâng cao)\n');

// ============================================
// TÓM TẮT
// ============================================

setTimeout(() => {
  console.log('\n' + '='.repeat(55));
  console.log('TÓM TẮT - ERROR HANDLING');
  console.log('='.repeat(55));
  console.log(`
⚠️  QUY TẮC VÀNG: Luôn đăng ký error handler!

emitter.on('error', (err) => {
  console.error('Error:', err.message);
  // Log, alert, cleanup...
});

Nếu emit('error') mà không có listener → App CRASH!
`);
}, 2000);
