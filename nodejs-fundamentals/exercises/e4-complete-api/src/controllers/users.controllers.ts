/**
 * Users Controllers - UPGRADED từ e3
 *
 * Thay đổi so với e3:
 * - Dùng wrapRequestHandler → KHÔNG CẦN try-catch
 * - Service throw ErrorWithStatus → error handler tự bắt
 * - Controller chỉ focus vào happy path
 *
 * So sánh:
 * TRƯỚC (e3):
 *   export const register = async (req, res, next) => {
 *     try {
 *       const result = await usersService.register(...)
 *       res.status(201).json({ message: '...', data: result })
 *     } catch (error) {
 *       next(error)  // phải nhớ viết dòng này!
 *     }
 *   }
 *
 * SAU (e4):
 *   export const register = wrapRequestHandler(async (req, res) => {
 *     const result = await usersService.register(...)
 *     res.status(201).json({ message: '...', data: result })
 *     // Không cần try-catch! wrapRequestHandler lo hết
 *   })
 */

import { Request, Response } from 'express'
import HttpStatus from '../constants/httpStatus'
import { USERS_MESSAGES } from '../constants/messages'
import usersService from '../services/users.services'
import { wrapRequestHandler } from '../utils/wrapRequestHandler'

export const registerController = wrapRequestHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const result = await usersService.register({ name, email, password })

  res.status(HttpStatus.CREATED).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    data: result
  })
})

export const loginController = wrapRequestHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body
  const result = await usersService.login({ email, password })

  res.status(HttpStatus.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    data: result
  })
})

export const getProfileController = wrapRequestHandler(async (req: Request, res: Response) => {
  const userId = (req as any).decoded_authorization?.user_id
  const user = await usersService.getProfile(userId)

  res.status(HttpStatus.OK).json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    data: user
  })
})

export const updateProfileController = wrapRequestHandler(async (req: Request, res: Response) => {
  const userId = (req as any).decoded_authorization?.user_id
  const updateData = req.body
  const result = await usersService.updateProfile(userId, updateData)

  res.status(HttpStatus.OK).json({
    message: USERS_MESSAGES.UPDATE_PROFILE_SUCCESS,
    data: result
  })
})
