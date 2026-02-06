/**
 * ============================================================================
 *                         02 - PARSE JSON BODY
 * ============================================================================
 *
 * Demo cách parse JSON body từ HTTP request.
 * - Check Content-Type header
 * - Parse với JSON.parse() + try-catch
 * - Handle các lỗi thường gặp
 *
 * Chạy: node 02-parse-json.js
 * Test với Postman:
 *   - POST http://localhost:3000/api/data
 *   - Headers: Content-Type: application/json
 *   - Body tab → raw → JSON
 */

import http from 'http';

// ═══════════════════════════════════════════════════════════════════════════
//                    HELPER FUNCTION: PARSE JSON BODY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Parse JSON body từ request
 * @param {http.IncomingMessage} req - Request object
 * @returns {Promise<object>} - Parsed JSON object
 */
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    // Step 1: Check Content-Type
    const contentType = req.headers['content-type'];

    // Content-Type có thể là "application/json" hoặc "application/json; charset=utf-8"
    if (!contentType || !contentType.includes('application/json')) {
      reject({
        status: 415, // Unsupported Media Type
        message: 'Content-Type must be application/json',
      });
      return;
    }

    // Step 2: Collect chunks
    const chunks = [];

    req.on('data', (chunk) => {
      chunks.push(chunk);
    });

    // Step 3: Parse khi nhận xong
    req.on('end', () => {
      const body = Buffer.concat(chunks).toString('utf8');

      // Check empty body
      if (!body || body.trim() === '') {
        reject({
          status: 400, // Bad Request
          message: 'Request body is empty',
        });
        return;
      }

      // Step 4: Parse JSON với try-catch
      try {
        const data = JSON.parse(body);
        resolve(data);
      } catch (error) {
        reject({
          status: 400,
          message: 'Invalid JSON format: ' + error.message,
        });
      }
    });

    req.on('error', (error) => {
      reject({
        status: 500,
        message: 'Request error: ' + error.message,
      });
    });
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//                              HTTP SERVER
// ═══════════════════════════════════════════════════════════════════════════

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  console.log(`\n📥 ${method} ${url}`);

  // Helper function để gửi JSON response
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data, null, 2));
  };

  // ─────────────────────────────────────────────────────────────────────────
  //                          POST /api/data
  // ─────────────────────────────────────────────────────────────────────────
  if (method === 'POST' && url === '/api/data') {
    try {
      // Parse JSON body
      const data = await parseJsonBody(req);

      console.log('✅ Parsed data:', data);

      // Trả về data đã parse
      sendJson(200, {
        success: true,
        message: 'JSON parsed successfully!',
        receivedData: data,
        dataTypes: {
          // Show kiểu dữ liệu của mỗi field
          ...Object.fromEntries(
            Object.entries(data).map(([key, value]) => [key, typeof value])
          ),
        },
      });
    } catch (error) {
      console.log('❌ Error:', error.message);

      sendJson(error.status || 400, {
        success: false,
        error: error.message,
      });
    }
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  //                          404 - Not Found
  // ─────────────────────────────────────────────────────────────────────────
  sendJson(404, {
    error: 'Not Found',
    hint: 'Try POST /api/data with JSON body',
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
  console.log('✅ Test 1: JSON hợp lệ');
  console.log('   POST http://localhost:3000/api/data');
  console.log('   Header: Content-Type: application/json');
  console.log('   Body (raw JSON):');
  console.log('   {"name": "Leminho", "age": 25, "active": true}');
  console.log('');
  console.log('❌ Test 2: Thiếu Content-Type');
  console.log('   POST http://localhost:3000/api/data');
  console.log('   (Không set Content-Type header)');
  console.log('   → Expect: 415 Unsupported Media Type');
  console.log('');
  console.log('❌ Test 3: JSON sai format');
  console.log('   POST http://localhost:3000/api/data');
  console.log('   Header: Content-Type: application/json');
  console.log('   Body: {name: "Leminho"}  (thiếu quotes quanh name)');
  console.log('   → Expect: 400 Bad Request');
  console.log('');
  console.log('❌ Test 4: Body rỗng');
  console.log('   POST http://localhost:3000/api/data');
  console.log('   Header: Content-Type: application/json');
  console.log('   Body: (để trống)');
  console.log('   → Expect: 400 Bad Request');
  console.log('═══════════════════════════════════════════════════════════');
});
