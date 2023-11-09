import { NextFunction, Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseService from '~/services/database.servies'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import {
  ChangePasswordReqBody,
  FollowReqBody,
  GetProfileReqParams,
  RegisterReqBody,
  TokenPayLoad,
  UnfollowReqParams,
  UpdateMeReqBody,
  loginReqBody,
  logoutReqBody,
  resetPasswordReqBody
} from '~/models/requests/User.request'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { UserVerifyStatus } from '~/constants/enums'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'

export const loginController = async (req: Request<ParamsDictionary, any, loginReqBody>, res: Response) => {
  //nếu nó vào dc đây, tức là nó đã đăng nhập thành công
  const user = req.user as User
  const user_id = user._id as ObjectId
  //server phải tạo ra access_token và refresh_token để đưa cho client
  const result = await usersService.login({
    user_id: user_id.toString(),
    verify: user.verify
  }) //
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, logoutReqBody>, res: Response) => {
  //lấy refresh_token từ req.body
  const { refresh_token } = req.body
  //logout: vào database xóa refresh_token này
  const result = await usersService.logout(refresh_token)
  res.json(result)
}

export const emailVerifyController = async (req: Request, res: Response) => {
  //kiểm tra user này đã verify hay chưa
  const { user_id } = req.decoded_email_verify_token as TokenPayLoad
  const user = req.user as User
  //nếu đã verify rồi thì
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu mà xuống dc đây nghĩa là user này chưa verify, chưa bị banned, và khớp mã
  //mình tiến hành update: verify: 1, xóa email_verify_token, update_at
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.EMAIL_VERIFY_SUCCESS,
    result
  })
}

export const resendemailVerifyController = async (req: Request, res: Response) => {
  //nếu code vào dc đây nghĩa là đã đi qua dc tầng accessTokenValidator
  //trong req đã có decoded_authorization
  const { user_id } = req.decoded_authorization as TokenPayLoad
  //lấy user từ database
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  //nếu có thì kiểm tra xem thằng này đã bị banned chưa
  if (!user) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_BANNED,
      status: HTTP_STATUS.FORBIDEN
    })
  }
  //user đã verify chưa
  if (user.verify === UserVerifyStatus.Verified) {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu chưa verify thì tiến hành update cho mã mới
  const result = await usersService.resendEmailVeriffy(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  //lấy user_id từ req.user
  const { _id, verify } = req.user as User
  //tiến hành update lại forgot_password_token
  const result = await usersService.forgotPassword({ user_id: (_id as ObjectId).toString(), verify })
  return res.json(result)
}

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, resetPasswordReqBody>,

  res: Response
) => {
  //muốn cập nhật mật khẩu mới cần có user_id và password mới
  const { user_id } = req.decoded_forgot_password_token as TokenPayLoad
  const { password } = req.body
  //cập nhật password mới cho user có user_id này
  const result = await usersService.resetPassword({ user_id, password })
  return res.json(result)
}

export const getMeController = async (req: Request, res: Response) => {
  //muốn lấy thông tin của user thì cần user_id
  const { user_id } = req.decoded_authorization as TokenPayLoad
  //tiến hành vào databasetimf và lấy thông tin user
  const user = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    result: user
  })
}

export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  //muốn update thông tin của user thì cần user_id và những thông tin ngta muốn update
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const { body } = req
  //giờ mình sẽ update user thông qua user_id với body dc cho
  const result = await usersService.updateMe(user_id, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}

export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response) => {
  //muốn lấy thông tin của user thì cần username
  const { username } = req.params
  //tiến hành vào database tìm và lấy thông tin user
  const user = await usersService.getProfile(username)
  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    user
  })
}

export const followController = async (
  req: Request<ParamsDictionary, any, FollowReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad //lấy user_id từ decoded_authorization của access_token
  const { followed_user_id } = req.body //lấy followed_user_id từ req.body
  const result = await usersService.follow(user_id, followed_user_id) //chưa có method này
  return res.json(result)
}

export const unfollowController = async (req: Request<UnfollowReqParams>, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad //lấy user_id từ decoded_authorization của access_token
  const { user_id: followed_user_id } = req.params //lấy user_id từ req.params là user_id của người mà ngta muốn unfollow
  const result = await usersService.unfollow(user_id, followed_user_id) //unfollow chưa làm
  return res.json(result)
}

export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordReqBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayLoad //lấy user_id từ decoded_authorization của access_token
  const { password } = req.body //lấy old_password và password từ req.body
  const result = await usersService.changePassword(user_id, password) //chưa code changePassword
  return res.json(result)
}
