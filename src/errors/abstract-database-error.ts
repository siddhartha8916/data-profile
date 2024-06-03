// This file sets the properties the error class might have and whall all properties.
// Abstract StatusCode and SerializeErrors

import { DatabaseError } from 'pg'

export abstract class DatabaseCustomError extends Error {
  abstract statusCode: number
  abstract err: DatabaseError

  constructor(err: DatabaseError) {
    // same as throw new Error('Something Bad Occured')
    super(err.code)

    Object.setPrototypeOf(this, DatabaseCustomError.prototype)
  }

  abstract serializeErrors(): { message: string; code: string }[]
}
