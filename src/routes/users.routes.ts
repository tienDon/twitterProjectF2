import { Router } from 'express'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controlers'
const usersRouter = Router()

usersRouter.get('/login', loginValidator, loginController)

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
usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
