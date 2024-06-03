import path from 'path'
import express, { Express } from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import router from './routes'
import swaggerDocument from '../swagger.json'
import { NotFoundError } from './errors/not-found-error'
import { errorHandler } from './middleware/error-handler'
import { logIncomingRequest } from './middleware/log-incoming-request'
import { CustomErrorObject } from './types/app'
import dataClient from './providers/DataProvider'
import './types/global'
import authService from './providers/AuthProvider'

export async function createApp(): Promise<Express> {
  const app: Express = express()
  await dataClient.init()

  const keycloak = authService.getKeycloakInstance()
  app.use(keycloak.middleware())

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use(logIncomingRequest)
  app.use(helmet())
  app.disable('x-powered-by')

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true
    })
  )

  app.use(express.json())
  app.use(express.static(path.join(__dirname, '..', 'public')))

  app.use('/api/v1', keycloak.protect(), router)
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  app.use('/api-swagger-json', (req, res) => {
    res.status(200).json(swaggerDocument)
  })

  app.all('*', () => {
    const err: CustomErrorObject[] = [{ message: 'Route Not Found', code: 'app-err-01' }]
    throw new NotFoundError(err)
  })

  app.use(errorHandler)

  return app
}
