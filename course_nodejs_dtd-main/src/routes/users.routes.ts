import { Router } from 'express'
import {
  loginController,
  logoutController,
  refreshTokenController,
  registerController
} from '~/controllers/users.controllers'
import { loginValidator, refreshTokenValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapReqHandler } from '~/utils/handler'

const usersRouter = Router()

usersRouter.post('/register', registerValidator, wrapReqHandler(registerController))
usersRouter.post('/login', loginValidator, wrapReqHandler(loginController))
usersRouter.post('/logout', refreshTokenValidator, wrapReqHandler(logoutController))
usersRouter.post('/refresh-token', refreshTokenValidator, wrapReqHandler(refreshTokenController))

export default usersRouter
