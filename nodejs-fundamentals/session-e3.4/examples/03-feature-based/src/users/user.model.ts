/**
 * 03-feature-based/src/users/user.model.ts
 *
 * User model - Data access layer
 */

import { User, CreateUserDto, UpdateUserDto } from './user.types';

// In-memory database
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

export class UserModel {
  static findAll(): User[] {
    return [...users];
  }

  static findById(id: number): User | undefined {
    return users.find((u) => u.id === id);
  }

  static findByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email);
  }

  static create(data: CreateUserDto & { password: string }): User {
    const newUser: User = {
      id: nextId++,
      ...data,
      createdAt: new Date(),
    };
    users.push(newUser);
    return newUser;
  }

  static update(id: number, data: UpdateUserDto): User | undefined {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return undefined;
    users[index] = { ...users[index], ...data };
    return users[index];
  }

  static delete(id: number): boolean {
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
  }
}
