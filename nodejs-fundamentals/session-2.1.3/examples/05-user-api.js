/**
 * ============================================================================
 *                      05 - USER API (MINI PROJECT)
 * ============================================================================
 *
 * Kết hợp tất cả kiến thức đã học:
 * - Đọc raw body (chunks)
 * - Parse JSON
 * - Parse URL-encoded form
 * - Validation
 *
 * API Endpoints:
 * - POST /api/users (JSON) - Tạo user từ JSON
 * - POST /api/users/form (URL-encoded) - Tạo user từ form
 * - GET /api/users - Lấy danh sách users
 * - GET / - HTML form để test
 *
 * Chạy: node 05-user-api.js
 */

import http from 'http';

// ═══════════════════════════════════════════════════════════════════════════
//                            FAKE DATABASE
// ═══════════════════════════════════════════════════════════════════════════

const users = [];

// ═══════════════════════════════════════════════════════════════════════════
//                         HELPER: PARSE BODY
// ═══════════════════════════════════════════════════════════════════════════

function parseBody(req) {
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
        // Parse theo Content-Type
        if (contentType.includes('application/json')) {
          resolve({ type: 'json', data: JSON.parse(body) });
        } else if (contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(body);
          const data = Object.fromEntries(params);
          // Convert age sang number
          if (data.age) data.age = parseInt(data.age, 10);
          resolve({ type: 'form', data });
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

// ═══════════════════════════════════════════════════════════════════════════
//                         VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

function validateUser(data) {
  const errors = [];

  // Required
  if (!data.name || !data.name.trim()) {
    errors.push('Name is required');
  }

  if (!data.email || !data.email.trim()) {
    errors.push('Email is required');
  }

  // Format - Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }

  // Range - Age
  if (data.age !== undefined && data.age !== null) {
    if (typeof data.age !== 'number' || isNaN(data.age)) {
      errors.push('Age must be a number');
    } else if (data.age < 0 || data.age > 150) {
      errors.push('Age must be between 0 and 150');
    }
  }

  // Length - Name
  if (data.name && (data.name.length < 2 || data.name.length > 50)) {
    errors.push('Name must be 2-50 characters');
  }

  return { valid: errors.length === 0, errors };
}

// ═══════════════════════════════════════════════════════════════════════════
//                              HTTP SERVER
// ═══════════════════════════════════════════════════════════════════════════

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  console.log(`\n📥 ${method} ${url}`);

  // Helpers
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  const sendHtml = (html) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
  };

  // ─────────────────────────────────────────────────────────────────────────
  //                     GET / - HTML Form
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'GET' && url === '/') {
    sendHtml(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>User API - Mini Project</title>
        <style>
          body { font-family: Arial; max-width: 600px; margin: 50px auto; padding: 20px; }
          h1 { color: #333; }
          .form-box { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
          input, button { padding: 10px; margin: 5px 0; width: 100%; box-sizing: border-box; }
          button { background: #007bff; color: white; border: none; cursor: pointer; }
          button:hover { background: #0056b3; }
          .users { background: #e8f5e9; padding: 15px; border-radius: 8px; }
          pre { background: #263238; color: #aed581; padding: 15px; border-radius: 8px; overflow-x: auto; }
        </style>
      </head>
      <body>
        <h1>👥 User API - Mini Project</h1>

        <div class="form-box">
          <h3>📝 Tạo User (Form)</h3>
          <form action="/api/users/form" method="POST">
            <input type="text" name="name" placeholder="Name" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="number" name="age" placeholder="Age (optional)">
            <button type="submit">Submit (URL-encoded)</button>
          </form>
        </div>

        <div class="users">
          <h3>📋 Xem danh sách users</h3>
          <p>GET <a href="/api/users">/api/users</a></p>
        </div>

        <h3>🧪 Test với Postman</h3>
        <pre>
POST /api/users (JSON)
Content-Type: application/json
{
  "name": "Leminho",
  "email": "leminho@test.com",
  "age": 25
}

POST /api/users/form (URL-encoded)
Content-Type: application/x-www-form-urlencoded
name=Leminho&email=leminho@test.com&age=25
        </pre>
      </body>
      </html>
    `);
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //                     GET /api/users - Lấy danh sách
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'GET' && url === '/api/users') {
    sendJson(200, {
      success: true,
      count: users.length,
      users: users,
    });
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //                POST /api/users - Tạo user (JSON)
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'POST' && url === '/api/users') {
    try {
      const { type, data } = await parseBody(req);
      console.log(`📦 Parsed (${type}):`, data);

      // Validate
      const validation = validateUser(data);
      if (!validation.valid) {
        sendJson(400, { success: false, errors: validation.errors });
        return;
      }

      // Tạo user
      const newUser = {
        id: users.length + 1,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        age: data.age || null,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      console.log('✅ Created user:', newUser);

      sendJson(201, {
        success: true,
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      sendJson(error.status || 500, { success: false, error: error.message });
    }
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //            POST /api/users/form - Tạo user (URL-encoded)
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'POST' && url === '/api/users/form') {
    try {
      const { type, data } = await parseBody(req);
      console.log(`📦 Parsed (${type}):`, data);

      // Validate
      const validation = validateUser(data);
      if (!validation.valid) {
        sendJson(400, { success: false, errors: validation.errors });
        return;
      }

      // Tạo user
      const newUser = {
        id: users.length + 1,
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        age: data.age || null,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      console.log('✅ Created user:', newUser);

      sendJson(201, {
        success: true,
        message: 'User created from form',
        user: newUser,
      });
    } catch (error) {
      sendJson(error.status || 500, { success: false, error: error.message });
    }
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //                              404
  // ─────────────────────────────────────────────────────────────────────────
  sendJson(404, {
    error: 'Not Found',
    availableEndpoints: [
      'GET /',
      'GET /api/users',
      'POST /api/users (JSON)',
      'POST /api/users/form (URL-encoded)',
    ],
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    USER API - MINI PROJECT                 ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('📌 Endpoints:');
  console.log('   GET  /              → HTML form');
  console.log('   GET  /api/users     → Lấy danh sách users');
  console.log('   POST /api/users     → Tạo user (JSON body)');
  console.log('   POST /api/users/form → Tạo user (form data)');
  console.log('');
  console.log('🌐 Mở browser: http://localhost:3000');
  console.log('═══════════════════════════════════════════════════════════');
});
