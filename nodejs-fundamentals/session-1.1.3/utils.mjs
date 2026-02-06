/**
 * BÀI TẬP PHẦN B - ES Modules: Utils Module
 *
 * Yêu cầu: Tạo module chứa các utility functions (giống phần A nhưng dùng ESM syntax)
 */

// ============================================
// TODO 1: Tạo và EXPORT hàm capitalize (named export)
// Input: "hello world" → Output: "Hello world"
// ============================================

// VIẾT CODE Ở ĐÂY (dùng export function ...)
export function capitalize(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

// ============================================
// TODO 2: Tạo và EXPORT hàm slugify (named export)
// Input: "Hello World" → Output: "hello-world"
// ============================================
export function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}
// VIẾT CODE Ở ĐÂY

// ============================================
// TODO 3: Tạo và EXPORT hàm truncate (named export)
// Input: ("Hello World", 5) → Output: "Hello..."
// ============================================
export function truncate(str, maxLength) {
  if (str.length > maxLength) {
    return str.slice(0, maxLength) + "...";
  }
  return str;
}
// VIẾT CODE Ở ĐÂY

// ============================================
// TODO 4: Tạo class StringUtils với các methods:
// - reverse(str): đảo ngược chuỗi
// - countWords(str): đếm số từ
// - isPalindrome(str): kiểm tra chuỗi đối xứng
// ============================================

class StringUtils {
  reverse(str) {
    return str.split("").reverse().join("");
  }
  countWords(str) {
    return str.trim().split(/\s+/).length;
  }
  isPalindrome(str) {
    const clean = str.toLowerCase().replace(/\s+/g, "");
    return clean === clean.split("").reverse().join("");
  }
  // VIẾT CODE Ở ĐÂY
}

// ============================================
// TODO 5: Export StringUtils làm DEFAULT export
// ============================================
export default StringUtils;
// VIẾT CODE Ở ĐÂY

// ============================================
// TODO 6: Export thêm moduleInfo (named export)
// ============================================
export const moduleInfo = { name: "nhut", version: "1.0.0" };
// VIẾT CODE Ở ĐÂY
