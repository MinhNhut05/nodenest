/**
 * SESSION 1.1.2 - BONUS: Promise Deep Dive
 */

console.log("=== PROMISE DEEP DIVE ===\n");

// ============================================
// 1. TẠO PROMISE TỪ ĐẦU
// ============================================

console.log("--- 1. Tạo Promise ---\n");

function delay(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      reject(new Error("Thời gian không thể âm!"));
      return;
    }
    setTimeout(() => {
      resolve(`Đã chờ ${ms}ms`);
    }, ms);
  });
}

// Sử dụng với .then()
delay(100)
  .then((result) => console.log("delay(100):", result))
  .catch((err) => console.log("Lỗi:", err.message));

// ============================================
// 2. PROMISE CHAIN
// ============================================

setTimeout(() => {
  console.log("\n--- 2. Promise Chain ---\n");

  // Mỗi .then() trả về Promise MỚI
  Promise.resolve(10)
    .then((num) => {
      console.log("Bước 1: nhận", num);
      return num * 2; // Return 20
    })
    .then((num) => {
      console.log("Bước 2: nhận", num);
      return num + 5; // Return 25
    })
    .then((num) => {
      console.log("Bước 3: nhận", num);
      // Không return → undefined
    })
    .then((num) => {
      console.log("Bước 4: nhận", num); // undefined
    });
}, 200);

// ============================================
// 3. RETURN PROMISE TRONG .THEN()
// ============================================

setTimeout(() => {
  console.log("\n--- 3. Return Promise trong .then() ---\n");

  delay(50)
    .then((result) => {
      console.log("Lần 1:", result);
      return delay(50); // Return Promise → .then() tiếp theo CHỜ
    })
    .then((result) => {
      console.log("Lần 2:", result);
      return delay(50);
    })
    .then((result) => {
      console.log("Lần 3:", result);
    });
}, 400);

// ============================================
// 4. ERROR HANDLING
// ============================================

setTimeout(() => {
  console.log("\n--- 4. Error Handling ---\n");

  // .catch() bắt lỗi từ bất kỳ .then() nào trước đó
  Promise.resolve(1)
    .then((num) => {
      console.log("Step 1:", num);
      throw new Error("Lỗi ở step 2!");
    })
    .then((num) => {
      console.log("Step 2:", num); // BỎ QUA - không chạy
    })
    .then((num) => {
      console.log("Step 3:", num); // BỎ QUA - không chạy
    })
    .catch((err) => {
      console.log("Caught:", err.message);
      return "Recovered"; // Có thể recover
    })
    .then((result) => {
      console.log("After catch:", result); // 'Recovered'
    });
}, 600);

// ============================================
// 5. PROMISE.ALL - Chạy song song
// ============================================

setTimeout(() => {
  console.log("\n--- 5. Promise.all() - Chạy song song ---\n");

  const start = Date.now();

  // 3 promises chạy ĐỒNG THỜI
  Promise.all([delay(100), delay(200), delay(150)]).then((results) => {
    const elapsed = Date.now() - start;
    console.log("Kết quả:", results);
    console.log(`Tổng thời gian: ${elapsed}ms (không phải 450ms!)`);
  });

  /*
      Nếu chạy tuần tự: 100 + 200 + 150 = 450ms
      Chạy song song: ~200ms (promise chậm nhất)
    */
}, 800);

// ============================================
// 6. PROMISE.RACE - Ai nhanh thắng
// ============================================

setTimeout(() => {
  console.log("\n--- 6. Promise.race() - Ai nhanh thắng ---\n");

  Promise.race([
    delay(300).then(() => "Chậm"),
    delay(100).then(() => "Nhanh"),
    delay(200).then(() => "Vừa"),
  ]).then((winner) => {
    console.log("Winner:", winner); // 'Nhanh'
  });
}, 1100);

// ============================================
// 7. ASYNC/AWAIT - Syntax đẹp hơn
// ============================================

setTimeout(async () => {
  console.log("\n--- 7. async/await ---\n");

  // CÁCH CŨ: .then() chain
  console.log("Cách cũ với .then():");
  delay(50)
    .then((r1) => {
      console.log(r1);
      return delay(50);
    })
    .then((r2) => {
      console.log(r2);
    });
}, 1400);

setTimeout(async () => {
  // CÁCH MỚI: async/await
  console.log("\nCách mới với async/await:");

  const r1 = await delay(100);
  console.log(r1);

  const r2 = await delay(50);
  console.log(r2);

  // Error handling với try/catch
  try {
    await delay(-100); // Sẽ reject
  } catch (err) {
    console.log("Caught with try/catch:", err.message);
  }

  console.log("\n=== KẾT THÚC DEMO ===");
}, 1600);
