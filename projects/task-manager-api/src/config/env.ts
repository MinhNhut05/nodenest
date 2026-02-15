import "dotenv/config";

// Tập trung tất cả env variables vào 1 chỗ
// Thay vì rải rác process.env['...'] khắp nơi → khó quản lý, dễ typo
const env = {
  PORT: process.env["PORT"] ?? 8000,
  DATABASE_URL: process.env["DATABASE_URL"] ?? "",
  JWT_ACCESS_SECRET: process.env["JWT_ACCESS_SECRET"] ?? "",
  JWT_REFRESH_SECRET: process.env["JWT_REFRESH_SECRET"] ?? "",
  JWT_ACCESS_EXPIRES_IN: process.env["JWT_ACCESS_EXPIRES_IN"] ?? "15m",
  JWT_REFRESH_EXPIRES_IN: process.env["JWT_REFRESH_EXPIRES_IN"] ?? "7d",
} as const;

export default env;
