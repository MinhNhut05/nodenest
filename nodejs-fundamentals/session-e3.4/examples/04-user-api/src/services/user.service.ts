/**
 * 04-user-api/src/services/user.service.ts
 *
 * User business logic layer
 */

import { UserModel } from '../models/user.model';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
} from '../types/user.types';

/**
 * Custom error với status code
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

/**
 * UserService - Business logic layer
 */
export class UserService {
  /**
   * Get all users
   */
  static findAll(): UserResponse[] {
    const users = UserModel.findAll();
    return users.map((u) => this.toResponse(u));
  }

  /**
   * Get user by ID
   */
  static findById(id: number): UserResponse {
    const user = UserModel.findById(id);
    if (!user) {
      throw new ServiceError('User not found', 404);
    }
    return this.toResponse(user);
  }

  /**
   * Create new user
   */
  static create(data: CreateUserDto): UserResponse {
    // Validate required fields
    if (!data.name?.trim()) {
      throw new ServiceError('Name is required');
    }
    if (!data.email?.trim()) {
      throw new ServiceError('Email is required');
    }
    if (!data.password) {
      throw new ServiceError('Password is required');
    }

    // Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new ServiceError('Invalid email format');
    }

    // Check email unique
    if (UserModel.findByEmail(data.email)) {
      throw new ServiceError('Email already exists', 409);
    }

    // Validate password strength
    if (data.password.length < 6) {
      throw new ServiceError('Password must be at least 6 characters');
    }

    // Hash password
    const hashedPassword = this.hashPassword(data.password);

    // Create user
    const user = UserModel.create({
      ...data,
      password: hashedPassword,
    });

    return this.toResponse(user);
  }

  /**
   * Update user
   */
  static update(id: number, data: UpdateUserDto): UserResponse {
    const existing = UserModel.findById(id);
    if (!existing) {
      throw new ServiceError('User not found', 404);
    }

    // If updating email, validate and check unique
    if (data.email) {
      if (!this.isValidEmail(data.email)) {
        throw new ServiceError('Invalid email format');
      }

      const emailUser = UserModel.findByEmail(data.email);
      if (emailUser && emailUser.id !== id) {
        throw new ServiceError('Email already exists', 409);
      }
    }

    const updated = UserModel.update(id, data);
    if (!updated) {
      throw new ServiceError('Failed to update user', 500);
    }

    return this.toResponse(updated);
  }

  /**
   * Delete user
   */
  static delete(id: number): void {
    const existing = UserModel.findById(id);
    if (!existing) {
      throw new ServiceError('User not found', 404);
    }

    const deleted = UserModel.delete(id);
    if (!deleted) {
      throw new ServiceError('Failed to delete user', 500);
    }
  }

  // ============ Private Helpers ============

  /**
   * Convert User to UserResponse (exclude password)
   */
  private static toResponse(user: User): UserResponse {
    const { password, ...response } = user;
    return response;
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Hash password (simplified - use bcrypt in production)
   */
  private static hashPassword(password: string): string {
    return `hashed_${password}_${Date.now()}`;
  }
}
