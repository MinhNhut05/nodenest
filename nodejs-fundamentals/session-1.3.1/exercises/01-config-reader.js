/**
 * BÀI TẬP 1: Config Reader CLI
 *
 * Tạo CLI tool đọc config từ:
 * 1. Environment variables
 * 2. Command line arguments
 *
 * Priority: CLI args > Env vars > Defaults
 * (CLI ưu tiên cao nhất, rồi đến Env, cuối cùng là Default)
 */

// ============================================
// HƯỚNG DẪN
// ============================================
// 1. Đọc các config từ env và argv
// 2. CLI args có priority cao hơn env
// 3. In ra config cuối cùng
//
// Chạy test:
// node 01-config-reader.js
// PORT=8080 node 01-config-reader.js
// node 01-config-reader.js --port 9000
// PORT=8080 node 01-config-reader.js --port 9000
// node 01-config-reader.js --env production --debug

// ============================================
// HELPER: Parse CLI arguments
// ============================================

/**
 * parseArgs - Chuyển đổi CLI arguments thành object
 *
 * Ví dụ:
 *   Input:  ['--port', '3000', '--env', 'production', '--debug']
 *   Output: { port: '3000', env: 'production', debug: true }
 *
 * Cách hoạt động:
 *   - Duyệt qua từng argument
 *   - Nếu bắt đầu bằng '--' → đây là key
 *   - Argument tiếp theo là value (nếu không phải flag khác)
 *   - Nếu không có value → đây là flag boolean (true)
 */
function parseArgs(args) {
  const result = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    // Kiểm tra xem arg có bắt đầu bằng '--' không
    if (arg.startsWith('--')) {
      // Lấy tên key (bỏ '--' ở đầu)
      // '--port' → 'port'
      const key = arg.slice(2);

      // Lấy argument tiếp theo (có thể là value)
      const nextArg = args[i + 1];

      // Kiểm tra xem nextArg có phải là value không
      // (không phải undefined và không bắt đầu bằng '-')
      if (nextArg && !nextArg.startsWith('-')) {
        // Đây là key-value pair
        // '--port 3000' → { port: '3000' }
        result[key] = nextArg;
        i++; // Skip nextArg vì đã xử lý rồi
      } else {
        // Đây là flag boolean (không có value)
        // '--debug' → { debug: true }
        result[key] = true;
      }
    }
  }

  return result;
}

// Parse CLI arguments từ process.argv
// process.argv = ['/usr/bin/node', '/path/to/script.js', '--port', '3000', ...]
// .slice(2) để bỏ 2 phần tử đầu
const cliArgs = parseArgs(process.argv.slice(2));

// ============================================
// TODO 1: Đọc config từ environment variables
// ============================================

/**
 * envConfig - Đọc config từ biến môi trường
 *
 * process.env.PORT     → "8080" (string) hoặc undefined
 * process.env.NODE_ENV → "production" hoặc undefined
 * process.env.DEBUG    → "true" hoặc "false" hoặc undefined
 * process.env.API_KEY  → "secret123" hoặc undefined
 *
 * LƯU Ý: process.env LUÔN trả về STRING hoặc undefined
 */
const envConfig = {
  // Đọc PORT từ env, không set default ở đây
  // (để phân biệt giữa "không set" và "có set")
  port: process.env.PORT,
  // Kết quả: "8080" hoặc undefined

  // Đọc NODE_ENV
  env: process.env.NODE_ENV,
  // Kết quả: "production" hoặc undefined

  // Đọc DEBUG và chuyển thành boolean
  // "true" === "true" → true
  // "false" === "true" → false
  // undefined === "true" → false
  debug: process.env.DEBUG === 'true',
  // Kết quả: true hoặc false

  // Đọc API_KEY
  apiKey: process.env.API_KEY,
  // Kết quả: "secret123" hoặc undefined
};

// ============================================
// TODO 2: Đọc config từ CLI arguments
// ============================================

/**
 * cliConfig - Đọc config từ command line arguments
 *
 * cliArgs được parse bởi parseArgs() ở trên
 * Ví dụ: node script.js --port 9000 --env production --debug
 * cliArgs = { port: '9000', env: 'production', debug: true }
 */
