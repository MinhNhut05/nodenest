/**
 * PRODUCT HANDLERS
 *
 * TODO: Viết các handler functions cho Products API
 *
 * Gợi ý:
 * - Import products, getNextId từ "../data/db.js"
 * - Import sendJson, parseBody từ "../utils/helpers.js"
 */

import { products, getNextId } from "../data/db.js";
import { sendJson, parseBody } from "../utils/helpers.js";

/**
 * GET /api/products
 * Lấy tất cả products
 *
 * Bonus: Hỗ trợ filter theo query params
 * - ?minPrice=100 → lọc giá >= 100
 * - ?maxPrice=500 → lọc giá <= 500
 * - ?search=phone → tìm theo tên (không phân biệt hoa thường)
 */
export function getProducts(req, res) {
  // TODO: Viết code ở đây
  //
  // Gợi ý:
  // 1. Lấy query params từ req.query
  // 2. Lọc products theo điều kiện (nếu có)
  // 3. Gọi sendJson(res, 200, { success: true, data: ... })
  const { minPrice, maxPrice } = req.query;
  let result = products;
  if (minPrice) {
    result = result.filter((p) => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= Number(maxPrice));
  }
  sendJson(res, 200, { success: true, count: products.length, data: result });
}

/**
 * GET /api/products/:id
 * Lấy 1 product theo ID
 */
export function getProductById(req, res) {
  // TODO: Viết code ở đây
  //
  // Gợi ý:
  // 1. Lấy id từ req.params.id
  // 2. Tìm product trong mảng: products.find(p => p.id === id)
  // 3. Nếu không tìm thấy → sendJson(res, 404, { error: "..." })
  // 4. Nếu tìm thấy → sendJson(res, 200, { success: true, data: product })
  const { id } = req.params;
  const product = products.find((p) => p.id === id);
  if (!product) {
    return sendJson(res, 404, { error: "khong thay product nay" });
  }
  sendJson(res, 200, { success: true, data: product });
}

/**
 * POST /api/products
 * Tạo product mới
 */
export async function createProduct(req, res) {
  // TODO: Viết code ở đây
  //
  // Gợi ý:
  // 1. Parse body: const body = await parseBody(req)
  // 2. Validate: kiểm tra có name, price, category không
  // 3. Tạo product mới với id từ getNextId()
  // 4. Thêm vào mảng: products.push(newProduct)
  // 5. Trả về 201: sendJson(res, 201, { success: true, data: newProduct })
  try {
    const body = await parseBody(req);
    if (!body.name || !body.price || !body.category) {
      return sendJson(res, 400, {
        success: false,
        error: "thieu 1 trong 3",
      });
    }
    const newProduct = {
      id: getNextId(),
      name: body.name,
      price: body.price,
      category: body.category,
      stock: body.stock || 0,
    };
    products.push(newProduct);
    sendJson(res, 201, {
      success: true,
      message: "tao thanh cong",
      data: newProduct,
    });
  } catch (error) {
    sendJson(res, 400, {
      success: false,
      error: error.message,
    });
  }
}

/**
 * PUT /api/products/:id
 * Cập nhật product
 */
export async function updateProduct(req, res) {
  // TODO: Viết code ở đây
  //
  // Gợi ý:
  // 1. Lấy id từ req.params.id
  // 2. Parse body
  // 3. Tìm index: products.findIndex(p => p.id === id)
  // 4. Nếu không tìm thấy → 404
  // 5. Cập nhật: products[index] = { ...products[index], ...body }
  // 6. Trả về 200
  try {
    const { id } = req.params;
    const body = await parseBody(req);
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return sendJson(res, 404, {
        success: false,
        error: `Product id=${id} không tồn tại`,
      });
    }
    products[productIndex] = { ...products[productIndex], ...body };
    return sendJson(res, 200, {
      success: true,
      message: "Cập nhật thành công",
      data: products[productIndex],
    });
  } catch (error) {
    sendJson(res, 400, {
      success: false,
      error: error.message,
    });
  }
}

/**
 * DELETE /api/products/:id
 * Xóa product
 */
export function deleteProduct(req, res) {
  // TODO: Viết code ở đây
  //
  // Gợi ý:
  // 1. Lấy id từ req.params.id
  // 2. Tìm index
  // 3. Nếu không tìm thấy → 404
  // 4. Xóa: products.splice(index, 1)
  // 5. Trả về 200
  const { id } = req.params;
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return sendJson(res, 404, {
      success: false,
      error: `Product id=${id} không tồn tại`,
    });
  }
  const deleteProduct = products.splice(productIndex, 1)[0];
  sendJson(res, 200, {
    success: true,
    message: "xoa thanh cong",
    data: deleteProduct,
  });
}

/**
 * GET /api/products/category/:category
 * Lấy products theo category
 */
export function getProductsByCategory(req, res) {
  // TODO: Viết code ở đây
  //
  // Gợi ý:
  // 1. Lấy category từ req.params.category
  // 2. Lọc: products.filter(p => p.category === category)
  // 3. Nếu không có product nào → vẫn trả về mảng rỗng (hoặc 404 tùy ý)
  // 4. Trả về 200
  const { category } = req.params;
  const product = products.filter((p) => p.category === category);
  if (product.length === 0) {
    sendJson(res, 404, {
      success: false,
      error: `Product category=${category} không tồn tại`,
    });
  }
  sendJson(res, 200, {
    success: true,
    message: "lay thanh cong",
    data: product,
  });
}
