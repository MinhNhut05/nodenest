/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║           SESSION 1.3.1 - TỔNG KẾT LÝ THUYẾT CHI TIẾT                ║
 * ║                    Process Object trong Node.js                       ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 *
 * File này KHÔNG chạy được, chỉ để đọc và hiểu lý thuyết.
 * Xem từng file riêng để chạy demo.
 */

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 1. PROCESS LÀ GÌ?                                                     ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * PROCESS = Một chương trình đang chạy trên máy tính
 *
 * Khi bạn chạy `node script.js`, hệ điều hành tạo ra một PROCESS.
 * Process này có:
 * - PID (Process ID): số định danh duy nhất
 * - Memory: bộ nhớ riêng
 * - Environment: các biến môi trường
 * - I/O Streams: stdin, stdout, stderr
 *
 * Trong Node.js, `process` là GLOBAL OBJECT (không cần import)
 * cho phép tương tác với process hiện tại.
 */

// Ví dụ:
// console.log(process.pid);     // ID của process
// console.log(process.version); // Version của Node.js
// console.log(process.cwd());   // Current Working Directory

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 2. PROCESS.ENV - BIẾN MÔI TRƯỜNG                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * process.env = Object chứa TẤT CẢ biến môi trường
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ BIẾN MÔI TRƯỜNG LÀ GÌ?                                               │
 * │                                                                       │
 * │ Là các cặp KEY=VALUE được hệ điều hành hoặc user set trước khi      │
 * │ chạy chương trình. Dùng để:                                          │
 * │ - Cấu hình ứng dụng (port, database URL, API keys...)               │
 * │ - Phân biệt môi trường (development, staging, production)           │
 * │ - Bảo mật (không hardcode secrets trong code)                       │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * BIẾN CÓ SẴN (System):
 * - process.env.USER     → username đang đăng nhập
 * - process.env.HOME     → đường dẫn thư mục home
 * - process.env.PATH     → các đường dẫn tìm executable
 * - process.env.SHELL    → shell đang dùng (bash, zsh...)
 *
 * BIẾN TỰ ĐẶT (Custom):
 * - process.env.NODE_ENV → môi trường (development, production)
 * - process.env.PORT     → port server chạy
 * - process.env.API_KEY  → key để gọi API
 */

// CÁCH SET BIẾN MÔI TRƯỜNG:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ Cách 1: Set khi chạy command                                         │
// │   NODE_ENV=production PORT=3000 node app.js                         │
// │           ^               ^                                          │
// │           |               └─ Biến thứ 2                              │
// │           └─ Biến thứ 1                                              │
// └─────────────────────────────────────────────────────────────────────┘
// ┌─────────────────────────────────────────────────────────────────────┐
// │ Cách 2: Dùng file .env (với package dotenv)                         │
// │   1. Tạo file .env:                                                  │
// │      NODE_ENV=production                                             │
// │      PORT=3000                                                       │
// │   2. Trong code:                                                     │
// │      require('dotenv').config();                                     │
// └─────────────────────────────────────────────────────────────────────┘
// ┌─────────────────────────────────────────────────────────────────────┐
// │ Cách 3: Export trong terminal (session scope)                        │
// │   export NODE_ENV=production                                         │
// │   node app.js                                                        │
// └─────────────────────────────────────────────────────────────────────┘

// PATTERN: DEFAULT VALUES
// ┌─────────────────────────────────────────────────────────────────────┐
// │ const port = process.env.PORT || 3000;                               │
// │                               ^                                      │
// │                               └─ Nếu PORT không set → dùng 3000     │
// │                                                                       │
// │ const port = process.env.PORT ?? 3000;                               │
// │                               ^                                      │
// │                               └─ Chỉ dùng 3000 nếu PORT là null/undefined │
// │                                  (PORT=0 vẫn giữ 0)                  │
// └─────────────────────────────────────────────────────────────────────┘

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 3. PROCESS.ARGV - THAM SỐ DÒNG LỆNH                                   ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * process.argv = Array chứa các arguments khi chạy node
 *
 * Ví dụ: node script.js hello world --verbose
 *
 * process.argv = [
 *   '/usr/bin/node',         // argv[0]: đường dẫn tới node
 *   '/path/to/script.js',    // argv[1]: đường dẫn tới file
 *   'hello',                 // argv[2]: argument đầu tiên của user
 *   'world',                 // argv[3]: argument thứ 2
 *   '--verbose'              // argv[4]: flag
 * ]
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ LƯU Ý QUAN TRỌNG:                                                    │
 * │ - argv[0] và argv[1] luôn là node path và script path               │
 * │ - User arguments bắt đầu từ argv[2]                                  │
 * │ - Thường dùng: const args = process.argv.slice(2);                  │
 * └─────────────────────────────────────────────────────────────────────┘
 */

