import { Request, Response, NextFunction } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)

    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }
    const errorObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      //lấy msg của từng lỗi ra
      const { msg } = errorObject[key]
      //nếu msg có dạng ErrorWithStatus và status !== 422 thì ném cho default error handler
      if (msg instanceof ErrorWithStatus && msg.status != 422) {
        return next(msg)
      }
      //nếu xuống đc đây thì mày là lỗi 422
      entityError.errors[key] = msg
    }
    //xử lý lỗi luoon chứ ko ném về error tổng
    next(entityError) //đưa cho default vì lỗi có status rõ ràng
  }
}
