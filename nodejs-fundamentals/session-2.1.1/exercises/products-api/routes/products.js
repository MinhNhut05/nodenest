/**
 * PRODUCT ROUTES
 *
 * TODO: Đăng ký routes cho Products API
 *
 * Gợi ý:
 * - Import các handlers từ "../handlers/products.js"
 * - Đăng ký routes theo thứ tự: static trước, dynamic sau
 */

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
} from "../handlers/products.js";

export function registerProductRoutes(router) {
  // TODO: Đăng ký routes ở đây
  //
  // Gợi ý (chú ý thứ tự!):
  //
  // Static routes trước:
  router.get("/api/products", getProducts);

  // Route có path cụ thể trước dynamic:
  router.get("/api/products/category/:category", getProductsByCategory);

  // Dynamic routes sau:
  router.get("/api/products/:id", getProductById);
  router.post("/api/products", createProduct);
  router.put("/api/products/:id", updateProduct);
  router.delete("/api/products/:id", deleteProduct);
}
