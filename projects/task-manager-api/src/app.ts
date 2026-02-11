import express from 'express'
import cors from 'cors'

const app = express()

// --- Middleware ---
// express.json() parse request body từ JSON string → JavaScript object
// Ví dụ: { "email": "test@mail.com" } → req.body.email = "test@mail.com"
app.json()

// cors() cho phép frontend (khác domain) gọi API
// Không có cors → browser block request từ localhost:3000 → localhost:8000
app.use(cors())

// --- Health check route ---
// Dùng để kiểm tra server có đang chạy không
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// --- Routes sẽ thêm sau ---
// app.use('/api/auth', authRoutes)
// app.use('/api/tasks', taskRoutes)

export default app
