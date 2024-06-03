import { Request, Response, NextFunction } from 'express'
import logger from '../utils/logger'

export const logIncomingRequest = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    const { method, originalUrl, ip, body, params, query, headers } = req

    const date = new Date().toUTCString()
    const userAgent = headers['user-agent']

    const logMessage = `${ip} - - [${date}] "${method} ${originalUrl} HTTP/1.1" ${
      res.statusCode
    } - "${userAgent}" - Params: ${JSON.stringify(params)} Query - ${JSON.stringify(query)} - Body: ${JSON.stringify(
      body
    )}`

    logger.info(logMessage)
  }

  next()
}
