/**
 * 03-feature-based/src/users/user.types.ts
 *
 * User types - Nằm trong folder users/
 * Feature-based: tất cả về User ở cùng 1 chỗ
 */

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

export type UserResponse = Omit<User, 'password'>;
