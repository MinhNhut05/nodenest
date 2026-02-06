/**
 * BÀI TẬP PHẦN A - CommonJS: Main file
 *
 * Yêu cầu: Import và sử dụng utils module
 */

console.log("=== BÀI TẬP COMMONJS ===\n");

// ============================================
// TODO 1: Import toàn bộ utils module
// ============================================
const utils = require("./utils.cjs");

// ============================================
// TODO 2: In ra thông tin module
// ============================================
console.log("--- Module Info ---");
console.log(utils.moduleInfo);

// ============================================
// TODO 3: Test hàm capitalize
// ============================================
console.log("\n--- Test capitalize ---");
console.log('capitalize("hello world"):', utils.capitalize("hello world"));
console.log('capitalize("jAVAsCRIPT"):', utils.capitalize("jAVAsCRIPT"));
console.log('capitalize("node"):', utils.capitalize("node"));

// ============================================
// TODO 4: Test hàm slugify
// ============================================
console.log("\n--- Test slugify ---");
console.log('slugify("Hello World"):', utils.slugify("Hello World"));
console.log('slugify("Node JS Tutorial"):', utils.slugify("Node JS Tutorial"));
console.log('slugify("ES Modules Guide"):', utils.slugify("ES Modules Guide"));

// ============================================
// TODO 5: Test hàm truncate
// ============================================
console.log("\n--- Test truncate ---");
console.log('truncate("Hello World", 5):', utils.truncate("Hello World", 5));
console.log('truncate("JavaScript", 4):', utils.truncate("JavaScript", 4));
console.log('truncate("Hi", 10):', utils.truncate("Hi", 10));

// ============================================
// TODO 6: Import với destructuring
// Dùng alias để tránh trùng tên
// ============================================
console.log("\n--- Destructuring Import ---");
const { capitalize: cap, slugify: slug, truncate: trunc } = require("./utils.cjs");
console.log('cap("destructuring test"):', cap("destructuring test"));
console.log('slug("Destructuring Test"):', slug("Destructuring Test"));
console.log('trunc("Destructuring", 5):', trunc("Destructuring", 5));
