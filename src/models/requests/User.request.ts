import { JwtPayload } from 'jsonwebtoken'
import { UserVerifyStatus } from '~/constants/enums'

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
  verify: UserVerifyStatus
}

export interface resetPasswordReqBody {
  forgot_password_token: string
  password: string
  confirm_password: string
}

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string //vì ngta truyền lên string dạng ISO8601, k phải date
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface GetProfileReqParams {
  username: string
}