// CÁC LOẠI ARGUMENTS:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ 1. POSITIONAL ARGUMENTS (theo vị trí)                                │
// │    node script.js create user                                        │
// │                    ^      ^                                          │
// │                    |      └─ target = "user"                         │
// │                    └─ action = "create"                              │
// └─────────────────────────────────────────────────────────────────────┘
// ┌─────────────────────────────────────────────────────────────────────┐
// │ 2. FLAG ARGUMENTS (với -- hoặc -)                                    │
// │    node script.js --name John --age 25 -v                           │
// │                   ^           ^        ^                             │
// │                   |           |        └─ short flag (verbose)       │
// │                   |           └─ flag với value                      │
// │                   └─ flag với value                                  │
// └─────────────────────────────────────────────────────────────────────┘
// ┌─────────────────────────────────────────────────────────────────────┐
// │ 3. KEY=VALUE FORMAT                                                  │
// │    node script.js --port=3000                                        │
// │                         ^                                            │
// │                         └─ Giá trị gắn liền với key                  │
// └─────────────────────────────────────────────────────────────────────┘

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 4. EXIT CODES - MÃ THOÁT                                              ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * Exit code = Số nguyên cho biết process kết thúc như thế nào
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ EXIT CODE    │ Ý NGHĨA                                               │
 * ├──────────────┼───────────────────────────────────────────────────────┤
 * │ 0            │ SUCCESS - Thành công                                  │
 * │ 1            │ GENERAL ERROR - Lỗi chung                             │
 * │ 2            │ MISUSE - Sai cú pháp/cách dùng                        │
 * │ 126          │ PERMISSION - Không có quyền thực thi                  │
 * │ 127          │ NOT FOUND - Không tìm thấy command                    │
 * │ 130          │ SIGINT - User bấm Ctrl+C                              │
 * └──────────────┴───────────────────────────────────────────────────────┘
 *
 * TẠI SAO CẦN EXIT CODE?
 * - Script automation: if command1 succeeds, run command2
 * - CI/CD pipelines: build fail → stop deployment
 * - Error handling: biết được script kết thúc ra sao
 */

// CÁCH SET EXIT CODE:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ Cách 1: process.exit(code) - Thoát NGAY LẬP TỨC                      │
// │   process.exit(0);  // Thành công → thoát ngay                       │
// │   process.exit(1);  // Lỗi → thoát ngay                              │
// │                                                                       │
// │ ⚠️ CẢNH BÁO: Code sau process.exit() KHÔNG CHẠY                      │
// └─────────────────────────────────────────────────────────────────────┘
// ┌─────────────────────────────────────────────────────────────────────┐
// │ Cách 2: process.exitCode = code - Set code nhưng KHÔNG thoát ngay   │
// │   process.exitCode = 1;  // Set code                                 │
// │   // ... cleanup code vẫn chạy ...                                   │
// │   // Process thoát khi hết việc                                      │
// │                                                                       │
// │ ✅ KHUYẾN NGHỊ: Dùng cách này để có thể cleanup trước khi thoát      │
// └─────────────────────────────────────────────────────────────────────┘

// EXIT EVENTS:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ process.on('beforeExit', (code) => { ... })                          │
// │   - Chạy TRƯỚC khi process thoát                                     │
// │   - CÓ THỂ làm async work                                            │
// │   - Nếu có work mới → process chưa thoát                             │
// └─────────────────────────────────────────────────────────────────────┘
// ┌─────────────────────────────────────────────────────────────────────┐
// │ process.on('exit', (code) => { ... })                                │
// │   - Chạy KHI process thoát                                           │
// │   - CHỈ sync code (async KHÔNG chạy)                                 │
// │   - Dùng để log, không làm việc nặng                                 │
// └─────────────────────────────────────────────────────────────────────┘

