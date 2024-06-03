/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from 'joi'
import { CustomError } from './abstract-custom-error'

export class RequestValidationError extends CustomError {
  error: ValidationError
  statusCode = 400
  value: any = null

  constructor(error: ValidationError, value?: any) {
    super('Request Body Validation Error')
    this.error = error
    this.value = value
    // Only as we are extending a built in class in typescript
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors() {
    const formattedError = this.error.details.map((detail) => {
      const errorCode = detail?.type
      const columnName = this.extractColumnName(detail.path, this.value) || ''

      return {
        message: detail.message.replace(/"/g, ''), // Remove double quotes from the message
        code: `${errorCode}|${columnName}`,
        context: detail.context
      }
    })

    return formattedError
  }

  private extractColumnName(path: (string | number)[], body: any): string {
    let columnName = null

    let currentField = body

    for (const field of path) {
      if (typeof field === 'number' && Array.isArray(currentField)) {
        // Handling array indices
        currentField = currentField?.[field]
        columnName = currentField?.columnName || currentField
      } else {
        // Handling object keys
        currentField = currentField?.[field]
      }
    }

    return columnName
  }
}
