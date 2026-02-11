import { Router } from 'express'
import {
  registerController,
  loginController,
  getProfileController,
  updateProfileController
} from '../controllers/users.controllers'
import {
  registerValidator,
  loginValidator,
  accessTokenValidator
} from '../middlewares/users.middlewares'

const router = Router()

router.post('/register', registerValidator, registerController)
router.post('/login', loginValidator, loginController)
router.get('/me', accessTokenValidator, getProfileController)
router.patch('/me', accessTokenValidator, updateProfileController)

export default router
