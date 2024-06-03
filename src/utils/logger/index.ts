import devLogger from './dev-logger'
import prodLogger from './prod-logger'

const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger

export default logger
