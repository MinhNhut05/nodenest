import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * wrapRequestHandler - Higher-Order Function (HOF) loại bỏ try-catch
 *
 * TRƯỚC (e3): Mỗi controller phải viết try-catch
 *   export const register = async (req, res, next) => {
 *     try {
 *       // logic...
 *     } catch (error) {
 *       next(error)  // phải nhớ gọi next(error)
 *     }
 *   }
 *
 * SAU (e4): Wrap controller, tự động catch error
 *   export const register = wrapRequestHandler(async (req, res, next) => {
 *     // logic... không cần try-catch!
 *   })
 *
 * Cách hoạt động:
 * - Nhận 1 async function (controller/middleware)
 * - Return 1 function mới bọc try-catch bên ngoài
 * - Nếu có error → tự động gọi next(error)
 */

export const wrapRequestHandler = <P>(fn: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
