import HttpStatus from '../constants/httpStatus'
import { USERS_MESSAGES } from '../constants/messages'

/**
 * EntityError - Validation Error (422 Unprocessable Entity)
 *
 * Khác với ErrorWithStatus:
 * - Status luôn là 422
 * - Có thêm field "errors" chứa chi tiết lỗi từng field
 *
 * Ví dụ response:
 * {
 *   message: "Validation error",
 *   errors: {
 *     email: { msg: "Email is required", location: "body", path: "email" },
 *     password: { msg: "Password must be 6-50 characters", location: "body", path: "password" }
 *   }
 * }
 */

type ErrorsType = Record<
  string,
  {
    msg: string
    location: string
    path: string
  }
>

export class EntityError extends Error {
  status: number
  errors: ErrorsType

  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorsType }) {
    super(message)
    this.status = HttpStatus.UNPROCESSABLE_ENTITY
    this.errors = errors
  }
}
