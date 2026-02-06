/**
 * 02-layer-based/src/utils/response.ts
 *
 * Utility functions để xử lý HTTP response
 * Giúp controller code ngắn gọn và consistent
 */

import http from 'http';

/**
 * Gửi JSON response thành công
 */
export function sendSuccess<T>(
  res: http.ServerResponse,
  data: T,
  statusCode: number = 200
): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      success: true,
      data,
    })
  );
}

/**
 * Gửi JSON response lỗi
 */
export function sendError(
  res: http.ServerResponse,
  message: string,
  statusCode: number = 400
): void {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(
    JSON.stringify({
      success: false,
      message,
    })
  );
}

/**
 * Parse request body thành JSON
 */
export function parseBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed as T);
      } catch {
        reject(new Error('Invalid JSON body'));
      }
    });

    req.on('error', (err) => {
      reject(err);
    });
  });
}
