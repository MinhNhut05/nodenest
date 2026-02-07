import express from 'express'
import usersRouter from './routes/users.routes'
import { errorHandler } from './middlewares/error.middlewares'

const app = express()
const PORT = 3000

// Middleware parse JSON body
app.use(express.json())

// Routes
app.use('/users', usersRouter)

// Error handler (phải đặt cuối cùng)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
