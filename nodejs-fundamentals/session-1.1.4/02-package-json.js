/**
 * SESSION 1.1.4 - PART 2: package.json Anatomy
 *
 * package.json là file cấu hình chính của Node.js project
 */

console.log('=== PACKAGE.JSON ANATOMY ===\n');

console.log(`
{
  "name": "my-project",           // Tên project (lowercase, no spaces)
  "version": "1.0.0",             // Version theo Semantic Versioning
  "description": "Mô tả project",
  "main": "index.js",             // Entry point
  "type": "module",               // "module" = ESM, "commonjs" = CJS

  "scripts": {                    // Các lệnh tắt
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "jest",
    "build": "tsc"
  },

  "dependencies": {               // Packages cần cho PRODUCTION
    "express": "^4.18.2",
    "lodash": "^4.17.21"
  },

  "devDependencies": {            // Packages chỉ cần khi DEVELOP
    "jest": "^29.7.0",
    "typescript": "^5.0.0"
  },

  "keywords": ["nodejs", "api"],  // Từ khóa tìm kiếm trên npm
  "author": "Your Name",
  "license": "MIT"
}
`);

console.log(`
=== DEPENDENCIES vs DEVDEPENDENCIES ===

dependencies (--save hoặc mặc định):
  - Cần cho app CHẠY
  - Được cài khi: npm install --production
  - Ví dụ: express, lodash, axios

devDependencies (--save-dev hoặc -D):
  - Chỉ cần khi PHÁT TRIỂN
  - KHÔNG được cài khi: npm install --production
  - Ví dụ: jest, eslint, typescript, prettier

Cách cài:
  pnpm add express          # → dependencies
  pnpm add -D jest          # → devDependencies
`);

console.log(`
=== SEMANTIC VERSIONING (SemVer) ===

Version format: MAJOR.MINOR.PATCH

  4.18.2
  │ │  └── PATCH: Bug fixes (backward compatible)
  │ └───── MINOR: New features (backward compatible)
  └─────── MAJOR: Breaking changes (NOT backward compatible)

Version ranges trong package.json:

  "express": "4.18.2"      Chính xác version 4.18.2
  "express": "^4.18.2"     >= 4.18.2 và < 5.0.0 (MINOR + PATCH updates)
  "express": "~4.18.2"     >= 4.18.2 và < 4.19.0 (chỉ PATCH updates)
  "express": "*"           Bất kỳ version nào (KHÔNG nên dùng!)

^ (caret) là MẶC ĐỊNH khi cài package
`);
