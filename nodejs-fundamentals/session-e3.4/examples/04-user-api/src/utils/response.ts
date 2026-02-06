/**
 * 04-user-api/src/utils/response.ts
 *
 * HTTP Response utilities
 */

import http from 'http';
import { ApiResponse } from '../types/user.types';

/**
 * Send JSON response
 */
function sendJson<T>(
  res: http.ServerResponse,
  statusCode: number,
  data: ApiResponse<T>
): void {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'X-Powered-By': 'User-API-Demo',
  });
  res.end(JSON.stringify(data));
}

/**
 * Send success response
 */
export function sendSuccess<T>(
  res: http.ServerResponse,
  data: T,
  statusCode: number = 200,
  meta?: ApiResponse<T>['meta']
): void {
  sendJson(res, statusCode, { success: true, data, meta });
}

/**
 * Send error response
 */
export function sendError(
  res: http.ServerResponse,
  message: string,
  statusCode: number = 400
): void {
  sendJson(res, statusCode, { success: false, message });
}

/**
 * HTTP Status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;
