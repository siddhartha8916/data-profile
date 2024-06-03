import http from 'http'
import { createApp } from './app'
import 'dotenv/config'
import { checkEnvironmentVariables } from './utils/check-env-files'
import rabbitmqLib from './service/rabbit-mq'
import { APP_CONFIG, Server } from './config/constants'
import { fnConsumer } from './controllers/rabbit-mq-data-catalog.controller'
import { logWithTimestamp } from './utils/helpers'
import { fnConsumerDataProfileUpdate } from './controllers/rabbit-mq-data-profile.controller'

let server: http.Server | null = null

async function startServer() {
  checkEnvironmentVariables()
  const app = await createApp()
  server = http.createServer(app)
  server.listen(Server.port, () => {
    logWithTimestamp(`MIS Data Profile Service running on http://localhost:${Server.port.toString()}`)
    logWithTimestamp(`API Docs available at http://localhost:${Server.port.toString()}/api-docs/`)
  })
  rabbitmqLib.initConnection(() => {
    // Start the consumer worker when the connection to RabbitMQ has been made
    rabbitmqLib.startConsumer(APP_CONFIG.rabbitMQ.dataCatalogUpdateQueue!, fnConsumer)
    rabbitmqLib.startConsumer(APP_CONFIG.rabbitMQ.dataProfileUpdateQueue!, fnConsumerDataProfileUpdate)
    // Start the publisher when the connection to RabbitMQ has been made
    rabbitmqLib.startPublisher()
  })
}

startServer().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})

process.on('unhandledRejection', (err: Error) => {
  console.log('error :>> ', err)
  console.log('UNHANDLED REJECTION!!! shutting down ...')
  console.log(err.name, err.message)
  server?.close(() => {
    process.exit(1)
  })
})
