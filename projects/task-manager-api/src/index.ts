import app from './app.js'

// PORT lấy từ .env, nếu không có thì mặc định 8000
const PORT = process.env['PORT'] ?? 8000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/health`)
})
