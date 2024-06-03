import { CustomErrorObject } from '../types/app'
import { CustomError } from './abstract-custom-error'

export class DatabaseRelationNotFound extends CustomError {
  statusCode = 404
  errors: CustomErrorObject[]

  constructor(errors?: CustomErrorObject[]) {
    super('Relation Not Found')
    this.errors = errors || [{ message: 'Database relation not found', code: 'db-err-02' }]
    Object.setPrototypeOf(this, DatabaseRelationNotFound.prototype)
  }

  serializeErrors() {
    const formattedError = this.errors.map((err) => {
      return { message: err.message, code: err.code }
    })
    return formattedError
  }
}
