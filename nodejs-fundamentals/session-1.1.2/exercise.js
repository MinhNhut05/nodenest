/**
 * BÀI TẬP SESSION 1.1.2 - Event Loop
 *
 * Hướng dẫn: Điền code vào các chỗ TODO
 * Chạy file: node session-1.1.2/exercise.js
 */

// ============================================
// BÀI 1: Dự đoán Output
// Yêu cầu: KHÔNG CHẠY CODE, viết dự đoán output vào comment
// Sau đó uncomment để verify
// ============================================

console.log("=== BÀI 1: Dự đoán Output ===\n");

// TODO 1.1: Dự đoán output của code này (viết vào comment bên dưới)
/*
console.log('A');
setTimeout(() => console.log('B'), 0);
console.log('C');

Dự đoán output:
1. a
2. c
3. b
*/

// Uncomment để verify:
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");

// TODO 1.2: Dự đoán output của code này
/*
console.log('1');
setTimeout(() => console.log('2'), 100);
setTimeout(() => console.log('3'), 0);
Promise.resolve().then(() => console.log('4'));
console.log('5');

Dự đoán output:
1. 1
2. 5
3. 4
4. 3
5. 2
*/

// Uncomment để verify:
// console.log('1');
// setTimeout(() => console.log('2'), 100);
// setTimeout(() => console.log('3'), 0);
// Promise.resolve().then(() => console.log('4'));
// console.log('5');

// ============================================
// BÀI 2: Tạo hàm delay với Promise
// Yêu cầu: Tạo hàm trả về Promise, resolve sau ms milliseconds
// ============================================

console.log("\n=== BÀI 2: Tạo hàm delay ===\n");

// TODO 2.1: Hoàn thành hàm delay
function delay(ms) {
  // Trả về một Promise mới
  // Promise sẽ resolve sau ms milliseconds
  // Hint: dùng setTimeout bên trong Promise
  // VIẾT CODE Ở ĐÂY
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`hehehe`);
    }, ms);
  });
}

// Test (uncomment sau khi hoàn thành):
// delay(100).then(() => console.log('Đã chờ 100ms'));

// ============================================
// BÀI 3: Tuần tự vs Song song
// Yêu cầu: Viết 2 hàm đọc "file" (giả lập bằng delay)
// ============================================

console.log("\n=== BÀI 3: Tuần tự vs Song song ===\n");

// Giả lập đọc file (dùng delay ở bài 2)
function readFile(filename, timeMs) {
  console.log(`  Bắt đầu đọc ${filename}...`);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`  Đọc xong ${filename}`);
      resolve(`Nội dung của ${filename}`);
    }, timeMs);
  });
}

// TODO 3.1: Viết hàm đọc 3 files TUẦN TỰ (dùng async/await)
// Đọc file1 xong → đọc file2 → đọc file3
async function readSequential() {
  console.log("--- Đọc tuần tự ---");
  const start = Date.now();

  // VIẾT CODE Ở ĐÂY
  // Dùng await để đọc từng file
  const data1 = await readFile("file1.txt", 100);
  const data2 = await readFile("file2.txt", 200);
  const data3 = await readFile("file3.txt", 70);

  const elapsed = Date.now() - start;
  console.log(`Tổng thời gian: ${elapsed}ms\n`);
}

// TODO 3.2: Viết hàm đọc 3 files SONG SONG (dùng Promise.all)
// Cả 3 files bắt đầu đọc cùng lúc
async function readParallel() {
  console.log("--- Đọc song song ---");
  const start = Date.now();

  // VIẾT CODE Ở ĐÂY
  // Dùng Promise.all để đọc cùng lúc
  const [data1, data2, data3] = await Promise.all([
    readFile("file1.txt", 100),
    readFile("file2.txt", 200),
    readFile("file3.txt", 70),
  ]);

  const elapsed = Date.now() - start;
  console.log(`Tổng thời gian: ${elapsed}ms\n`);
}

// Test (uncomment sau khi hoàn thành):
(async () => {
  await readSequential();
  await readParallel();
})();

// ============================================
// BÀI 4: Error Handling với Promise
// Yêu cầu: Xử lý lỗi đúng cách
// ============================================

console.log("\n=== BÀI 4: Error Handling ===\n");

// Hàm có thể thành công hoặc thất bại
function fetchData(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Không thể kết nối server!"));
      } else {
        resolve({ id: 1, name: "Data from server" });
      }
    }, 100);
  });
}

// TODO 4.1: Gọi fetchData(false), xử lý kết quả với .then() và .catch()
// In ra data nếu thành công, in ra error.message nếu thất bại

fetchData(false)
  .then((data) => {
    console.log("thanh cong", data);
  })
  .catch((err) => {
    console.log("that bai", err.message);
  });
// VIẾT CODE Ở ĐÂY

// TODO 4.2: Gọi fetchData(true) với async/await và try/catch
// In ra error.message khi thất bại

async function handleError() {
  try {
    const data = await fetchData(true);
    console.log("thanh cong", data);
  } catch (err) {
    console.log("that bai", err.message);
  }
}

// Uncomment để test:
// handleError();

// ============================================
// BÀI 5 (BONUS): Đoán output phức tạp
// ============================================

console.log("\n=== BÀI 5: Bonus - Output phức tạp ===\n");

// TODO 5: Dự đoán output (viết vào comment, KHÔNG chạy code)
/*
console.log('A');

setTimeout(() => {
    console.log('B');
    Promise.resolve().then(() => console.log('C'));
}, 0);

Promise.resolve().then(() => {
    console.log('D');
    setTimeout(() => console.log('E'), 0);
});

console.log('F');

Dự đoán output:
1. a
2. f
3. d
4. b
5. c
6. e
*/

// Uncomment để verify:
// console.log('A');
// setTimeout(() => {
//     console.log('B');
//     Promise.resolve().then(() => console.log('C'));
// }, 0);
// Promise.resolve().then(() => {
//     console.log('D');
//     setTimeout(() => console.log('E'), 0);
// });
// console.log('F');
