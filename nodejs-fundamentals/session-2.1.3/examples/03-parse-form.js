/**
 * ============================================================================
 *                       03 - PARSE FORM DATA
 * ============================================================================
 *
 * Demo cách parse URL-encoded form data từ HTTP request.
 * Đây là format mặc định khi HTML form submit với method="POST".
 *
 * Format: name=Leminho&email=test%40mail.com&age=25
 *
 * Chạy: node 03-parse-form.js
 */

import http from 'http';

// ═══════════════════════════════════════════════════════════════════════════
//                    HELPER: PARSE URL-ENCODED BODY
// ═══════════════════════════════════════════════════════════════════════════

function parseFormBody(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'];

    // Check Content-Type
    if (!contentType || !contentType.includes('application/x-www-form-urlencoded')) {
      reject({
        status: 415,
        message: 'Content-Type must be application/x-www-form-urlencoded',
      });
      return;
    }

    const chunks = [];

    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');

      if (!body || body.trim() === '') {
        reject({ status: 400, message: 'Request body is empty' });
        return;
      }

      // Parse bằng URLSearchParams
      const params = new URLSearchParams(body);

      // Convert sang object
      const data = Object.fromEntries(params);

      // LƯU Ý: Tất cả values đều là STRING!
      // Cần convert manually nếu muốn number/boolean
      resolve(data);
    });

    req.on('error', (error) => {
      reject({ status: 500, message: error.message });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//                              HTTP SERVER
// ═══════════════════════════════════════════════════════════════════════════

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  console.log(`\n📥 ${method} ${url}`);

  // Helper gửi JSON response
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  // Helper gửi HTML response
  const sendHtml = (html) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  };

  // ─────────────────────────────────────────────────────────────────────────
  //                     GET / - Hiển thị HTML form
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'GET' && url === '/') {
    sendHtml(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Form Demo</title>
        <style>
          body { font-family: Arial; max-width: 400px; margin: 50px auto; }
          input, button { padding: 10px; margin: 5px 0; width: 100%; box-sizing: border-box; }
          button { background: #007bff; color: white; border: none; cursor: pointer; }
          button:hover { background: #0056b3; }
        </style>
      </head>
      <body>
        <h2>📝 Register Form</h2>
        <form action="/api/register" method="POST">
          <input type="text" name="name" placeholder="Name" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="number" name="age" placeholder="Age" required>
          <button type="submit">Submit</button>
        </form>
        <p><small>Form sẽ gửi với Content-Type: application/x-www-form-urlencoded</small></p>
      </body>
      </html>
    `);
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //                     POST /api/register - Xử lý form
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'POST' && url === '/api/register') {
    try {
      const data = await parseFormBody(req);

      console.log('✅ Form data:', data);
      console.log('📊 Tất cả values là string:', Object.values(data).map(v => typeof v));

      // Convert age sang number (vì URL-encoded luôn là string)
      const user = {
        name: data.name,
        email: data.email,
        age: parseInt(data.age, 10), // Convert string → number
      };

      console.log('👤 User sau khi convert:', user);

      sendJson(200, {
        success: true,
        message: 'Form submitted successfully!',
        rawData: data,           // Tất cả là string
        convertedUser: user,     // age đã convert sang number
      });
    } catch (error) {
      sendJson(error.status || 400, {
        success: false,
        error: error.message,
      });
    }
    return;
  }

  // 404
  sendJson(404, { error: 'Not Found' });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📋 Cách test:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ Cách 1: Mở browser');
  console.log('   → http://localhost:3000');
  console.log('   → Điền form và Submit');
  console.log('');
  console.log('✅ Cách 2: Postman');
  console.log('   POST http://localhost:3000/api/register');
  console.log('   Header: Content-Type: application/x-www-form-urlencoded');
  console.log('   Body tab → x-www-form-urlencoded');
  console.log('   Thêm: name=Leminho, email=test@mail.com, age=25');
  console.log('═══════════════════════════════════════════════════════════');
});
