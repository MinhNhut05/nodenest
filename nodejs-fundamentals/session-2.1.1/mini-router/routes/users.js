/**
 * USER ROUTES
 * Định nghĩa routes cho /api/users
 */

import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../handlers/users.js";

/**
 * Đăng ký tất cả user routes vào router
 */
export function registerUserRoutes(router) {
  router.get("/api/users", getUsers);
  router.get("/api/users/:id", getUserById);
  router.post("/api/users", createUser);
  router.put("/api/users/:id", updateUser);
  router.delete("/api/users/:id", deleteUser);
}