const cliConfig = {
  // Đọc --port từ cliArgs
  // cliArgs.port có thể là '9000' hoặc undefined
  port: cliArgs.port,

  // Đọc --env từ cliArgs
  env: cliArgs.env,

  // Đọc --debug từ cliArgs
  // --debug là flag, nên giá trị là true hoặc undefined
  debug: cliArgs.debug,

  // Đọc --api-key từ cliArgs
  // LƯU Ý: key trong object là 'api-key' (có dấu -)
  apiKey: cliArgs['api-key'],
};

// ============================================
// TODO 3: Merge configs với priority
// ============================================

/**
 * finalConfig - Kết hợp config với thứ tự ưu tiên
 *
 * Priority: CLI > Env > Defaults
 * Nghĩa là:
 * - Nếu CLI có giá trị → dùng CLI
 * - Nếu CLI không có, Env có → dùng Env
 * - Nếu cả hai không có → dùng Default
 *
 * Dùng toán tử ?? (nullish coalescing)
 * a ?? b → nếu a là null/undefined thì dùng b
 */
const finalConfig = {
  // port: CLI → Env → Default (3000)
  port: cliConfig.port ?? envConfig.port ?? 3000,
  // Ví dụ 1: CLI=9000, Env=8080 → 9000 (CLI thắng)
  // Ví dụ 2: CLI=undefined, Env=8080 → 8080 (Env thắng)
  // Ví dụ 3: CLI=undefined, Env=undefined → 3000 (Default)

  // env: CLI → Env → Default ('development')
  env: cliConfig.env ?? envConfig.env ?? 'development',

  // debug: CLI → Env → Default (false)
  // LƯU Ý: debug là boolean, cần xử lý khác
  // cliConfig.debug có thể là true hoặc undefined
  // envConfig.debug có thể là true hoặc false
  debug: cliConfig.debug ?? envConfig.debug ?? false,

  // apiKey: CLI → Env → Default (null)
  apiKey: cliConfig.apiKey ?? envConfig.apiKey ?? null,
};

// ============================================
// TODO 4: Validate required config
// ============================================

/**
 * Validate - Kiểm tra config hợp lệ
 *
 * Rule: Nếu env === 'production' thì apiKey BẮT BUỘC phải có
 *
 * Nếu vi phạm:
 * - In error ra stderr (console.error)
 * - Thoát với exit code 1
 */
if (finalConfig.env === 'production' && !finalConfig.apiKey) {
  // In error ra stderr
  console.error('\n❌ Error: API_KEY is required in production mode!');
  console.error('   Set via: API_KEY=xxx node script.js');
  console.error('   Or via:  node script.js --api-key xxx\n');

  // Thoát với exit code 1 (error)
  process.exit(1);
}

// ============================================
// OUTPUT
// ============================================

console.log('\n=== Configuration ===\n');
console.log('Sources:');
console.log('  ENV:', envConfig);
console.log('  CLI:', cliConfig);
console.log('\nFinal config:', finalConfig);
console.log('\n✓ Config loaded successfully!\n');

// ============================================
// TEST CASES
// ============================================
/*

TEST 1: Mặc định (không set gì)
$ node 01-config-reader.js
Final config: { port: 3000, env: 'development', debug: false, apiKey: null }

TEST 2: Chỉ set Env
$ PORT=8080 NODE_ENV=staging node 01-config-reader.js
Final config: { port: '8080', env: 'staging', debug: false, apiKey: null }

TEST 3: Chỉ set CLI
$ node 01-config-reader.js --port 9000 --env testing --debug
Final config: { port: '9000', env: 'testing', debug: true, apiKey: null }

TEST 4: Set cả Env và CLI (CLI thắng)
$ PORT=8080 node 01-config-reader.js --port 9000
Final config: { port: '9000', ... }  ← CLI port thắng

TEST 5: Production mode KHÔNG có API_KEY (sẽ error)
$ node 01-config-reader.js --env production
❌ Error: API_KEY is required in production mode!

TEST 6: Production mode CÓ API_KEY (OK)
$ node 01-config-reader.js --env production --api-key secret123
Final config: { ..., env: 'production', apiKey: 'secret123' }

*/
