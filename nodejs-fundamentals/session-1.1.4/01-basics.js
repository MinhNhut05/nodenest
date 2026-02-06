/**
 * SESSION 1.1.4 - PART 1: Package Manager Basics
 *
 * npm và pnpm là công cụ quản lý packages (thư viện) cho Node.js
 */

console.log('=== PACKAGE MANAGER BASICS ===\n');

console.log(`
┌─────────────────────────────────────────────────────────────────────────────┐
│                         npm vs pnpm                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  Aspect              │  npm                    │  pnpm                      │
├─────────────────────────────────────────────────────────────────────────────┤
│  Tốc độ              │  Chậm hơn               │  Nhanh hơn 2-3x            │
│  Disk space          │  Tốn nhiều              │  Tiết kiệm (dùng symlinks) │
│  node_modules        │  Flat structure         │  Symlinks + .pnpm store    │
│  Mặc định            │  Có sẵn với Node.js     │  Phải cài riêng            │
│  Phổ biến            │  Rất phổ biến           │  Đang phổ biến dần         │
└─────────────────────────────────────────────────────────────────────────────┘

Cài pnpm:
  npm install -g pnpm

Hoặc (recommended):
  corepack enable
  corepack prepare pnpm@latest --activate
`);

console.log(`
=== CÁC LỆNH CƠ BẢN ===

┌─────────────────────────────────────────────────────────────────────────────┐
│  Công việc                  │  npm                  │  pnpm                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  Khởi tạo project           │  npm init -y          │  pnpm init            │
│  Cài package                │  npm install lodash   │  pnpm add lodash      │
│  Cài devDependency          │  npm install -D jest  │  pnpm add -D jest     │
│  Cài từ package.json        │  npm install          │  pnpm install         │
│  Xóa package                │  npm uninstall lodash │  pnpm remove lodash   │
│  Chạy script                │  npm run dev          │  pnpm dev             │
│  Update package             │  npm update           │  pnpm update          │
│  Xem outdated               │  npm outdated         │  pnpm outdated        │
└─────────────────────────────────────────────────────────────────────────────┘

LƯU Ý:
- pnpm dùng "add" thay vì "install" khi cài package
- pnpm có thể bỏ "run" khi chạy scripts: pnpm dev thay vì pnpm run dev
`);
