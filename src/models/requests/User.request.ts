import { JwtPayload } from 'jsonwebtoken'

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface loginReqBody {
  email: string
  password: string
}

export interface logoutReqBody {
  refresh_token: string
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenPayLoad
}

export interface resetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}
