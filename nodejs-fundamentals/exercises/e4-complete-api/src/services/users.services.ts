/**
 * Users Service - UPGRADED từ e3
 *
 * Thay đổi so với e3:
 * - Dùng ErrorWithStatus thay vì: const error: any = new Error('...'); error.status = 422
 * - Type-safe, không cần ép kiểu "any"
 *
 * So sánh:
 * TRƯỚC (e3):
 *   const error: any = new Error('Email already exists')
 *   error.status = 422
 *   throw error
 *
 * SAU (e4):
 *   throw new ErrorWithStatus({ message: 'Email already exists', status: 422 })
 */

import { ErrorWithStatus } from '../errors/ErrorWithStatus'
import HttpStatus from '../constants/httpStatus'
import { USERS_MESSAGES } from '../constants/messages'

// Giả lập database
const users: any[] = []
let userId = 1

class UsersService {
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS,
        status: HttpStatus.UNPROCESSABLE_ENTITY
      })
    }

    const newUser = {
      _id: String(userId++),
      name,
      email,
      password,
      created_at: new Date(),
      updated_at: new Date()
    }
    users.push(newUser)

    const { password: _, ...userWithoutPassword } = newUser
    return {
      user: userWithoutPassword,
      access_token: 'fake_access_token_' + newUser._id,
      refresh_token: 'fake_refresh_token_' + newUser._id
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = users.find((u) => u.email === email && u.password === password)
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.EMAIL_OR_PASSWORD_INCORRECT,
        status: HttpStatus.UNAUTHORIZED
      })
    }

    const { password: _, ...userWithoutPassword } = user
    return {
      user: userWithoutPassword,
      access_token: 'fake_access_token_' + user._id,
      refresh_token: 'fake_refresh_token_' + user._id
    }
  }

  async getProfile(userId: string) {
    const user = users.find((u) => u._id === userId)
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HttpStatus.NOT_FOUND
      })
    }

    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async updateProfile(userId: string, updateData: any) {
    const userIndex = users.findIndex((u) => u._id === userId)
    if (userIndex === -1) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HttpStatus.NOT_FOUND
      })
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updateData,
      updated_at: new Date()
    }

    const { password: _, ...userWithoutPassword } = users[userIndex]
    return userWithoutPassword
  }
}

const usersService = new UsersService()
export default usersService
