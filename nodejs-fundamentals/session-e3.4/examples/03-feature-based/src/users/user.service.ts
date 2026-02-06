/**
 * 03-feature-based/src/users/user.service.ts
 *
 * User service - Business logic
 */

import { UserModel } from './user.model';
import { User, CreateUserDto, UpdateUserDto, UserResponse } from './user.types';

export class UserService {
  static findAll(): UserResponse[] {
    return UserModel.findAll().map((u) => this.excludePassword(u));
  }

  static findById(id: number): UserResponse {
    const user = UserModel.findById(id);
    if (!user) throw new Error('User not found');
    return this.excludePassword(user);
  }

  static create(data: CreateUserDto): UserResponse {
    if (UserModel.findByEmail(data.email)) {
      throw new Error('Email already exists');
    }

    if (data.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const hashedPassword = `hashed_${data.password}_${Date.now()}`;
    const user = UserModel.create({ ...data, password: hashedPassword });
    return this.excludePassword(user);
  }

  static update(id: number, data: UpdateUserDto): UserResponse {
    const existing = UserModel.findById(id);
    if (!existing) throw new Error('User not found');

    if (data.email && data.email !== existing.email) {
      if (UserModel.findByEmail(data.email)) {
        throw new Error('Email already exists');
      }
    }

    const updated = UserModel.update(id, data);
    if (!updated) throw new Error('Failed to update');
    return this.excludePassword(updated);
  }

  static delete(id: number): void {
    if (!UserModel.delete(id)) {
      throw new Error('User not found');
    }
  }

  private static excludePassword(user: User): UserResponse {
    const { password, ...rest } = user;
    return rest;
  }
}
