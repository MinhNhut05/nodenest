export enum UserVerifyStatus {
  // chưa xác thực email
  Unverified,
  // đã xác thực email
  Verified,
  // đã bị khóa
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}
