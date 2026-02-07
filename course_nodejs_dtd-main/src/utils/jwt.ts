import { sign, verify, Secret, SignOptions, JwtPayload } from 'jsonwebtoken'
import 'dotenv/config'

const EnvPrivateKey = process.env.JWT_PRIVATE_KEY as string

export const signToken = ({
  payload,
  privateKey = EnvPrivateKey,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: Secret
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    sign(payload, privateKey, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token as string)
      }
    })
  })
}

export const verifyToken = (token: string, privateKey = EnvPrivateKey) => {
  return new Promise<JwtPayload>((resolve, reject) => {
    verify(token, privateKey, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded as JwtPayload)
      }
    })
  })
}

export const verifyTokens = (tokens: string[]) => {
  return Promise.all(tokens.map((token) => verifyToken(token)))
}
