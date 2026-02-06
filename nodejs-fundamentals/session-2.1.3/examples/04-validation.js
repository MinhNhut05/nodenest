/**
 * ============================================================================
 *                         04 - BODY VALIDATION
 * ============================================================================
 *
 * Demo cách validate request body trước khi xử lý.
 * - Required fields
 * - Type checking
 * - Format checking (email)
 * - Range checking (age)
 *
 * Chạy: node 04-validation.js
 */

import http from 'http';

// ═══════════════════════════════════════════════════════════════════════════
//                         HELPER: PARSE JSON BODY
// ═══════════════════════════════════════════════════════════════════════════

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'];

    if (!contentType || !contentType.includes('application/json')) {
      reject({ status: 415, message: 'Content-Type must be application/json' });
      return;
    }

    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));

    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');

      if (!body.trim()) {
        reject({ status: 400, message: 'Request body is empty' });
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject({ status: 400, message: 'Invalid JSON: ' + error.message });
      }
    });

    req.on('error', (error) => reject({ status: 500, message: error.message }));
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//                         VALIDATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

function validateUser(data) {
  const errors = [];

  // ─────────────────────────────────────────────────────────────────────────
  // 1. REQUIRED FIELDS - Kiểm tra field bắt buộc
  // ─────────────────────────────────────────────────────────────────────────
  if (!data.name) {
    errors.push('Name is required');
  }

  if (!data.email) {
    errors.push('Email is required');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. TYPE CHECKING - Kiểm tra kiểu dữ liệu
  // ─────────────────────────────────────────────────────────────────────────
  if (data.name && typeof data.name !== 'string') {
    errors.push('Name must be a string');
  }

  if (data.age !== undefined && typeof data.age !== 'number') {
    errors.push('Age must be a number');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. FORMAT CHECKING - Kiểm tra định dạng
  // ─────────────────────────────────────────────────────────────────────────
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push('Invalid email format');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. RANGE CHECKING - Kiểm tra phạm vi
  // ─────────────────────────────────────────────────────────────────────────
  if (typeof data.age === 'number' && (data.age < 0 || data.age > 150)) {
    errors.push('Age must be between 0 and 150');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 5. LENGTH CHECKING - Kiểm tra độ dài
  // ─────────────────────────────────────────────────────────────────────────
  if (data.name && data.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (data.name && data.name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Trả về kết quả
  // ─────────────────────────────────────────────────────────────────────────
  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//                              HTTP SERVER
// ═══════════════════════════════════════════════════════════════════════════

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  console.log(`\n📥 ${method} ${url}`);

  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  // ─────────────────────────────────────────────────────────────────────────
  //                     POST /api/users - Tạo user mới
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'POST' && url === '/api/users') {
    try {
      // Step 1: Parse JSON body
      const data = await parseJsonBody(req);
      console.log('📦 Received data:', data);

      // Step 2: Validate
      const validation = validateUser(data);
      console.log('✅ Validation result:', validation);

      // Step 3: Check validation result
      if (!validation.valid) {
        // Validation failed → return 400
        sendJson(400, {
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        });
        return;
      }

      // Step 4: Validation passed → xử lý (tạo user, lưu DB,...)
      const newUser = {
        id: Date.now(), // Fake ID
        name: data.name,
        email: data.email,
        age: data.age || null,
        createdAt: new Date().toISOString(),
      };

      console.log('👤 Created user:', newUser);

      sendJson(201, {
        success: true,
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      console.log('❌ Error:', error.message);
      sendJson(error.status || 500, {
        success: false,
        error: error.message,
      });
    }
    return;
  }

  // 404
  sendJson(404, {
    error: 'Not Found',
    hint: 'Try POST /api/users with JSON body',
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📋 Test với Postman:');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log('✅ Test 1: Data hợp lệ');
  console.log('   POST http://localhost:3000/api/users');
  console.log('   Body: {"name": "Leminho", "email": "test@mail.com", "age": 25}');
  console.log('   → Expect: 201 Created');
  console.log('');
  console.log('❌ Test 2: Thiếu name');
  console.log('   Body: {"email": "test@mail.com"}');
  console.log('   → Expect: 400 + error "Name is required"');
  console.log('');
  console.log('❌ Test 3: Email sai format');
  console.log('   Body: {"name": "Leminho", "email": "invalid-email"}');
  console.log('   → Expect: 400 + error "Invalid email format"');
  console.log('');
  console.log('❌ Test 4: Age không hợp lệ');
  console.log('   Body: {"name": "Leminho", "email": "test@mail.com", "age": -5}');
  console.log('   → Expect: 400 + error "Age must be between 0 and 150"');
  console.log('');
  console.log('❌ Test 5: Nhiều lỗi cùng lúc');
  console.log('   Body: {"email": "invalid", "age": 200}');
  console.log('   → Expect: 400 + nhiều errors');
  console.log('═══════════════════════════════════════════════════════════');
});
