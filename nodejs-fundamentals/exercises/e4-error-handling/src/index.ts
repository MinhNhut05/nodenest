import express, { Request, Response, NextFunction } from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

// ============================================
// E4.9 - ERROR HANDLING DEMO
// ============================================

// Route 1: Throw error trực tiếp (sync)
app.get('/error-sync', (req: Request, res: Response) => {
  // Throw error trong sync code
  // Express sẽ tự catch và chuyển đến error middleware
  throw new Error('Đây là lỗi sync!')
})

// Route 2: Dùng next(error) - cách khuyến nghị
app.get('/error-next', (req: Request, res: Response, next: NextFunction) => {
  // Cách này hoạt động với cả sync và async
  const error = new Error('Đây là lỗi từ next()!')
  next(error) // Chuyển lỗi đến error middleware
})

// Route 3: Async handler - CẦN try/catch hoặc wrapper
app.get('/error-async', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Giả lập async operation
    await Promise.reject(new Error('Đây là lỗi async!'))
  } catch (error) {
    next(error) // Phải dùng next() trong async
  }
})

// Route 4: Async KHÔNG có try/catch - LỖI KHÔNG BỊ BẮT!
app.get('/error-async-unhandled', async (req: Request, res: Response) => {
  // ⚠️ LỖI: Express KHÔNG tự catch lỗi trong async!
  // Server sẽ crash hoặc request bị treo
  await Promise.reject(new Error('Lỗi này sẽ không được handle!'))
})

// Route bình thường
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to E4.9 - Error Handling!' })
})

// ============================================
// ERROR MIDDLEWARE - Đặt CUỐI CÙNG!
// ============================================
// Express nhận diện đây là error middleware vì có 4 params
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('🔴 Error caught:', err.message)

  res.status(500).json({
    message: 'Có lỗi xảy ra!',
    error: err.message
  })
})

app.listen(PORT, () => {
  console.log(`
🚀 Server running at http://localhost:${PORT}

📝 Test các endpoint:
  GET /              → Response bình thường
  GET /error-sync    → Throw error (sync)
  GET /error-next    → next(error)
  GET /error-async   → Async với try/catch
  GET /error-async-unhandled → Async KHÔNG có try/catch (sẽ lỗi!)
  `)
})
