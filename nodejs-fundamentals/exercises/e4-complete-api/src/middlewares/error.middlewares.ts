import { Request, Response, NextFunction } from 'express'
import HttpStatus from '../constants/httpStatus'
import { ErrorWithStatus } from '../errors/ErrorWithStatus'
import { EntityError } from '../errors/EntityError'

/**
 * Error Handler Middleware - UPGRADED từ e3
 *
 * Express error handler có 4 params: (err, req, res, next)
 *
 * Phân biệt 3 loại error:
 *
 * 1. EntityError (422) → Validation errors, trả về chi tiết từng field
 *    Response: { message, errors: { field: { msg, location, path } } }
 *
 * 2. ErrorWithStatus (4xx/5xx) → Known errors có status code
 *    Response: { message }
 *
 * 3. Unknown Error → Lỗi không lường trước (bug, crash...)
 *    Response: { message: 'Internal server error' } (ẩn chi tiết)
 *    + Log error ra console để debug
 */

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Case 1: EntityError - Validation error với chi tiết từng field
  if (err instanceof EntityError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors
    })
  }

  // Case 2: ErrorWithStatus - Known error có status code
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json({
      message: err.message
    })
  }

  // Case 3: Unknown error - Lỗi không lường trước
  // Log để debug, nhưng KHÔNG trả chi tiết cho client (bảo mật)
  console.error('Unexpected error:', err)
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal server error'
  })
}
