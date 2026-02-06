/**
 * 02-layer-based/src/services/user.service.ts
 *
 * Service layer - Business Logic
 * - Validate business rules
 * - Transform data
 * - Gọi Model để truy cập data
 */

import { UserModel } from '../models/user.model';
import {
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponse,
} from '../types/user.types';

/**
 * UserService - Business Logic Layer
 * Xử lý logic nghiệp vụ, không quan tâm đến HTTP
 */
export class UserService {
  /**
   * Lấy tất cả users (loại bỏ password)
   */
  static findAll(): UserResponse[] {
    const users = UserModel.findAll();
    return users.map((user) => this.excludePassword(user));
  }

  /**
   * Tìm user theo ID
   * @throws Error nếu không tìm thấy
   */
  static findById(id: number): UserResponse {
    const user = UserModel.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return this.excludePassword(user);
  }

  /**
   * Tạo user mới
   * - Check email đã tồn tại chưa
   * - Hash password (giả lập)
   */
  static create(data: CreateUserDto): UserResponse {
    // Business rule: Email phải unique
    const existingUser = UserModel.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Business rule: Validate email format
    if (!this.isValidEmail(data.email)) {
      throw new Error('Invalid email format');
    }

    // Business rule: Password phải >= 6 ký tự
    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password trước khi lưu
    const hashedPassword = this.hashPassword(data.password);

    const newUser = UserModel.create({
      ...data,
      password: hashedPassword,
    });

    return this.excludePassword(newUser);
  }

  /**
   * Update user
   * - Check user tồn tại
   * - Nếu update email, check unique
   */
  static update(id: number, data: UpdateUserDto): UserResponse {
    const existingUser = UserModel.findById(id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Nếu update email, check unique
    if (data.email && data.email !== existingUser.email) {
      const emailExists = UserModel.findByEmail(data.email);
      if (emailExists) {
        throw new Error('Email already exists');
      }
    }

    const updatedUser = UserModel.update(id, data);
    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return this.excludePassword(updatedUser);
  }

  /**
   * Xóa user
   */
  static delete(id: number): void {
    const deleted = UserModel.delete(id);
    if (!deleted) {
      throw new Error('User not found');
    }
  }

  // ============ Private Helper Methods ============

  /**
   * Loại bỏ password khỏi user object
   */
  private static excludePassword(user: User): UserResponse {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Validate email format
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Hash password (giả lập - thực tế dùng bcrypt)
   */
  private static hashPassword(password: string): string {
    // Trong thực tế: return await bcrypt.hash(password, 10);
    return `hashed_${password}_${Date.now()}`;
  }
}
