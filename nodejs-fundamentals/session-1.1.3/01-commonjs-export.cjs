/**
 * SESSION 1.1.3 - PART 1: CommonJS (CJS)
 *
 * CommonJS là module system MẶC ĐỊNH của Node.js
 * File extension: .js hoặc .cjs
 */

// ============================================
// 1. EXPORT TRONG COMMONJS
// ============================================

// Cách 1: Gán từng property vào exports
exports.name = 'CommonJS Module';
exports.version = '1.0.0';

exports.greet = function(name) {
    return `Hello, ${name}!`;
};

exports.add = function(a, b) {
    return a + b;
};

// Cách 2: Gán object vào module.exports (thường dùng hơn)
// LƯU Ý: Nếu dùng cách này, các exports ở trên sẽ bị GHI ĐÈ!

// module.exports = {
//     name: 'CommonJS Module',
//     version: '1.0.0',
//     greet: function(name) {
//         return `Hello, ${name}!`;
//     },
//     add: function(a, b) {
//         return a + b;
//     }
// };

// Cách 3: Export một function/class duy nhất
// module.exports = function(name) {
//     return `Hello, ${name}!`;
// };

// ============================================
// 2. SỰ KHÁC BIỆT exports vs module.exports
// ============================================

/*
exports và module.exports ban đầu trỏ đến CÙNG object:

    exports ──────┐
                  ├──► { }  (empty object)
    module.exports┘

Khi dùng exports.xxx = ...:
    → Thêm property vào object chung
    → OK!

Khi dùng exports = { ... }:
    → Tạo object MỚI, exports không còn trỏ đến module.exports
    → SAI! Node.js chỉ export module.exports

Khi dùng module.exports = { ... }:
    → Ghi đè object mà module.exports trỏ đến
    → exports vẫn trỏ đến object cũ (bị bỏ)
    → OK, nhưng exports không còn tác dụng
*/

// ============================================
// 3. GLOBAL OBJECTS TRONG CJS
// ============================================

console.log('=== CommonJS Global Objects ===\n');

// Các biến này CÓ SẴN trong CommonJS:
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('module.id:', module.id);
console.log('module.filename:', module.filename);

// Xem exports hiện tại
console.log('\nCurrent exports:', exports);
