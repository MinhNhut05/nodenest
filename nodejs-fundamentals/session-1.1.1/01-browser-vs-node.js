/**
 * SESSION 1.1.1 - PART 1: Browser vs Node.js
 *
 * Cả Browser và Node.js đều chạy JavaScript, nhưng môi trường khác nhau!
 */

// ============================================
// 1. GLOBAL OBJECT
// ============================================

// Trong Browser: window là global object
// console.log(window);  // Chỉ chạy được trong browser

// Trong Node.js: global là global object
console.log('=== GLOBAL OBJECT ===');
console.log('typeof global:', typeof global);  // object
console.log('global === globalThis:', global === globalThis);  // true (chuẩn hóa ES2020)

// ============================================
// 2. CÁC API CÓ SẴN
// ============================================

console.log('\n=== AVAILABLE APIs ===');

// Browser có: window, document, DOM APIs, fetch, localStorage
// Node.js có: global, process, fs, http, path, os...

// Thử access DOM (sẽ fail trong Node.js)
try {
    console.log(document.getElementById('test'));
} catch (error) {
    console.log('document is not defined - Đúng rồi! Node.js không có DOM');
}

// Thử access process (chỉ có trong Node.js)
console.log('process.version:', process.version);  // Node.js version

// ============================================
// 3. V8 ENGINE
// ============================================

console.log('\n=== V8 ENGINE ===');
// Cả Browser (Chrome) và Node.js đều dùng V8 engine của Google
// V8 biên dịch JavaScript thành machine code

console.log('Node.js versions:', process.versions);
// Bạn sẽ thấy v8 version trong output

// ============================================
// TÓM TẮT
// ============================================
/*
| Aspect          | Browser           | Node.js           |
|-----------------|-------------------|-------------------|
| Global object   | window            | global            |
| DOM APIs        | Có                | Không             |
| File System     | Không             | Có (fs module)    |
| Network         | fetch, XHR        | http, https       |
| Purpose         | UI, client-side   | Server, CLI tools |
*/
