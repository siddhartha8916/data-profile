import { DatabaseError } from 'pg'
import { DatabaseCustomError } from './abstract-database-error'

export class DatabaseConnectionError extends DatabaseCustomError {
  statusCode = 500
  errno = 0
  code = ''
  err: DatabaseError

  constructor(error: DatabaseError) {
    super(error)
    this.err = error

    // Only as we are extending a built in class in typescript
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors() {
    return [{ message: this.err?.routine || 'Unable to connect to Database', code: this.err.code || 'db-err-01' }]
  }
}
