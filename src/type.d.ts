import { TokenPayLoad } from './models/requests/User.request'
import User from './models/schemas/User.schema'
import { Request } from 'express'
//file này dùng để định nghĩa lại những cái có sẵn
declare module 'express' {
  interface Request {
    user?: User
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
  }
}
