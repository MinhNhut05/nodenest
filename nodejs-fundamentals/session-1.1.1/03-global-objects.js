/**
 * SESSION 1.1.1 - PART 3: Global Objects
 *
 * Node.js cung cấp các objects quan trọng để làm việc
 */

// ============================================
// 1. global - Container cho tất cả global variables
// ============================================
console.log('=== 1. global ===');

// Biến khai báo với var trong file KHÔNG tự động thành global
var myVar = 'hello';
console.log('global.myVar:', global.myVar);  // undefined

// Gán trực tiếp vào global (không khuyến khích)
global.myGlobalVar = 'I am global!';
console.log('global.myGlobalVar:', global.myGlobalVar);  // 'I am global!'

// ============================================
// 2. process - Thông tin về process đang chạy
// ============================================
console.log('\n=== 2. process ===');

// Version
console.log('Node version:', process.version);

// Platform (linux, darwin, win32)
console.log('Platform:', process.platform);

// Architecture (x64, arm64)
console.log('Architecture:', process.arch);

// Current working directory
console.log('CWD:', process.cwd());

// Process ID
console.log('PID:', process.pid);

// Memory usage
console.log('Memory:', process.memoryUsage());

// ============================================
// 3. process.env - Environment Variables
// ============================================
console.log('\n=== 3. process.env ===');

// Xem một số env variables
console.log('HOME:', process.env.HOME);
console.log('USER:', process.env.USER);
console.log('PATH (first 100 chars):', process.env.PATH?.substring(0, 100) + '...');

// Set custom env variable (chỉ trong process này)
process.env.MY_APP_ENV = 'development';
console.log('MY_APP_ENV:', process.env.MY_APP_ENV);

// ============================================
// 4. process.argv - Command Line Arguments
// ============================================
console.log('\n=== 4. process.argv ===');

// argv là array chứa arguments khi chạy script
console.log('process.argv:', process.argv);
/*
  argv[0] = đường dẫn đến node executable
  argv[1] = đường dẫn đến file đang chạy
  argv[2...] = các arguments truyền vào
*/

// Thử chạy: node 03-global-objects.js hello world 123
if (process.argv.length > 2) {
    console.log('Your arguments:', process.argv.slice(2));
} else {
    console.log('Thử chạy: node 03-global-objects.js hello world 123');
}

// ============================================
// 5. __dirname và __filename
// ============================================
console.log('\n=== 5. __dirname & __filename ===');

// __dirname: thư mục chứa file hiện tại (absolute path)
console.log('__dirname:', __dirname);

// __filename: đường dẫn đầy đủ của file hiện tại
console.log('__filename:', __filename);

// So sánh với process.cwd()
console.log('\nSo sánh:');
console.log('__dirname:', __dirname);
console.log('process.cwd():', process.cwd());
/*
  Khác biệt quan trọng:
  - __dirname: Luôn là folder chứa FILE đang thực thi
  - process.cwd(): Folder nơi BẠN chạy lệnh node

  Ví dụ: Bạn đang ở /home và chạy: node /app/src/index.js
  - __dirname = /app/src
  - process.cwd() = /home
*/

// ============================================
// 6. process.exit() - Kết thúc process
// ============================================
console.log('\n=== 6. process.exit() ===');
console.log('process.exit(0) = exit thành công');
console.log('process.exit(1) = exit với lỗi');
console.log('(Không chạy exit() ở đây để code tiếp tục)');

// ============================================
// TÓM TẮT
// ============================================
console.log('\n=== TÓM TẮT GLOBAL OBJECTS ===');
console.log(`
| Object      | Mô tả                                    |
|-------------|------------------------------------------|
| global      | Container cho global variables           |
| process     | Thông tin process (env, argv, exit...)   |
| __dirname   | Folder chứa file hiện tại               |
| __filename  | Full path của file hiện tại             |
| console     | Logging (log, error, warn, table...)     |
| setTimeout  | Timer functions                          |
| setInterval | Timer functions                          |
| Buffer      | Xử lý binary data                        |
`);