// SIGNALS:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ SIGINT  (Ctrl+C)  → User muốn dừng process                           │
// │ SIGTERM (kill)    → Hệ thống/user muốn terminate process             │
// │                                                                       │
// │ process.on('SIGINT', () => {                                         │
// │   console.log('Ctrl+C pressed');                                     │
// │   // Cleanup: đóng DB, save data, etc.                               │
// │   process.exit(0);                                                   │
// │ });                                                                   │
// └─────────────────────────────────────────────────────────────────────┘

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 5. STDIN/STDOUT/STDERR - I/O STREAMS                                  ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * I/O Streams = Các "kênh" để đọc/ghi dữ liệu
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ STREAM       │ HƯỚNG    │ MÔ TẢ                                      │
 * ├──────────────┼──────────┼────────────────────────────────────────────┤
 * │ stdin        │ INPUT    │ Đọc dữ liệu từ user/pipe                   │
 * │ stdout       │ OUTPUT   │ Ghi output bình thường                     │
 * │ stderr       │ OUTPUT   │ Ghi error/warning                          │
 * └──────────────┴──────────┴────────────────────────────────────────────┘
 *
 * HÌNH DUNG:
 *
 *   ┌─────────┐      stdin       ┌─────────────┐
 *   │Keyboard │ ───────────────▶ │             │
 *   └─────────┘                  │   Node.js   │
 *                                │   Process   │
 *   ┌─────────┐      stdout      │             │
 *   │Terminal │ ◀─────────────── │             │
 *   └─────────┘                  │             │
 *                                │             │
 *   ┌─────────┐      stderr      │             │
 *   │Terminal │ ◀─────────────── │             │
 *   └─────────┘                  └─────────────┘
 */

// STDOUT VS STDERR:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ console.log('Hello')     → Ghi vào stdout                            │
// │ console.error('Error')   → Ghi vào stderr                            │
// │                                                                       │
// │ process.stdout.write()   → Ghi trực tiếp (không có \n)               │
// │ process.stderr.write()   → Ghi trực tiếp (không có \n)               │
// │                                                                       │
// │ TẠI SAO TÁCH RIÊNG?                                                  │
// │ → Có thể redirect riêng: node app.js > output.txt 2> errors.txt     │
// │   Output bình thường → output.txt                                    │
// │   Lỗi → errors.txt                                                   │
// └─────────────────────────────────────────────────────────────────────┘

// CONSOLE.LOG VS STDOUT.WRITE:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ console.log('Hello')                                                 │
// │   → In "Hello\n" (TỰ ĐỘNG xuống dòng)                                │
// │                                                                       │
// │ process.stdout.write('Hello')                                        │
// │   → In "Hello" (KHÔNG xuống dòng)                                    │
// │   → Hữu ích cho: progress bar, loading animation                     │
// └─────────────────────────────────────────────────────────────────────┘

// ĐỌC INPUT TỪ USER:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ CÁCH 1: Event-based (Low-level, ít dùng)                             │
// │                                                                       │
// │   process.stdin.on('data', (data) => {                               │
// │     const input = data.toString().trim();                            │
// │     console.log('User typed:', input);                               │
// │   });                                                                 │
// │                                                                       │
// │   - data là Buffer (nhị phân) → cần .toString()                      │
// │   - Có ký tự \n ở cuối → cần .trim()                                 │
// └─────────────────────────────────────────────────────────────────────┘
// ┌─────────────────────────────────────────────────────────────────────┐
// │ CÁCH 2: readline module (Recommended)                                │
// │                                                                       │
// │   import readline from 'readline';                                   │
// │                                                                       │
// │   const rl = readline.createInterface({                              │
// │     input: process.stdin,                                            │
// │     output: process.stdout                                           │
// │   });                                                                 │
// │                                                                       │
// │   rl.question('Tên bạn? ', (answer) => {                             │
// │     console.log('Xin chào', answer);                                 │
// │     rl.close();  // QUAN TRỌNG: phải close()                         │
// │   });                                                                 │
// └─────────────────────────────────────────────────────────────────────┘

