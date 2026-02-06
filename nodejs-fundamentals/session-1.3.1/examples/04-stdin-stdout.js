/**
 * SESSION 1.3.1 - stdin/stdout
 * Input/Output Streams
 *
 * process.stdin  - đọc input từ user (keyboard)
 * process.stdout - ghi output ra terminal (màn hình)
 * process.stderr - ghi error ra terminal (màn hình, riêng biệt)
 */

// Import readline module ở đầu file (ES Module syntax)
// Project dùng "type": "module" nên phải dùng import thay vì require()
import readline from 'readline';

// ============================================
// 1. STDOUT VÀ STDERR
// ============================================

console.log('=== stdout vs stderr ===\n');

// console.log() thực ra là wrapper (hàm bọc ngoài) cho process.stdout.write()
// Nghĩa là khi bạn gọi console.log(), bên trong nó gọi process.stdout.write()
process.stdout.write('Hello from stdout!\n');

// Tương tự, console.error() là wrapper cho process.stderr.write()
process.stderr.write('This is an error message\n');

// ===== KHÁC BIỆT QUAN TRỌNG =====
// stdout và stderr là 2 "kênh" riêng biệt
// Có thể redirect (chuyển hướng) riêng trong terminal:
//
// node script.js > output.txt 2> errors.txt
//                ^               ^
//                |               └─ 2> = redirect stderr (lỗi)
//                └─ > = redirect stdout (output bình thường)
//
// Kết quả:
// - stdout -> ghi vào file output.txt
// - stderr -> ghi vào file errors.txt
// - Terminal không hiện gì (đã chuyển hết vào file)

// ============================================
// 2. STDOUT KHÔNG CÓ NEWLINE
// ============================================

console.log('\n=== stdout.write() ===\n');

// ===== SO SÁNH =====
// console.log('text')  → tự động thêm \n (xuống dòng) ở cuối
// stdout.write('text') → KHÔNG tự động thêm \n

// Ví dụ: in "Loading..." trên cùng 1 dòng
process.stdout.write('Loading');  // In "Loading" nhưng KHÔNG xuống dòng
process.stdout.write('.');        // In "." ngay sau "Loading"
process.stdout.write('.');        // In "." tiếp
process.stdout.write('.');        // In "." tiếp
process.stdout.write(' Done!\n'); // In " Done!" và XUỐNG DÒNG

// Kết quả: "Loading... Done!"
// Nếu dùng console.log() sẽ ra:
// Loading
// .
// .
// .
//  Done!

// ============================================
// 3. STDIN - ĐỌC INPUT
// ============================================

console.log('\n=== stdin basics ===\n');

// stdin (standard input) là Readable stream
// Stream = dòng dữ liệu chảy vào/ra

// ===== TTY LÀ GÌ? =====
// TTY = TeleTYpewriter = Terminal (màn hình tương tác)
console.log('stdin is TTY:', process.stdin.isTTY);
console.log('stdout is TTY:', process.stdout.isTTY);

// isTTY = true  → input từ keyboard (user gõ trực tiếp)
// isTTY = false → input từ pipe/file (ví dụ: echo "hello" | node script.js)

// Tại sao cần biết TTY?
// - Nếu TTY: có thể hỏi user nhập liệu, hiện progress bar
// - Nếu không TTY: chỉ đọc data từ pipe rồi xử lý

// ============================================
// 4. ĐỌC INPUT TỪ USER (Event-based)
// ============================================

console.log('\n=== Interactive Input ===\n');

// ===== CÁCH 1: EVENT-BASED (Low-level) =====
// Đây là cách "thủ công", ít dùng trong thực tế

// Bước 1: In câu hỏi (KHÔNG xuống dòng để user gõ ngay sau)
process.stdout.write('Nhập tên của bạn: ');

// Bước 2: Lắng nghe event 'data' khi user gõ Enter
// .once() = chỉ lắng nghe 1 LẦN (sau đó tự hủy listener)
// .on() = lắng nghe MÃI MÃI (dùng cho nhiều lần input)
process.stdin.once('data', (data) => {
  // === Khi user GÕ và BẤM ENTER, code này chạy ===

  // data = Buffer (dữ liệu nhị phân)
  // VD: user gõ "John" + Enter
  // data = <Buffer 4a 6f 68 6e 0a>
  //                           ^
  //                           └─ 0a = \n (newline)

  // .toString() = chuyển Buffer thành string
  // "John\n"
  //      ^
  //      └─ còn ký tự xuống dòng

  // .trim() = xóa khoảng trắng và \n ở đầu/cuối
  // "John"
  const name = data.toString().trim();

  console.log(`\nXin chào, ${name}!`);

  // Tiếp tục demo phần readline
  demoReadline();
});

// ============================================
// 5. READLINE MODULE (Recommended)
// ============================================

