/**
 * SESSION 1.1.4 - PART 4: Scripts trong package.json
 */

console.log('=== NPM SCRIPTS ===\n');

console.log(`
Scripts là các lệnh tắt định nghĩa trong package.json:

{
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "build": "tsc",
    "clean": "rm -rf dist"
  }
}

Cách chạy:
  npm run start      hoặc    pnpm start
  npm run dev        hoặc    pnpm dev
  npm run test       hoặc    pnpm test

LƯU Ý:
  - "start", "test" có thể bỏ "run": npm start, npm test
  - pnpm có thể bỏ "run" cho TẤT CẢ scripts: pnpm dev
`);

console.log(`
=== PRE & POST SCRIPTS ===

Tự động chạy trước/sau script khác:

{
  "scripts": {
    "pretest": "echo 'Running before test...'",
    "test": "jest",
    "posttest": "echo 'Running after test...'"
  }
}

Khi chạy "npm test":
  1. pretest chạy trước
  2. test chạy
  3. posttest chạy sau

Ví dụ thực tế:
{
  "scripts": {
    "prebuild": "rm -rf dist",
    "build": "tsc",
    "postbuild": "echo 'Build complete!'"
  }
}
`);

console.log(`
=== CHẠY NHIỀU SCRIPTS ===

Tuần tự (chờ cái trước xong):
  "build": "npm run clean && npm run compile && npm run copy"

Song song (chạy cùng lúc):
  "dev": "npm run watch:ts & npm run watch:css"

Hoặc dùng package như concurrently:
  pnpm add -D concurrently
  "dev": "concurrently \\"npm:watch:*\\""
`);

console.log(`
=== ENVIRONMENT VARIABLES TRONG SCRIPTS ===

{
  "scripts": {
    "start": "NODE_ENV=production node index.js",
    "dev": "NODE_ENV=development node --watch index.js"
  }
}

Trong code:
  if (process.env.NODE_ENV === 'production') {
    // Production mode
  }

Cross-platform (Windows + Mac + Linux):
  pnpm add -D cross-env
  "start": "cross-env NODE_ENV=production node index.js"
`);
