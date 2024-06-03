import { CustomErrorObject } from '../types/app'
import { CustomError } from './abstract-custom-error'

export class NotFoundError extends CustomError {
  reason = ''
  statusCode = 404
  errors: CustomErrorObject[]

  constructor(errors: CustomErrorObject[], reason?: string) {
    super('Not Found')
    this.errors = errors
    if (reason) {
      this.reason = reason
    } else {
      this.reason = 'Not Found'
    }

    Object.setPrototypeOf(this, NotFoundError.prototype)
  }

  serializeErrors() {
    const formattedError = this.errors.map((err) => {
      return { message: err.message, code: err.code }
    })
    return formattedError
  }
}
