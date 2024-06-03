import { createLogger, transports, format } from 'winston'

const { combine, printf, colorize } = format

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

const prodLogger = createLogger({
  transports: [
    new transports.Console({
      format: combine(colorize(), format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), logFormat)
    }),
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: combine(format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), logFormat)
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: combine(format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), logFormat)
    })
  ]
})

export default prodLogger
