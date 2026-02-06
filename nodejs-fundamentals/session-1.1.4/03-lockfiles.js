/**
 * SESSION 1.1.4 - PART 3: Lockfiles & node_modules
 */

console.log('=== LOCKFILES ===\n');

console.log(`
Lockfile là gì?
  - File ghi lại CHÍNH XÁC version của tất cả packages đã cài
  - Đảm bảo mọi người trong team cài CÙNG versions
  - Tránh "works on my machine" bugs

┌─────────────────────────────────────────────────────────────────────────────┐
│  Package Manager    │  Lockfile                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  npm                │  package-lock.json                                    │
│  pnpm               │  pnpm-lock.yaml                                       │
│  yarn               │  yarn.lock                                            │
└─────────────────────────────────────────────────────────────────────────────┘

QUAN TRỌNG:
  ✅ LUÔN commit lockfile vào git
  ❌ KHÔNG thêm lockfile vào .gitignore
  ❌ KHÔNG edit lockfile thủ công
`);

console.log(`
=== NODE_MODULES ===

Đây là folder chứa tất cả packages đã cài.

npm node_modules (flat):
  node_modules/
  ├── express/
  ├── lodash/
  ├── body-parser/      (dependency của express)
  └── ...               (hàng trăm folders)

pnpm node_modules (symlinks):
  node_modules/
  ├── .pnpm/            ← Tất cả packages thực sự ở đây
  ├── express → .pnpm/express@4.18.2/...
  └── lodash → .pnpm/lodash@4.17.21/...

Ưu điểm pnpm:
  - Tiết kiệm disk (packages được share giữa các projects)
  - Strict: không thể import package chưa khai báo
  - Nhanh hơn (không cần copy files)

QUAN TRỌNG:
  ✅ LUÔN thêm node_modules vào .gitignore
  ❌ KHÔNG commit node_modules vào git
`);

console.log(`
=== .GITIGNORE CHO NODE.JS ===

# Dependencies
node_modules/

# Lockfiles của package manager KHÁC (chỉ giữ 1 loại)
# package-lock.json    # Nếu dùng pnpm
# pnpm-lock.yaml       # Nếu dùng npm

# Environment
.env
.env.local

# Build output
dist/
build/

# Logs
*.log
npm-debug.log*

# OS files
.DS_Store
Thumbs.db
`);
