import { Request, Response, NextFunction } from 'express'
import { BadRequestError } from '../errors/bad-request-error'
import { CustomErrorObject } from '../types/app'
import Joi from 'joi'

const emptyParamsSchema = Joi.object({})

export const validateIsParamsEmpty = (req: Request, res: Response, next: NextFunction) => {
  const { error } = emptyParamsSchema.validate(req.params)
  if (error) {
    const error: CustomErrorObject[] = [{ message: 'Request Params Not Allowed', code: 'req.params-not-allowed' }]
    throw new BadRequestError(error)
  }

  next()
}
