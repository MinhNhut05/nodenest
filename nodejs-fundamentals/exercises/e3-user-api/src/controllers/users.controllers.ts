/**
 * ============================================
 * BÀI 2: CONTROLLERS & STATUS CODES
 * ============================================
 *
 * Điền code vào chỗ [...] để hoàn thành controllers
 *
 * Kiến thức cần nhớ:
 * - Controller nhận req, res, next
 * - Gọi service để xử lý logic
 * - Trả về response với status code phù hợp
 * - Status codes: 200 OK, 201 Created, 400 Bad Request, 404 Not Found
 */

import { Request, Response, NextFunction } from 'express'
import HttpStatus from '../constants/httpStatus'
import { USERS_MESSAGES } from '../constants/message'
import usersService from '../services/users.services'

/**
 * Register Controller
 * - Tạo user mới
 * - Trả về 201 Created khi thành công
 */
export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body
    const result = await usersService.register({ name, email, password })

    // TODO 1: Điền status code phù hợp khi TẠO MỚI resource
    // Gợi ý: Không phải 200, mà là status code cho "created"
    res.status(HttpStatus.[...]).json({
      message: USERS_MESSAGES.REGISTER_SUCCESS,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Login Controller
 * - Kiểm tra credentials
 * - Trả về 200 OK + tokens
 */
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body
    const result = await usersService.login({ email, password })

    // TODO 2: Điền status code cho request thành công
    res.status(HttpStatus.[...]).json({
      message: USERS_MESSAGES.LOGIN_SUCCESS,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Get Profile Controller
 * - Lấy thông tin user hiện tại
 * - User ID lấy từ decoded token (sau khi qua middleware)
 */
export const getProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Giả sử middleware đã decode token và gắn user_id vào req
    const userId = (req as any).decoded_authorization?.user_id

    // TODO 3: Xử lý trường hợp không tìm thấy user
    // Gợi ý: Dùng status code 404 và message phù hợp
    const user = await usersService.getProfile(userId)

    if (!user) {
      return res.status(HttpStatus.[...]).json({
        message: USERS_MESSAGES.[...]
      })
    }

    res.status(HttpStatus.OK).json({
      message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Update Profile Controller
 * - Cập nhật thông tin user
 * - Chỉ cập nhật các fields được gửi lên
 */
export const updateProfileController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).decoded_authorization?.user_id
    const updateData = req.body

    const result = await usersService.updateProfile(userId, updateData)

    // TODO 4: Response với status và message phù hợp
    res.status(HttpStatus.[...]).json({
      message: USERS_MESSAGES.[...],
      data: result
    })
  } catch (error) {
    next(error)
  }
}
