/**
 * ============================================
 * BÀI 3: MIDDLEWARE PATTERN
 * ============================================
 *
 * Viết middleware từ đầu (có hướng dẫn)
 *
 * Kiến thức cần nhớ:
 * - Middleware nhận (req, res, next)
 * - Gọi next() để chuyển sang middleware/controller tiếp theo
 * - Gọi next(error) để chuyển đến error handler
 * - Không gọi next() = request bị treo (hanging)
 */

import { Request, Response, NextFunction } from "express";
import HttpStatus from "../constants/httpStatus";
import { USERS_MESSAGES } from "../constants/message";

/**
 * Register Validator Middleware
 * Validate: name, email, password bắt buộc
 */
export const registerValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, password } = req.body;

  // TODO 1: Kiểm tra nếu thiếu field thì trả về lỗi 422
  // Nếu hợp lệ thì gọi next()

  // Code của bạn ở đây:
  if (!name || !email || !password) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: USERS_MESSAGES.VALIDATION_ERROR
    });
  }
  next();
};

/**
 * Login Validator Middleware
 * Validate: email, password bắt buộc
 */
export const loginValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // TODO 2: Tương tự registerValidator
  // Kiểm tra email và password

  // Code của bạn ở đây:
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      message: USERS_MESSAGES.VALIDATION_ERROR
    });
  }
  next();
};

/**
 * Access Token Validator Middleware
 * Kiểm tra header Authorization có Bearer token
 */
export const accessTokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;

  // TODO 3: Kiểm tra authorization header
  // Format: "Bearer <token>"
  // Nếu không có hoặc sai format → 401 Unauthorized
  // Nếu OK → decode và gắn vào req, rồi next()

  // Gợi ý:
  // 1. Kiểm tra authorization có tồn tại không
  // 2. Kiểm tra có bắt đầu bằng "Bearer " không
  // 3. Lấy token = authorization.split(' ')[1]
  // 4. (Giả lập) Decode token và gắn user_id vào req
  // 5. Gọi next()

  // Code của bạn ở đây:
  if (!authorization) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Access token is required'
    });
  }

  const [type, token] = authorization.split(' ');

  if (type !== 'Bearer' || !token) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Invalid token format'
    });
  }

  // Giả lập decode token
  try {
    const userId = token.replace('fake_access_token_', '');
    // Gắn user_id vào req để controller dùng
    (req as any).decoded_authorization = { user_id: userId };
    next();
  } catch (error) {
    return res.status(HttpStatus.UNAUTHORIZED).json({
      message: 'Invalid token'
    });
  }
};

