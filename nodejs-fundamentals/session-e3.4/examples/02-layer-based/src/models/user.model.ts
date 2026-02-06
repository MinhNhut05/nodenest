/**
 * 02-layer-based/src/models/user.model.ts
 *
 * Model layer - Quản lý data và tương tác với "database"
 * Trong thực tế sẽ dùng ORM (TypeORM, Prisma) để connect database thật
 */

import { User, CreateUserDto, UpdateUserDto } from '../types/user.types';

// In-memory database (chỉ để demo)
const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_password_1',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashed_password_2',
    createdAt: new Date('2024-01-15'),
  },
];

let nextId = 3;

/**
 * UserModel - Data Access Layer
 * Chỉ làm việc với data, không có business logic
 */
export class UserModel {
  // Lấy tất cả users
  static findAll(): User[] {
    return [...users]; // Return copy để tránh mutation
  }

  // Tìm user theo ID
  static findById(id: number): User | undefined {
    return users.find((user) => user.id === id);
  }

  // Tìm user theo email
  static findByEmail(email: string): User | undefined {
    return users.find((user) => user.email === email);
  }

  // Tạo user mới
  static create(data: CreateUserDto & { password: string }): User {
    const newUser: User = {
      id: nextId++,
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  }

  // Update user
  static update(id: number, data: UpdateUserDto): User | undefined {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    users[index] = {
      ...users[index],
      ...data,
    };
    return users[index];
  }

  // Xóa user
  static delete(id: number): boolean {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }
}
