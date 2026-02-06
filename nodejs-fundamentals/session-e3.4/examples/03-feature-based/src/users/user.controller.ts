/**
 * 03-feature-based/src/users/user.controller.ts
 *
 * User controller - HTTP handling
 */

import http from 'http';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './user.types';
import { sendSuccess, sendError, parseBody } from '../shared/utils/response';

export class UserController {
  static async getAll(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      sendSuccess(res, UserService.findAll());
    } catch (error) {
      sendError(res, (error as Error).message, 500);
    }
  }

  static async getById(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      sendSuccess(res, UserService.findById(id));
    } catch (error) {
      const msg = (error as Error).message;
      sendError(res, msg, msg === 'User not found' ? 404 : 500);
    }
  }

  static async create(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    try {
      const body = await parseBody<CreateUserDto>(req);
      if (!body.name || !body.email || !body.password) {
        sendError(res, 'Name, email and password are required', 400);
        return;
      }
      sendSuccess(res, UserService.create(body), 201);
    } catch (error) {
      sendError(res, (error as Error).message, 400);
    }
  }

  static async update(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      const body = await parseBody<UpdateUserDto>(req);
      if (!body.name && !body.email) {
        sendError(res, 'At least name or email is required', 400);
        return;
      }
      sendSuccess(res, UserService.update(id, body));
    } catch (error) {
      const msg = (error as Error).message;
      sendError(res, msg, msg === 'User not found' ? 404 : 400);
    }
  }

  static async delete(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    id: number
  ): Promise<void> {
    try {
      UserService.delete(id);
      sendSuccess(res, { message: 'User deleted' });
    } catch (error) {
      const msg = (error as Error).message;
      sendError(res, msg, msg === 'User not found' ? 404 : 500);
    }
  }
}