// GIẢI THÍCH readline.createInterface():
// ┌─────────────────────────────────────────────────────────────────────┐
// │ const rl = readline.createInterface({...})                           │
// │       ^    ^        ^                                                │
// │       |    |        └─ Tạo interface (giao diện đọc/ghi)             │
// │       |    └─ Module readline                                        │
// │       └─ Biến lưu interface                                          │
// │                                                                       │
// │ Interface này là "cầu nối" giữa code và stdin/stdout                │
// │ - input: process.stdin  → Đọc từ đâu? Keyboard                      │
// │ - output: process.stdout → Ghi ra đâu? Terminal                     │
// │                                                                       │
// │ Sau khi có     , dùng:                                                 │
// │ - rl.question()  → Hỏi và đợi user trả lời                          │
// │ - rl.close()     → Đóng interface (PHẢI GỌI khi xong)               │
// └─────────────────────────────────────────────────────────────────────┘

// PIPE INPUT:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ PIPE (|) = Chuyển output của command này thành input của command khác│
// │                                                                       │
// │   echo "hello" | node script.js                                      │
// │        ^         ^                                                   │
// │        |         └─ Nhận "hello" qua process.stdin                   │
// │        └─ Output của echo                                            │
// │                                                                       │
// │ Cách đọc:                                                            │
// │   let input = '';                                                    │
// │   process.stdin.on('data', (chunk) => { input += chunk; });          │
// │   process.stdin.on('end', () => { console.log(input); });            │
// │                                                                       │
// │ - 'data' event: nhận từng chunk (phần) data                          │
// │ - 'end' event: khi hết data (pipe đóng)                              │
// └─────────────────────────────────────────────────────────────────────┘

// TTY (TeleTYpewriter):
// ┌─────────────────────────────────────────────────────────────────────┐
// │ process.stdin.isTTY                                                  │
// │   = true  → Input từ keyboard (user gõ trực tiếp)                    │
// │   = false → Input từ pipe/file                                       │
// │                                                                       │
// │ Dùng để:                                                             │
// │   if (process.stdin.isTTY) {                                         │
// │     // Interactive mode: hỏi user                                    │
// │   } else {                                                           │
// │     // Pipe mode: đọc data từ pipe                                   │
// │   }                                                                   │
// └─────────────────────────────────────────────────────────────────────┘

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 6. KỸ THUẬT HAY: PROGRESS BAR                                         ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * Dùng \r (carriage return) để ghi đè dòng hiện tại
 *
 * \n = xuống dòng MỚI
 * \r = về ĐẦU dòng hiện tại (không xuống dòng)
 *
 *   process.stdout.write('\r[████░░░░] 50%');
 *                        ^
 *                        └─ Về đầu dòng → ghi đè
 *
 * Kết quả: animation trên cùng 1 dòng
 */

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 7. TÓM TẮT NHANH                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ process.env          │ Object chứa biến môi trường                   │
 * │ process.argv         │ Array chứa arguments dòng lệnh               │
 * │ process.exit(code)   │ Thoát ngay với exit code                     │
 * │ process.exitCode     │ Set exit code (không thoát ngay)             │
 * │ process.stdin        │ Stream đọc input                              │
 * │ process.stdout       │ Stream ghi output                             │
 * │ process.stderr       │ Stream ghi error                              │
 * │ process.pid          │ Process ID                                    │
 * │ process.cwd()        │ Current Working Directory                    │
 * │ process.on(event)    │ Lắng nghe events (exit, SIGINT...)           │
 * └─────────────────────────────────────────────────────────────────────┘
 */

// ╔══════════════════════════════════════════════════════════════════════╗
// ║ 8. THỨ TỰ HỌC                                                         ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * 1. 01-env.js       → Học về environment variables
 * 2. 02-argv.js      → Học về command line arguments
 * 3. 03-exit-codes.js → Học về exit codes và signals
 * 4. 04-stdin-stdout.js → Học về I/O streams
 *
 * Mỗi file có demo để chạy và test!
 */

console.log("File này chỉ để đọc lý thuyết, không có demo.");
console.log("Xem các file 01-04 để chạy demo.");
