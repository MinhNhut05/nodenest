/**
 * Users Middlewares - UPGRADED từ e3
 *
 * Thay đổi so với e3:
 * - Dùng EntityError thay vì res.status(422).json(...)
 * - Dùng ErrorWithStatus thay vì res.status(401).json(...)
 * - Middleware throw error → error handler tự xử lý response
 * - Không cần return res.status()... nữa!
 */

import { Request, Response, NextFunction } from 'express'
import { EntityError } from '../errors/EntityError'
import { ErrorWithStatus } from '../errors/ErrorWithStatus'
import HttpStatus from '../constants/httpStatus'
import { USERS_MESSAGES } from '../constants/messages'

/**
 * Register Validator - Dùng EntityError cho validation
 *
 * So sánh với e3:
 * TRƯỚC: if (!name) return res.status(422).json({ message: 'Validation error' })
 * SAU:   if (!name) throw new EntityError({ errors: { name: { msg: '...', ... } } })
 *
 * Lợi ích: Response có chi tiết lỗi TỪNG field, frontend biết field nào sai
 */
export const registerValidator = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body
  const errors: Record<string, { msg: string; location: string; path: string }> = {}

  // Validate từng field, gom tất cả lỗi vào 1 object
  if (!name) {
    errors.name = { msg: USERS_MESSAGES.NAME_IS_REQUIRED, location: 'body', path: 'name' }
  }

  if (!email) {
    errors.email = { msg: USERS_MESSAGES.EMAIL_IS_REQUIRED, location: 'body', path: 'email' }
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = { msg: USERS_MESSAGES.EMAIL_IS_INVALID, location: 'body', path: 'email' }
  }

  if (!password) {
    errors.password = { msg: USERS_MESSAGES.PASSWORD_IS_REQUIRED, location: 'body', path: 'password' }
  } else if (password.length < 6 || password.length > 50) {
    errors.password = { msg: USERS_MESSAGES.PASSWORD_LENGTH, location: 'body', path: 'password' }
  }

  // Nếu có lỗi → throw EntityError (error handler sẽ bắt)
  if (Object.keys(errors).length > 0) {
    throw new EntityError({ errors })
  }

  next()
}

/**
 * Login Validator
 */
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  const errors: Record<string, { msg: string; location: string; path: string }> = {}

  if (!email) {
    errors.email = { msg: USERS_MESSAGES.EMAIL_IS_REQUIRED, location: 'body', path: 'email' }
  }

  if (!password) {
    errors.password = { msg: USERS_MESSAGES.PASSWORD_IS_REQUIRED, location: 'body', path: 'password' }
  }

  if (Object.keys(errors).length > 0) {
    throw new EntityError({ errors })
  }

  next()
}

/**
 * Access Token Validator - Dùng ErrorWithStatus
 *
 * So sánh với e3:
 * TRƯỚC: return res.status(401).json({ message: 'Access token is required' })
 * SAU:   throw new ErrorWithStatus({ message: '...', status: 401 })
 */
export const accessTokenValidator = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization

  if (!authorization) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.ACCESS_TOKEN_REQUIRED,
      status: HttpStatus.UNAUTHORIZED
    })
  }

  const [type, token] = authorization.split(' ')

  if (type !== 'Bearer' || !token) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.INVALID_TOKEN_FORMAT,
      status: HttpStatus.UNAUTHORIZED
    })
  }

  // Giả lập decode token
  const userId = token.replace('fake_access_token_', '')
  ;(req as any).decoded_authorization = { user_id: userId }
  next()
}
