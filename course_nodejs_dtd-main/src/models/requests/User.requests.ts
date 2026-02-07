export interface registerReqBody {
  username: string
  email: string
  date_of_birth: string
  password: string
}
export interface loginReqBody {
  email: string
  password: string
}

export interface logoutReqBody {
  refresh_token: string
}

export interface refreshTokenReqBody {
  refresh_token: string
}
