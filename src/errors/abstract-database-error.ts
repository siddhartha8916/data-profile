// This file sets the properties the error class might have and whall all properties.
// Abstract StatusCode and SerializeErrors

import { DatabaseError } from 'pg'

export abstract class DatabaseCustomError extends Error {
  abstract statusCode: number

  protected constructor(protected err: DatabaseError) {
    // Calls the parent class (Error) constructor with the error message
    super(err.message)

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DatabaseCustomError.prototype)
  }

  // Public method to get error details
  getErrorDetails() {
    return this.err
  }

  abstract serializeErrors(): { message: string; code: string }[]
}
