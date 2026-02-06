/**
 * 03-feature-based/src/shared/utils/response.ts
 *
 * Shared utilities - dùng chung cho tất cả features
 */

import http from 'http';

export function sendSuccess<T>(
  res: http.ServerResponse,
  data: T,
  statusCode: number = 200
): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, data }));
}

export function sendError(
  res: http.ServerResponse,
  message: string,
  statusCode: number = 400
): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: false, message }));
}

export function parseBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}
