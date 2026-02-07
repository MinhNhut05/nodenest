import express, { Request, Response, NextFunction } from 'express'
import database from './services/database.services'
import 'dotenv/config'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'

const app = express()

const HOST = process.env.SV_HOST as unknown as string
const PORT = process.env.SV_PORT as unknown as number

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(PORT, HOST, async () => {
  await database.connect()
  console.log(`Server running at http://${HOST}:${PORT}/`)
})
