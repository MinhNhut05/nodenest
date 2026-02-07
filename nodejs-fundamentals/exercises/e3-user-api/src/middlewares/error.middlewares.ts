/**
 * Error Handler Middleware
 * Đây là middleware cuối cùng, bắt tất cả errors
 */

import { Request, Response, NextFunction } from 'express'
import HttpStatus from '../constants/httpStatus'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message)

  res.status(err.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: err.message || 'Internal Server Error'
  })
}
