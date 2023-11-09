import { Router } from 'express'
import {
  accessTokenValidator,
  changePasswordValidator,
  emailVerifyTokenValidator,
  followValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshtokenValidator,
  registerValidator,
  resetPasswordValidator,
  unfollowValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from '~/middlewares/users.middlewares'
import {
  changePasswordController,
  emailVerifyController,
  followController,
  forgotPasswordController,
  getMeController,
  getProfileController,
  loginController,
  logoutController,
  registerController,
  resendemailVerifyController,
  resetPasswordController,
  unfollowController,
  updateMeController,
  verifyForgotPasswordTokenController
} from '~/controllers/users.controlers'
import { warpAsync } from '~/utils/handlers'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.request'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, warpAsync(loginController))

/*
Description: register new user
Path: /register
Method: POST
body: {
    name: string
    email: string
    password: string
    confirm_password: string
    date_of_birth: string the chuaanr ISSO 8601
}
*/

usersRouter.post('/register', registerValidator, warpAsync(registerController))

usersRouter.post('/logout', accessTokenValidator, refreshtokenValidator, warpAsync(logoutController))

/*
des: verify email
method: post
path: /users/verify-email
body: {
  email_verify_token: string
}
*/
usersRouter.post('/verify-email', emailVerifyTokenValidator, warpAsync(emailVerifyController))

/*
des: resend verify email
method: post
past: /users/resen-verify-email
headers: {Authorization: "Bearer access_token"}
*/
usersRouter.post('/resend-verify-email', accessTokenValidator, warpAsync(resendemailVerifyController))

/*
des: forgot password
method: post
path: /users/forgot-password
body: {
  email: string
}
*/
usersRouter.post('/forgot-password', forgotPasswordValidator, warpAsync(forgotPasswordController))

/*
des: verify forgot password
method: post
path: /users/verify-fotgot-password
body: {
  forgot_password_token: string
}
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  warpAsync(verifyForgotPasswordTokenController)
)

/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
usersRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  warpAsync(resetPasswordController)
)

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
usersRouter.get('/me', accessTokenValidator, warpAsync(getMeController))

usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  warpAsync(updateMeController)
)

/*
des: get profile của user khác bằng username
path: '/:username'
method: get
không cần header vì, chưa đăng nhập cũng có thể xem
*/
usersRouter.get('/:username', warpAsync(getProfileController))

/*
des: Follow someone
path: '/follow'
method: post
headers: {Authorization: Bearer <access_token>}
body: {followed_user_id: string}
*/
usersRouter.post('/follow', accessTokenValidator, verifiedUserValidator, followValidator, warpAsync(followController))
//accessTokenValidator dùng dể kiểm tra xem ngta có đăng nhập hay chưa, và có đc user_id của người dùng từ req.decoded_authorization
//verifiedUserValidator dùng để kiễm tra xem ngta đã verify email hay chưa, rồi thì mới cho follow người khác
//trong req.body có followed_user_id  là mã của người mà ngta muốn follow
//followValidator: kiểm tra followed_user_id truyền lên có đúng định dạng objectId hay không
//  account đó có tồn tại hay không
//followController: tiến hành thao tác tạo document vào collection followers
/*
user 40 user654a4277cfab4795e12e2b22
user 44 user654a4572cfab4795e12e2b27
*/

/*
    des: unfollow someone
    path: '/follow/:user_id'
    method: delete
    headers: {Authorization: Bearer <access_token>}
  g}
    */
usersRouter.delete(
  '/follow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  warpAsync(unfollowController)
)

//unfollowValidator: kiểm tra user_id truyền qua params có hợp lệ hay k?

/*
  des: change password
  path: '/change-password'
  method: PUT
  headers: {Authorization: Bearer <access_token>}
  Body: {old_password: string, password: string, confirm_password: string}
g}
  */
usersRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  warpAsync(changePasswordController)
)
//changePasswordValidator kiểm tra các giá trị truyền lên trên body cớ valid k ?
export default usersRouter
