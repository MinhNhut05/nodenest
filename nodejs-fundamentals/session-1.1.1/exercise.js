/**
 * BÀI TẬP SESSION 1.1.1 - Node.js Runtime
 *
 * Hướng dẫn: Điền code vào các chỗ TODO
 * Chạy file: node session-1.1.1/exercise.js
 */

// ============================================
// BÀI 1: Thông tin hệ thống
// Yêu cầu: In ra thông tin về môi trường Node.js
// ============================================

console.log("=== BÀI 1: Thông tin hệ thống ===");

// TODO 1.1: In ra Node.js version (dùng process)
console.log(process.version);

// TODO 1.2: In ra hệ điều hành đang dùng (linux/darwin/win32)
console.log(process.platform);

// TODO 1.3: In ra kiến trúc CPU (x64/arm64)
console.log(process.arch);

// TODO 1.4: In ra thư mục hiện tại (current working directory)
console.log(process.cwd());

// ============================================
// BÀI 2: Đường dẫn file
// Yêu cầu: Phân biệt __dirname và process.cwd()
// ============================================

console.log("\n=== BÀI 2: Đường dẫn file ===");

// TODO 2.1: In ra đường dẫn thư mục chứa file này
console.log(__dirname);

// TODO 2.2: In ra đường dẫn đầy đủ của file này
console.log(__filename);

// TODO 2.3: In ra process.cwd() và giải thích trong comment
//           khi nào __dirname khác process.cwd()
console.log(process.cwd());
// __dirname in duong dan thu muc chua file chay, process.cwd() in dung dan dang dung chay lenh.

// ============================================
// BÀI 3: Command Line Arguments
// Yêu cầu: Xử lý arguments từ command line
// Chạy thử: node session-1.1.1/exercise.js Minh 25 developer
// ============================================

console.log("\n=== BÀI 3: Command Line Arguments ===");

// TODO 3.1: Lấy tất cả arguments của user (bỏ qua node path và file path)
const userArgs = process.argv.slice(2); // Sửa dòng này
if (userArgs.length >= 3) {
  console.log(
    `Xin chào ${userArgs[0]}, ${userArgs[1]} tuổi,  nghề ${userArgs[2]}`,
  );
} else {
  console.log("Thử chạy: node 03-global-objects.js Minh 25 developer");
}

// TODO 3.2: Kiểm tra nếu có đủ 3 arguments (name, age, job)
//           In ra: "Xin chào [name], [age] tuổi, nghề [job]"
//           Nếu không đủ, in ra hướng dẫn cách chạy

// ============================================
// BÀI 4: Environment Variables
// Yêu cầu: Đọc và tạo environment variables
// ============================================

console.log("\n=== BÀI 4: Environment Variables ===");

// TODO 4.1: In ra giá trị của biến môi trường HOME
console.log(process.env.HOME);

// TODO 4.2: Tạo một biến môi trường mới tên APP_NAME với giá trị "NodeJS Fundamentals"
process.env.APP_NAME = "NodeJS Fundamentals";
// TODO 4.3: In ra APP_NAME vừa tạo
console.log(process.env.APP_NAME);

// ============================================
// BÀI 5 (BONUS): Greeting App
// Yêu cầu: Tạo app chào hỏi dựa trên thời gian
// ============================================

console.log("\n=== BÀI 5: Greeting App ===");

// TODO 5.1: Lấy giờ hiện tại (0-23)
const currentHour = new Date().getHours(); // Sửa dòng này

switch (currentHour) {
  case 5:
  case 6:
  case 7:
  case 8:
  case 9:
  case 10:
  case 11:
    console.log("Chào buổi sáng!");
    break;
  case 12:
  case 13:
  case 14:
  case 15:
  case 16:
  case 17:
    console.log("Chào buổi chiều!");
    break;
  case 18:
  case 19:
  case 20:
  case 21:
    console.log("Chào buổi tối!");
    break;
  case 22:
  case 23:
  case 0:
  case 1:
  case 2:
  case 3:
  case 4:
    console.log("Khuya rồi, đi ngủ đi!");
    break;
}
// TODO 5.2: In ra lời chào phù hợp:
//           - 5-11: "Chào buổi sáng!"
//           - 12-17: "Chào buổi chiều!"
//           - 18-21: "Chào buổi tối!"
//           - 22-4: "Khuya rồi, đi ngủ đi!"
