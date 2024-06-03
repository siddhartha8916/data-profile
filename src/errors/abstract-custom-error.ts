// This file sets the properties the error class might have and whall all properties.
// Abstract StatusCode and SerializeErrors

import { Context } from 'joi'

export abstract class CustomError extends Error {
  abstract statusCode: number

  protected constructor(message: string) {
    // same as throw new Error('Something Bad Occured')
    super(message)

    Object.setPrototypeOf(this, CustomError.prototype)
  }

  abstract serializeErrors(): { message: string; code: string; context?: Context | undefined }[]
}
