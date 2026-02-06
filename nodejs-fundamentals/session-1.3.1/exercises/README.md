# Bài tập - Session 1.3.1: Process Object

## Bài 1: Config Loader (Dễ)

Tạo file `01-config-loader.js` đọc config từ environment variables.

**Yêu cầu:**
```bash
# Chạy với:
NODE_ENV=production PORT=8080 DB_HOST=localhost node 01-config-loader.js
```

**Output mong đợi:**
```
=== App Configuration ===
Environment: production
Port: 8080
Database Host: localhost
Debug Mode: false

✓ Config loaded successfully!
```

**Gợi ý:**
- Dùng `process.env.VARIABLE_NAME`
- Set default values với `||` hoặc `??`
- `DEBUG` mặc định là `false`

---

## Bài 2: Simple CLI (Trung bình)

Tạo file `02-simple-cli.js` - một CLI đơn giản với các command.

**Yêu cầu:**
```bash
node 02-simple-cli.js greet Leminho
# Output: Hello, Leminho!

node 02-simple-cli.js add 5 3
# Output: 5 + 3 = 8

node 02-simple-cli.js upper "hello world"
# Output: HELLO WORLD

node 02-simple-cli.js --help
# Output: Hiện hướng dẫn sử dụng

node 02-simple-cli.js
# Output: No command provided. Use --help for usage.
```

**Gợi ý:**
- `process.argv.slice(2)` để lấy user arguments
- Dùng `switch` hoặc `if-else` để handle commands
- Exit code 0 nếu thành công, 1 nếu lỗi

---

## Bài 3: File Validator (Trung bình)

Tạo file `03-file-validator.js` kiểm tra các required environment variables.

**Yêu cầu:**
```bash
# Thiếu biến:
node 03-file-validator.js
# Output:
# ✗ Missing required environment variables:
#   - DATABASE_URL
#   - JWT_SECRET
#   - API_KEY
# Exit code: 1

# Đủ biến:
DATABASE_URL=postgres://... JWT_SECRET=abc API_KEY=xyz node 03-file-validator.js
# Output:
# ✓ All environment variables are set!
# Exit code: 0
```

**Kiểm tra exit code:**
```bash
node 03-file-validator.js; echo "Exit code: $?"
```

**Gợi ý:**
- Tạo array `requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'API_KEY']`
- Dùng `.filter()` để tìm biến thiếu
- Set `process.exitCode` dựa trên kết quả

---

## Bài 4: Interactive Calculator (Khó)

Tạo file `04-interactive-calc.js` - máy tính tương tác dùng readline.

**Yêu cầu:**
```
$ node 04-interactive-calc.js

=== Simple Calculator ===
Type 'exit' to quit.

Enter first number: 10
Enter operator (+, -, *, /): +
Enter second number: 5
Result: 10 + 5 = 15

Enter first number: 20
Enter operator (+, -, *, /): /
Enter second number: 4
Result: 20 / 4 = 5

Enter first number: exit
Goodbye!
```

**Gợi ý:**
- Dùng `readline.createInterface()`
- Tạo function `askQuestion()` để hỏi từng bước
- Handle chia cho 0
- Nhớ `rl.close()` khi exit

---

## Bài 5: Log Processor (Khó - Pipe)

Tạo file `05-log-processor.js` xử lý log từ pipe input.

**Yêu cầu:**
```bash
# Tạo file test:
echo -e "INFO: Server started\nERROR: Connection failed\nINFO: User logged in\nWARN: High memory\nERROR: Database timeout" > test.log

# Chạy với pipe:
cat test.log | node 05-log-processor.js

# Output:
# === Log Analysis ===
# Total lines: 5
# INFO: 2
# WARN: 1
# ERROR: 2
#
# === Errors ===
# - Connection failed
# - Database timeout
```

**Gợi ý:**
- Đọc input từ `process.stdin`
- Lắng nghe event `data` và `end`
- Split theo `\n` và đếm từng loại log
- Filter ra các dòng ERROR

---

## Cách làm

1. Tạo từng file trong folder `exercises/`
2. Chạy test theo hướng dẫn
3. So sánh output với mong đợi

**Thứ tự khuyến nghị:** Bài 1 → 2 → 3 → 4 → 5

---

## Check kết quả

Sau khi làm xong, chạy:
```bash
# Bài 1
NODE_ENV=production PORT=8080 DB_HOST=localhost node 01-config-loader.js

# Bài 2
node 02-simple-cli.js greet Leminho
node 02-simple-cli.js add 10 20

# Bài 3
DATABASE_URL=test JWT_SECRET=test API_KEY=test node 03-file-validator.js; echo "Exit: $?"

# Bài 4
node 04-interactive-calc.js

# Bài 5
cat test.log | node 05-log-processor.js
```
