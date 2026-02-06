/**
 * 02-layer-based/src/types/user.types.ts
 *
 * User interfaces và DTOs
 * DTO = Data Transfer Object (object dùng để truyền data giữa các layers)
 */

// User entity - đại diện cho 1 user trong database
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// DTO để tạo user mới (không có id, createdAt vì server tự generate)
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

// DTO để update user (tất cả fields optional)
export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// User response (không trả password ra ngoài)
export type UserResponse = Omit<User, 'password'>;

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
