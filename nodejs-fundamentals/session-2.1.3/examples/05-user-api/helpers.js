/**
 * Helper functions để parse request body
 */

export function parseBody(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'] || '';
    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');

      if (!body.trim()) {
        reject({ status: 400, message: 'Request body is empty' });
        return;
      }

      try {
        if (contentType.includes('application/json')) {
          resolve(JSON.parse(body));
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(body);
          const data = Object.fromEntries(params);
          if (data.age) data.age = parseInt(data.age, 10);
          resolve(data);
        } else {
          reject({ status: 415, message: 'Unsupported Content-Type' });
        }
      } catch (error) {
        reject({ status: 400, message: 'Parse error: ' + error.message });
      }
    });

    req.on('error', (error) => reject({ status: 500, message: error.message }));
  });
}

export function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
}

export function sendHtml(res, html) {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}
