/**
 * 02-layer-based/src/controllers/user.controller.ts
 *
 * Controller layer - Xử lý HTTP Request/Response
 * - Nhận request từ route
 * - Parse data từ request
 * - Gọi service
 * - Trả response
 *
 * Controller KHÔNG chứa business logic!
 */

import http from 'http';
import { UserService } from '../services/user.service';
import { sendSuccess, sendError, parseBody } from '../utils/response';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';

/**
 * UserController - HTTP Layer
 * Chỉ lo việc HTTP, delegate logic cho Service
 */
export class UserController {
  /**
   * GET /users - Lấy tất cả users
   */
  static async getAll(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      const users = UserService.findAll();
      sendSuccess(res, users);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      sendError(res, message, 500);
    }
  }

  /**
   * GET /users/:id - Lấy user theo ID
   */
  static async getById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      const user = UserService.findById(id);
      sendSuccess(res, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = message === 'User not found' ? 404 : 500;
      sendError(res, message, statusCode);
    }
  }

  /**
   * POST /users - Tạo user mới
   */
  static async create(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      const body = await parseBody<CreateUserDto>(req);

      // Validate required fields (input validation)
      if (!body.name || !body.email || !body.password) {
        sendError(res, 'Name, email and password are required', 400);
        return;
      }

      const user = UserService.create(body);
      sendSuccess(res, user, 201); // 201 Created
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      sendError(res, message, 400);
    }
  }

  /**
   * PUT /users/:id - Update user
   */
  static async update(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      const body = await parseBody<UpdateUserDto>(req);

      // Validate có gì để update không
      if (!body.name && !body.email) {
        sendError(res, 'At least name or email is required', 400);
        return;
      }

      const user = UserService.update(id, body);
      sendSuccess(res, user);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = message === 'User not found' ? 404 : 400;
      sendError(res, message, statusCode);
    }
  }

  /**
   * DELETE /users/:id - Xóa user
   */
  static async delete(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      UserService.delete(id);
      sendSuccess(res, { message: 'User deleted successfully' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = message === 'User not found' ? 404 : 500;
      sendError(res, message, statusCode);
    }
  }
}
