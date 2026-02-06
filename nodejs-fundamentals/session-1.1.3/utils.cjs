/**
 * BÀI TẬP PHẦN A - CommonJS: Utils Module
 *
 * Yêu cầu: Tạo module chứa các utility functions
 */

// ============================================
// TODO 1: Tạo hàm capitalize
// Input: "hello world" → Output: "Hello world"
// Viết chữ cái đầu tiên thành chữ hoa
// ============================================

function capitalize(str) {
  // VIẾT CODE Ở ĐÂY
  const upCase = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return upCase;
}

// ============================================
// TODO 2: Tạo hàm slugify
// Input: "Hello World" → Output: "hello-world"
// Chuyển thành lowercase và thay space bằng dấu gạch ngang
// ============================================

function slugify(str) {
  // VIẾT CODE Ở ĐÂY
  return str.toLowerCase().replace(/\s+/g, "-");
}

// ============================================
// TODO 3: Tạo hàm truncate
// Input: ("Hello World", 5) → Output: "Hello..."
// Cắt chuỗi và thêm "..." nếu dài hơn maxLength
// ============================================

function truncate(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
  // VIẾT CODE Ở ĐÂY
}

// ============================================
// TODO 4: Tạo object chứa thông tin module
// ============================================

const moduleInfo = {
  name: "utils",
  version: "1.0.0",
  author: "minhnhut",
  // TODO: Thêm property author với tên của bạn
};

// ============================================
// TODO 5: Export tất cả bằng module.exports
// Export: capitalize, slugify, truncate, moduleInfo
// ============================================
module.exports = { capitalize, slugify, truncate, moduleInfo };
// VIẾT CODE Ở ĐÂY
