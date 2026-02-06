/**
 * 04-user-api/src/models/user.model.ts
 *
 * User data model - Data access layer
 */

import { User, CreateUserDto, UpdateUserDto, UserRole } from '../types/user.types';

// In-memory database
const users: User[] = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashed_admin123',
    role: UserRole.ADMIN,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashed_john123',
    role: UserRole.USER,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 3,
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'hashed_jane123',
    role: UserRole.USER,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

let nextId = 4;

/**
 * UserModel - Pure data access, no business logic
 */
export class UserModel {
  /**
   * Get all users
   */
  static findAll(): User[] {
    return [...users]; // Return copy
  }

  /**
   * Find user by ID
   */
  static findById(id: number): User | undefined {
    return users.find((u) => u.id === id);
  }

  /**
   * Find user by email
   */
  static findByEmail(email: string): User | undefined {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Create new user
   */
  static create(data: CreateUserDto & { password: string }): User {
    const now = new Date();
    const newUser: User = {
      id: nextId++,
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      password: data.password,
      role: data.role || UserRole.USER,
      createdAt: now,
      updatedAt: now,
    };
    users.push(newUser);
    return newUser;
  }

  /**
   * Update user
   */
  static update(id: number, data: UpdateUserDto): User | undefined {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;

    users[index] = {
      ...users[index],
      ...data,
      updatedAt: new Date(),
    };

    return users[index];
  }

  /**
   * Delete user
   */
  static delete(id: number): boolean {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }

  /**
   * Count total users
   */
  static count(): number {
    return users.length;
  }
}
