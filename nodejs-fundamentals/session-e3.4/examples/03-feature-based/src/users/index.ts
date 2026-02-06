/**
 * 03-feature-based/src/users/index.ts
 *
 * Barrel export - Export tất cả từ users module
 * Giúp import gọn: import { UserService } from './users'
 */

export * from './user.types';
export * from './user.model';
export * from './user.service';
export * from './user.controller';
export * from './user.routes';
