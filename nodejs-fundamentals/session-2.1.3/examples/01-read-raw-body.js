/**
 * ============================================================================
 *                         01 - READ RAW BODY
 * ============================================================================
 *
 * Demo cách đọc raw body từ HTTP request.
 * Body đến theo dạng stream (chunks), cần collect rồi gộp lại.
 *
 * Chạy: node 01-read-raw-body.js
 * Test với Postman:
 *   - POST http://localhost:3000
 *   - Body tab → raw → nhập bất kỳ text nào
 */

import http from 'http';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  console.log(`\n📥 ${method} ${url}`);
  console.log('Headers:', req.headers);

  // Chỉ đọc body với POST/PUT/PATCH
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    // ═══════════════════════════════════════════════════════════════════════
    //                    CÁCH ĐỌC BODY TỪ STREAM
    // ═══════════════════════════════════════════════════════════════════════

    const chunks = []; // Mảng để lưu các chunks

    // Event 'data': được emit mỗi khi nhận được 1 chunk
    req.on('data', (chunk) => {
      console.log(`📦 Received chunk: ${chunk.length} bytes`);
      console.log(`   Chunk type: ${chunk.constructor.name}`); // Buffer
      chunks.push(chunk);
    });

    // Event 'end': được emit khi đã nhận TOÀN BỘ body
    req.on('end', () => {
      // Gộp tất cả chunks thành 1 Buffer
      const buffer = Buffer.concat(chunks);

      // Convert Buffer sang string
      const body = buffer.toString('utf8');

      console.log('✅ Body received completely!');
      console.log(`📊 Total size: ${buffer.length} bytes`);
      console.log(`📝 Body content:\n${body}`);

      // Gửi response
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: true,
          message: 'Body received!',
          bodyLength: buffer.length,
          bodyContent: body,
        })
      );
    });

    // Event 'error': khi có lỗi (vd: client disconnect giữa chừng)
    req.on('error', (err) => {
      console.error('❌ Error:', err.message);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message }));
    });
  } else {
    // GET, DELETE, HEAD - không có body
    console.log('ℹ️  No body expected for', method);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        message: `${method} request - no body`,
        tip: 'Use POST/PUT/PATCH to send body',
      })
    );
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('');
  console.log('📋 Test với Postman:');
  console.log('   1. Method: POST');
  console.log('   2. URL: http://localhost:3000');
  console.log('   3. Body tab → raw → Text');
  console.log('   4. Nhập: Hello from Postman!');
  console.log('   5. Click Send');
  console.log('');
  console.log('📋 Hoặc test với curl:');
  console.log('   curl -X POST http://localhost:3000 -d "Hello from curl!"');
});
