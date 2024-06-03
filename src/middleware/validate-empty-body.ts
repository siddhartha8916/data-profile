import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../errors/bad-request-error'
import { CustomErrorObject } from '../types/app'
import Joi from 'joi'

const emptyBodySchema = Joi.object({})

export const validateIsBodyEmpty = (req: Request, res: Response, next: NextFunction) => {
  const { error } = emptyBodySchema.validate(req.body)
  if (error) {
    const err: CustomErrorObject[] = [{ message: 'Request Body Not Allowed', code: 'req.body-not-allowed' }]
    throw new BadRequestError(err)
  }

  next()
}
