import HttpStatus from '../constants/httpStatus'

/**
 * ErrorWithStatus - Custom Error class có status code
 *
 * Thay vì dùng: const error: any = new Error('msg'); error.status = 404
 * Ta dùng: throw new ErrorWithStatus({ message: 'msg', status: 404 })
 *
 * Lợi ích:
 * - Type-safe, không cần ép kiểu "any"
 * - Error handler có thể dùng instanceof để phân biệt
 * - Tách biệt "expected errors" (4xx) và "unexpected errors" (5xx)
 */

type ErrorWithStatusType = {
  message: string
  status: number
}

export class ErrorWithStatus extends Error {
  status: number

  constructor({ message, status }: ErrorWithStatusType) {
    super(message)
    this.status = status
  }
}
