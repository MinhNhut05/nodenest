/**
 * SESSION 1.3.1 - process.env
 * Environment Variables (Biến môi trường)
 *
 * process.env là object chứa TẤT CẢ biến môi trường của hệ thống
 */

// ============================================
// 1. ĐỌC BIẾN MÔI TRƯỜNG CÓ SẴN
// ============================================

console.log("=== System Environment Variables ===\n");

// Một số biến phổ biến trên Linux/Mac
console.log("USER:", process.env.USER); // Username hiện tại
console.log("HOME:", process.env.HOME); // Đường dẫn home folder
console.log("PATH:", process.env.PATH?.slice(0, 500) + "..."); // Các đường dẫn executable
console.log("SHELL:", process.env.SHELL); // Shell đang dùng
console.log("NODE_ENV:", process.env.NODE_ENV); // Thường là undefined nếu chưa set

// ============================================
// 2. SET BIẾN KHI CHẠY COMMAND
// ============================================

console.log("\n=== Custom Environment Variables ===\n");

// Chạy: NODE_ENV=development node 01-env.js
// Hoặc: MY_API_KEY=abc123 node 01-env.js
console.log("NODE_ENV:", process.env.NODE_ENV || "(not set)");
console.log("MY_API_KEY:", process.env.MY_API_KEY || "(not set)");
console.log("PORT:", process.env.PORT || "(not set)");

// ============================================
// 3. PATTERN: DEFAULT VALUES
// ============================================

console.log("\n=== Default Values Pattern ===\n");

// Cách 1: Dùng || (falsy check)
const port1 = process.env.PORT || 3000;
console.log("Port (||):", port1);

// Cách 2: Dùng ?? (nullish coalescing - chỉ check null/undefined)
const port2 = process.env.PORT ?? 3000;
console.log("Port (??):", port2);

// Sự khác biệt: PORT=0
// || -> 3000 (vì 0 là falsy)
// ?? -> 0 (vì 0 không phải null/undefined)

// ============================================
// 4. PATTERN: CONFIG OBJECT
// ============================================

console.log("\n=== Config Object Pattern ===\n");

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT) || 3000,
  apiKey: process.env.API_KEY,
  debug: process.env.DEBUG === "true", // Convert string to boolean
};

console.log("Config:", config);

// ============================================
// 5. CHECK REQUIRED ENV VARS
// ============================================

console.log("\n=== Validate Required Env Vars ===\n");

function validateEnv(requiredVars) {
  const missing = requiredVars.filter((v) => !process.env[v]);

  if (missing.length > 0) {
    console.error("Missing required environment variables:");
    missing.forEach((v) => console.error(`  - ${v}`));
    return false;
  }

  console.log("All required env vars are set!");
  return true;
}

// Test: sẽ fail vì chưa set
validateEnv(["DATABASE_URL", "JWT_SECRET"]);

// ============================================
// THỬ CHẠY:
// ============================================
// node 01-env.js
// NODE_ENV=production PORT=8080 node 01-env.js
// DATABASE_URL=mongodb://localhost JWT_SECRET=secret node 01-env.js
