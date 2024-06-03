import { Request, Response, NextFunction } from 'express'
import { RequestValidationError } from '../errors/request-validation-error'
import { dataProfileCreateBodySchema } from './data-profile-requests-schema/create-data-profile'
import { getAllDataProfileQueryParamsSchema } from './data-profile-requests-schema/get-all-data-profile'
import { BadRequestError } from '../errors/bad-request-error'
import {
  deleteProfileParamsSchema,
  getProfileDetailsParamsSchema
} from './data-profile-requests-schema/get-profile-details'
import { dataProfileUpdateBodySchema } from './data-profile-requests-schema/update-data-profile'

export const validateDataProfileCreateRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = dataProfileCreateBodySchema.validate(req.body, { abortEarly: false })
  if (error) {
    throw new RequestValidationError(error, value)
  }
  next()
}

export const validateDataProfileUpdateRequestBody = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = dataProfileUpdateBodySchema.validate(req.body, { abortEarly: false })
  if (error) {
    throw new RequestValidationError(error, value)
  }
  next()
}

export const validateGetAllDataProfileQueryParams = (req: Request, res: Response, next: NextFunction) => {
  const { error } = getAllDataProfileQueryParamsSchema.validate(req.query, { stripUnknown: true })

  if (error) {
    throw new RequestValidationError(error)
  }

  const allowedQueryParams = ['search_term', 'limit', 'page', 'sort_by']

  // Check for additional/unknown parameters
  const unknownParams = Object.keys(req.query).filter((param) => !allowedQueryParams.includes(param))

  if (unknownParams.length > 0) {
    throw new BadRequestError([
      { message: `Unknown query parameters: ${unknownParams.join(', ')}`, code: 'unknown-query-params' }
    ])
  }
  next()
}

export const validateUpdateLastSyncTimeBody = (req: Request, res: Response, next: NextFunction) => {
  const { error } = getProfileDetailsParamsSchema.validate(req.body, { abortEarly: false })

  if (error) {
    throw new RequestValidationError(error)
  }

  next()
}

export const validateProfileParams = (req: Request, res: Response, next: NextFunction) => {
  const { error } = deleteProfileParamsSchema.validate(req.params, { abortEarly: false })

  if (error) {
    throw new RequestValidationError(error)
  }

  next()
}
