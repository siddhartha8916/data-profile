import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../errors/abstract-custom-error'
import logger from '../utils/logger'
import { DatabaseCustomError } from '../errors/abstract-database-error'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.error(`${req.ip} - ${req.url} - ${JSON.stringify(err)}`)
  }

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({ errors: err.serializeErrors() })
  }

  if (err instanceof DatabaseCustomError) {
    return res.status(503).json({
      errors: [{ message: err.err.routine || 'Database Error !!!', code: err.message || 'db-err-02' }]
    })
  }

  if (err instanceof SyntaxError && Object.keys(err).includes('type')) {
    // TODO : Fix err.type property

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (err.type === 'entity.parse.failed') {
      res.status(400).json({ errors: [{ message: 'Invalid Request Structure', code: 'app-err-04' }] })
    }
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(err)
  }
  return res.status(500).json({ errors: [{ message: 'Something Bad Occured', code: 'something-bad-occured-error' }] })
}
