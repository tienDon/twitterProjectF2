import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controlers'
import { warpAsync } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.get('/login', loginValidator, warpAsync(loginController))

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
export default usersRouter