function demoReadline() {
  console.log('\n=== readline module ===\n');

  // ===== CÁCH 2: DÙNG READLINE MODULE (Khuyến nghị) =====
  // readline = module built-in của Node.js
  // Giúp đọc input DỄ DÀNG hơn cách event-based

  // Tạo interface để đọc input/output
  const rl = readline.createInterface({
    input: process.stdin,  // Đọc từ đâu? → Keyboard
    output: process.stdout, // Ghi ra đâu? → Terminal
  });

  // ===== HỎI CÂU HỎI THỨ NHẤT =====
  // .question(câu_hỏi, callback)
  // - In câu hỏi ra màn hình
  // - Đợi user gõ và bấm Enter
  // - Gọi callback với câu trả lời
  rl.question('Bạn bao nhiêu tuổi? ', (age) => {
    // === Code này chạy KHI user trả lời xong ===
    console.log(`Bạn ${age} tuổi.`);

    // ===== HỎI CÂU HỎI THỨ HAI (Nested) =====
    // Vì readline là async, câu hỏi sau phải nằm TRONG callback của câu trước
    rl.question('Ngôn ngữ yêu thích? ', (lang) => {
      // === Code này chạy KHI user trả lời câu 2 xong ===

      // In tổng kết
      console.log(`\n--- Summary ---`);
      console.log(`Tuổi: ${age}`);
      console.log(`Ngôn ngữ: ${lang}`);

      // ===== ĐÓNG READLINE =====
      // QUAN TRỌNG: Phải close(), nếu không process sẽ chạy mãi (không thoát)
      rl.close();

      // Tiếp tục demo pipe
      demoPipe();
    });
  });
}

// ============================================
// 6. PIPE - XỬ LÝ DATA TỪ PIPE
// ============================================

function demoPipe() {
  console.log('\n=== Pipe Input ===\n');
  console.log('Để test pipe, chạy:');
  console.log('  echo "hello world" | node 04-stdin-stdout.js --pipe\n');

  // ===== PIPE LÀ GÌ? =====
  // Pipe (|) = chuyển output của command này thành input của command khác
  //
  // echo "hello world" | node script.js
  //       ^                    ^
  //       |                    └─ nhận "hello world" qua stdin
  //       └─ in ra "hello world"
  //
  // Tương đương: echo "hello world" > temp.txt && node script.js < temp.txt

  // Check xem có flag --pipe không
  if (process.argv.includes('--pipe')) {
    console.log('Reading from pipe...\n');

    // Biến lưu tất cả data nhận được
    let input = '';

    // ===== LẮNG NGHE EVENT 'data' =====
    // Khi có data từ pipe → event 'data' được trigger
    // Data có thể đến từng CHUNK (khối) nếu dữ liệu lớn
    process.stdin.on('data', (chunk) => {
      // chunk = 1 phần data (có thể là toàn bộ hoặc 1 phần)
      // VD: file 10MB → nhận 10 chunks, mỗi chunk 1MB

      // Ghép chunk vào input
      input += chunk;
      // Lần 1: input = "hello"
      // Lần 2: input = "hello world"
    });

    // ===== LẮNG NGHE EVENT 'end' =====
    // Khi HẾT data (pipe đóng) → event 'end' được trigger
    process.stdin.on('end', () => {
      // === Tất cả data đã nhận xong ===
      console.log('Received:', input.trim());
      console.log('Length:', input.trim().length, 'chars');

      // ===== KHI NÀO CẦN DÙNG? =====
      // - Xử lý output của command khác: cat file.txt | node parse.js
      // - Xử lý data lớn: curl api.com | node process-json.js
      // - Pipeline: command1 | node script1.js | node script2.js
    });
  } else {
    console.log('Demo hoàn tất!');
  }
}

// ============================================
// 7. PRACTICAL: PROGRESS BAR
// ============================================

// ===== BONUS: TẠO PROGRESS BAR =====
// Uncomment (bỏ /* */) để test progress bar

/*
function progressBar() {
  const total = 20;    // Tổng số bước
  let current = 0;     // Bước hiện tại

  // Chạy mỗi 100ms
  const interval = setInterval(() => {
    current++;

    // Tính phần trăm
    const percent = Math.round((current / total) * 100);

    // Tạo thanh progress
    const filled = '█'.repeat(current);         // Phần đã xong: ████
    const empty = '░'.repeat(total - current);  // Phần còn lại: ░░░░

    // ===== KỸ THUẬT QUAN TRỌNG: \r (carriage return) =====
    // \r = về đầu dòng KHÔNG xuống dòng
    // \n = xuống dòng mới
    //
    // \r cho phép OVERWRITE (ghi đè) dòng hiện tại
    // → Tạo hiệu ứng animation trên cùng 1 dòng

    process.stdout.write(`\r[${filled}${empty}] ${percent}%`);
    // Lần 1: [█░░░░░░░░░░░░░░░░░░░] 5%
    // Lần 2: [██░░░░░░░░░░░░░░░░░░] 10%  ← overwrite dòng cũ
    // Lần 3: [███░░░░░░░░░░░░░░░░░] 15%  ← overwrite dòng cũ

    // Khi hoàn thành
    if (current === total) {
      clearInterval(interval);  // Dừng interval
      console.log('\nComplete!');  // \n = xuống dòng
    }
  }, 100);

  // ===== USE CASE THỰC TẾ =====
  // - Download file: [████░░░] 60%
  // - Upload file: Uploading... [██████] 100%
  // - Install packages: npm install [███░░] 75%
  // - Build project: Building... [████] 100%
}
progressBar();
*/

// ============================================
// THỬ CHẠY:
// ============================================
// node 04-stdin-stdout.js
// echo "test input" | node 04-stdin-stdout.js --pipe
// cat somefile.txt | node 04-stdin-stdout.js --pipe
