import { CustomErrorObject } from '../types/app'
import { CustomError } from './abstract-custom-error'

export class BadRequestError extends CustomError {
  statusCode = 400
  errors: CustomErrorObject[]

  constructor(errors: CustomErrorObject[]) {
    super('Bad Request')
    this.errors = errors
    // Only as we are extending a built in class in typescript
    Object.setPrototypeOf(this, BadRequestError.prototype)
  }

  serializeErrors() {
    const formattedError = this.errors.map((err) => {
      return { message: err.message, code: err.code }
    })
    return formattedError
  }
}
