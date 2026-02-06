/**
 * BÀI TẬP PHẦN B - ES Modules: Main file
 *
 * Yêu cầu: Import và sử dụng utils module với ESM syntax
 * LƯU Ý: Tất cả import phải ở đầu file!
 */

// ============================================
// IMPORTS (phải ở đầu file)
// ============================================
import StringUtils, { capitalize, slugify, truncate, moduleInfo } from "./utils.mjs";
import { fileURLToPath } from "url";
import path from "path";

// ============================================
// Main code
// ============================================
console.log("=== BÀI TẬP ES MODULES ===\n");

// ============================================
// TODO 4: Test các named exports
// ============================================
console.log("--- Test Named Exports ---");
console.log('capitalize("hello esm"):', capitalize("hello esm"));
console.log('slugify("ES Modules Rock"):', slugify("ES Modules Rock"));
console.log('truncate("Hello World", 5):', truncate("Hello World", 5));
console.log("moduleInfo:", moduleInfo);

// ============================================
// TODO 5: Test StringUtils (default export)
// ============================================
console.log("\n--- Test StringUtils ---");
const strUtils = new StringUtils();
console.log('reverse("hello"):', strUtils.reverse("hello"));
console.log('countWords("one two three"):', strUtils.countWords("one two three"));
console.log('isPalindrome("madam"):', strUtils.isPalindrome("madam"));
console.log('isPalindrome("hello"):', strUtils.isPalindrome("hello"));

// ============================================
// TODO 6: Tạo __dirname từ import.meta.url
// ============================================
console.log("\n--- __dirname in ESM ---");
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log("__dirname:", __dirname);
console.log("__filename:", __filename);

// ============================================
// BONUS: Top-level await
// ============================================
console.log("\n--- Top-level Await ---");
console.log("Đang chờ 500ms...");
await new Promise((resolve) => setTimeout(resolve, 500));
console.log("Done! (sau 500ms)");
