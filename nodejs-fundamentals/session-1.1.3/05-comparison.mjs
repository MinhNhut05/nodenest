/**
 * SESSION 1.1.3 - PART 5: So sánh CommonJS vs ES Modules
 */

console.log('=== COMMONJS vs ES MODULES ===\n');

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMMONJS vs ES MODULES                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  Aspect              │  CommonJS (CJS)         │  ES Modules (ESM)          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Syntax Export       │  module.exports = {}    │  export / export default   │
│                      │  exports.xxx = ...      │                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  Syntax Import       │  require('./file')      │  import x from './file.js' │
├─────────────────────────────────────────────────────────────────────────────┤
│  Loading             │  Synchronous (đồng bộ)  │  Asynchronous (bất đồng bộ)│
├─────────────────────────────────────────────────────────────────────────────┤
│  Top-level await     │  ❌ Không               │  ✅ Có                     │
├─────────────────────────────────────────────────────────────────────────────┤
│  __dirname           │  ✅ Có sẵn              │  ❌ Phải tự tạo            │
│  __filename          │                         │  (dùng import.meta.url)    │
├─────────────────────────────────────────────────────────────────────────────┤
│  File extension      │  .js, .cjs              │  .js, .mjs                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  package.json        │  "type": "commonjs"     │  "type": "module"          │
│  (hoặc không có)     │  (mặc định)             │                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  File path in import │  Có thể bỏ extension    │  PHẢI có extension         │
│                      │  require('./file')      │  import './file.js'        │
├─────────────────────────────────────────────────────────────────────────────┤
│  Dynamic import      │  require(variable)      │  await import(variable)    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Dùng khi            │  Legacy projects        │  Projects mới              │
│                      │  Node.js scripts        │  Frontend & Backend        │
└─────────────────────────────────────────────────────────────────────────────┘
`);

console.log(`
=== KHI NÀO DÙNG CÁI NÀO? ===

✅ DÙNG ES MODULES khi:
   - Tạo project mới
   - Muốn dùng top-level await
   - Cần tương thích với frontend code
   - Muốn tree-shaking (loại bỏ code không dùng)

✅ DÙNG COMMONJS khi:
   - Project cũ đã dùng CJS
   - Một số packages chỉ hỗ trợ CJS
   - Scripts nhỏ, không cần config

=== CÁCH CONFIG ===

1. Dùng ES Modules cho toàn project:
   {
     "type": "module"    ← Thêm vào package.json
   }

2. Dùng CommonJS cho toàn project:
   {
     "type": "commonjs"  ← Hoặc không cần (mặc định)
   }

3. Mix cả hai trong cùng project:
   - File .mjs → luôn là ES Module
   - File .cjs → luôn là CommonJS
   - File .js → theo "type" trong package.json
`);
