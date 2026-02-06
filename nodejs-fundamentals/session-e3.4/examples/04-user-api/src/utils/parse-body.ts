/**
 * 04-user-api/src/utils/parse-body.ts
 *
 * Utility để parse request body
 */

import http from 'http';

/**
 * Parse JSON body từ request
 * @throws Error nếu body không phải JSON hợp lệ
 */
export function parseBody<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk);
    });

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');

      if (!body) {
        resolve({} as T);
        return;
      }

      try {
        const parsed = JSON.parse(body);
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

/**
 * Parse query string thành object
 */
export function parseQuery(url: string): Record<string, string> {
  const queryString = url.split('?')[1] || '';
  const params: Record<string, string> = {};

  if (!queryString) return params;

  queryString.split('&').forEach((pair) => {
    const [key, value] = pair.split('=');
    if (key) {
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
  });

  return params;
}
