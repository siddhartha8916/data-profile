import { CustomErrorObject } from '../types/app'
import { CustomError } from './abstract-custom-error'

export class NotAuthorizedError extends CustomError {
  statusCode = 401
  errors: CustomErrorObject[]

  constructor(errors: CustomErrorObject[]) {
    super('Not Authorized')
    this.errors = errors
    // Only as we are extending a built in class in typescript
    Object.setPrototypeOf(this, NotAuthorizedError.prototype)
  }

  serializeErrors() {
    const formattedError = this.errors.map((err) => {
      return { message: err.message, code: err.code }
    })
    return formattedError
  }
}
