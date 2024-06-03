import { createLogger, transports, format } from 'winston'

const { combine, printf, colorize } = format

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`
})

const rabbitMQLogger = createLogger({
  transports: [
    new transports.Console({
      format: combine(colorize(), format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), logFormat)
    }),
    new transports.File({
      filename: 'logs/rabbit-mq-error.log',
      level: 'error',
      format: combine(format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), logFormat)
    }),
    new transports.File({
      filename: 'logs/rabbit-mq-combined.log',
      format: combine(format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), logFormat)
    })
  ]
})

export default rabbitMQLogger
