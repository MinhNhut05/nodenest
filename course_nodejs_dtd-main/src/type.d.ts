import { Request } from 'express'
import { TokenPayload } from 'jsonwebtoken'
declare module 'express' {
  interface Request {
    decoded_refresh_token?: TokenPayload
  }
}
