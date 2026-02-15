import { PrismaClient } from '../generated/prisma/client.js'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import env from './env.js'

// 1. Tạo connection pool - quản lý nhiều kết nối DB cùng lúc
const pool = new pg.Pool({ connectionString: env.DATABASE_URL })

// 2. Tạo adapter - cầu nối giữa Prisma và PostgreSQL driver
const adapter = new PrismaPg(pool)

// 3. Tạo PrismaClient với adapter
const prisma = new PrismaClient({ adapter })

export default prisma
