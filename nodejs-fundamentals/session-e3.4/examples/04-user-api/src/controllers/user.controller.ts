/**
 * 04-user-api/src/controllers/user.controller.ts
 *
 * User HTTP controller
 */

import http from 'http';
import { UserService, ServiceError } from '../services/user.service';
import { CreateUserDto, UpdateUserDto } from '../types/user.types';
import { sendSuccess, sendError, HTTP_STATUS } from '../utils/response';
import { parseBody } from '../utils/parse-body';

/**
 * UserController - HTTP request handling
 */
export class UserController {
  /**
   * GET /users - Get all users
   */
  static async getAll(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      const users = UserService.findAll();
      sendSuccess(res, users, HTTP_STATUS.OK, { total: users.length });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * GET /users/:id - Get user by ID
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
      this.handleError(res, error);
    }
  }

  /**
   * POST /users - Create new user
   */
  static async create(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      const body = await parseBody<CreateUserDto>(req);
      const user = UserService.create(body);
      sendSuccess(res, user, HTTP_STATUS.CREATED);
    } catch (error) {
      this.handleError(res, error);
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
      if (Object.keys(body).length === 0) {
        sendError(res, 'No fields to update', HTTP_STATUS.BAD_REQUEST);
        return;
      }

      const user = UserService.update(id, body);
      sendSuccess(res, user);
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * DELETE /users/:id - Delete user
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
      this.handleError(res, error);
    }
  }

  /**
   * Handle errors and send appropriate response
   */
  private static handleError(res: http.ServerResponse, error: unknown): void {
    if (error instanceof ServiceError) {
      sendError(res, error.message, error.statusCode);
    } else if (error instanceof Error) {
      console.error('Unexpected error:', error);
      sendError(res, error.message, HTTP_STATUS.INTERNAL_ERROR);
    } else {
      sendError(res, 'Unknown error', HTTP_STATUS.INTERNAL_ERROR);
    }
  }
}
