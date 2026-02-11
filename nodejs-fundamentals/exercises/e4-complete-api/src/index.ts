import express from 'express'
import usersRouter from './routes/users.routes'
import { errorHandler } from './middlewares/error.middlewares'

const app = express()
const PORT = 3000

app.use(express.json())

// Routes
app.use('/users', usersRouter)

// Error handler (phải đặt CUỐI CÙNG, sau tất cả routes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`E4 Complete API running on http://localhost:${PORT}`)
})
