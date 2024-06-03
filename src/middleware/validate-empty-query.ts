import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../errors/bad-request-error'
import { CustomErrorObject } from '../types/app'
import Joi from 'joi'

const emptyQuerySchema = Joi.object({})

export const validateIsQueryEmpty = (req: Request, res: Response, next: NextFunction) => {
  const { error } = emptyQuerySchema.validate(req.query)
  if (error) {
    const error: CustomErrorObject[] = [{ message: 'Query Parameters not Allowed', code: 'req.query-not-allowed' }]
    throw new BadRequestError(error)
  }

  next()
}
