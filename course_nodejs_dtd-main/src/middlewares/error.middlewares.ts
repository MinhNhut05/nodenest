import { NextFunction, Request, Response } from 'express'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Error'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorWithStatus) {
    const { status, ...error } = err
    return res.status(status).json(error)
  }

  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: err.message })
}
