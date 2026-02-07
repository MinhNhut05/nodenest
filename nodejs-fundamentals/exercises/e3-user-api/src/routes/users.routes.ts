/**
 * ============================================
 * BÀI 1: ROUTING & HTTP METHODS
 * ============================================
 *
 * Điền code vào chỗ [...] để hoàn thành routes
 *
 * Kiến thức cần nhớ:
 * - RESTful API conventions
 * - HTTP Methods: GET, POST, PUT, PATCH, DELETE
 * - Route params: /users/:id
 * - Middleware chain: router.post('/path', middleware1, middleware2, controller)
 */

import { Router } from "express";
import {
  registerController,
  loginController,
  getProfileController,
  updateProfileController,
} from "../controllers/users.controllers";
import {
  registerValidator,
  loginValidator,
  accessTokenValidator,
} from "../middlewares/users.middlewares";

const router = Router();

/**
 * Route: Register user
 * Path: /users/register
 * Method: POST
 * Body: { name, email, password }
 */
// TODO 1: Điền HTTP method và middleware chain
// Gợi ý: router.[METHOD](path, validator, controller)
router.post("/register", registerValidator, registerController);

/**
 * Route: Login user
 * Path: /users/login
 * Method: POST
 * Body: { email, password }
 */
// TODO 2: Điền HTTP method và middleware chain
router.post("/login", loginValidator, loginController);

/**
 * Route: Get user profile
 * Path: /users/me
 * Method: GET
 * Headers: Authorization: Bearer <token>
 */
// TODO 3: Điền HTTP method (không cần body, chỉ cần auth)
router.get("/me", accessTokenValidator, getProfileController);

/**
 * Route: Update user profile
 * Path: /users/me
 * Method: PATCH (partial update)
 * Headers: Authorization: Bearer <token>
 * Body: { name?, date_of_birth?, bio? }
 */
// TODO 4: Điền HTTP method phù hợp để partial update
// Câu hỏi: Tại sao dùng PATCH thay vì PUT?
// patch sua 1 phan put thay the toan bo
router.patch("/me", accessTokenValidator, updateProfileController);

export default router;
