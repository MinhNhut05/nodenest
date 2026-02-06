/**
 * USER HANDLERS
 * Xử lý logic cho /api/users
 */

import { users, getNextUserId } from "../data/db.js";
import { sendJson, parseBody } from "../utils/helpers.js";

/**
 * GET /api/users
 * Lấy tất cả users
 */
export function getUsers(req, res) {
  sendJson(res, 200, {
    success: true,
    count: users.length,
    data: users,
  });
}

/**
 * GET /api/users/:id
 * Lấy 1 user theo ID
 */
export function getUserById(req, res) {
  const { id } = req.params;
  const user = users.find((u) => u.id === id);

  if (!user) {
    return sendJson(res, 404, {
      success: false,
      error: `User id=${id} không tồn tại`,
    });
  }

  sendJson(res, 200, { success: true, data: user });
}

/**
 * POST /api/users
 * Tạo user mới
 */
export async function createUser(req, res) {
  try {
    const body = await parseBody(req);

    // Validate
    if (!body.name || !body.email) {
      return sendJson(res, 400, {
        success: false,
        error: "Thiếu name hoặc email",
      });
    }

    // Tạo user mới
    const newUser = {
      id: getNextUserId(),
      name: body.name,
      email: body.email,
    };

    users.push(newUser);

    sendJson(res, 201, {
      success: true,
      message: "Tạo user thành công",
      data: newUser,
    });
  } catch (error) {
    sendJson(res, 400, { success: false, error: error.message });
  }
}

/**
 * PUT /api/users/:id
 * Cập nhật user
 */
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const body = await parseBody(req);

    const userIndex = users.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return sendJson(res, 404, {
        success: false,
        error: `User id=${id} không tồn tại`,
      });
    }

    // Cập nhật
    users[userIndex] = { ...users[userIndex], ...body };

    sendJson(res, 200, {
      success: true,
      message: "Cập nhật thành công",
      data: users[userIndex],
    });
  } catch (error) {
    sendJson(res, 400, { success: false, error: error.message });
  }
}

/**
 * DELETE /api/users/:id
 * Xóa user
 */
export function deleteUser(req, res) {
  const { id } = req.params;
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return sendJson(res, 404, {
      success: false,
      error: `User id=${id} không tồn tại`,
    });
  }

  const deletedUser = users.splice(userIndex, 1)[0];

  sendJson(res, 200, {
    success: true,
    message: "Xóa thành công",
    data: deletedUser,
  });
}
