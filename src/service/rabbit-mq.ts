import * as amqp from 'amqplib/callback_api'
import { APP_CONFIG } from '../config/constants'

class AMQPConnection {
  private amqpConn: amqp.Connection | null = null
  private pubChannel: amqp.Channel | null = null

  public initConnection(fnFinish: () => void): void {
    // Start connection with Rabbitmq
    amqp.connect(APP_CONFIG.rabbitMQ.url!, (err, conn) => {
      // If connection error
      if (err) {
        console.error('[AMQP]', err.message)
        setTimeout(() => this.initConnection(fnFinish), 1000)
        return // Added return statement here
      }

      conn.on('error', (error) => {
        console.log('ERROR', error)
        if (error.message !== 'Connection closing') {
          console.error('[AMQP] conn error', error.message)
        }
      })

      conn.on('close', () => {
        // Reconnect when connection was closed
        console.error('[AMQP] reconnecting')
        setTimeout(() => this.initConnection(fnFinish), 1000)
      })

      // Connection OK
      console.log('[AMQP] connected')
      this.amqpConn = conn

      // Execute finish function
      fnFinish()
    })
  }

  public startConsumer(queue: string, fnConsumer: (msg: amqp.Message, callback: (ok: boolean) => void) => void): void {
    if (!this.amqpConn) {
      console.error('[AMQP] Connection not established. Call initConnection first.')
      return
    }

    // Create a channel for the queue
    this.amqpConn.createChannel((err, ch) => {
      if (this.closeOnErr(err)) return

      ch.on('error', (error) => {
        console.error('[AMQP] channel error', error.message)
      })

      ch.on('close', () => {
        console.log('[AMQP] channel closed')
      })

      // Set prefetch value
      ch.prefetch(APP_CONFIG.rabbitMQ.prefetchCount ? parseInt(APP_CONFIG.rabbitMQ.prefetchCount, 5) : 5)

      // Arrow function to capture the correct 'this' context
      const processMsg = (msg: amqp.Message | null) => {
        if (msg) {
          // Process incoming messages and send them to fnConsumer
          // Here we need to send a callback(true) for acknowledging the message or callback(false) for rejecting it
          fnConsumer(msg, (ok) => {
            try {
              ok ? ch.ack(msg) : ch.reject(msg, true)
            } catch (e) {
              this.closeOnErr(e)
            }
          })
        }
      }

      // Connect to the queue
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ch.assertQueue(queue, { durable: true }, (assertErr, _ok) => {
        if (this.closeOnErr(assertErr)) return

        // Consume incoming messages
        ch.consume(queue, processMsg, { noAck: false })
        console.log('[AMQP] Consumer started', `"${queue}"`)
      })
    })
  }

  public startPublisher(): void {
    if (!this.amqpConn) {
      console.error('[AMQP] Connection not established. Call initConnection first.')
      return
    }

    // Init publisher
    this.amqpConn.createConfirmChannel((err, ch) => {
      if (this.closeOnErr(err)) return

      ch.on('error', (error) => {
        console.error('[AMQP] channel error', error.message)
      })

      ch.on('close', () => {
        console.log('[AMQP] channel closed')
      })

      // Set publisher channel in a var
      this.pubChannel = ch
      console.log('[AMQP] Publisher started')
    })
  }

  public publishMessage(
    exchange: string,
    routingKey: string,
    content: string,
    options: amqp.Options.Publish = {}
  ): void {
    // Verify if pubChannel is started
    if (!this.pubChannel) {
      console.error(
        "[AMQP] Can't publish message. Publisher is not initialized. You need to initialize them with StartPublisher function"
      )
      return
    }

    // Convert string message to buffer
    const message = Buffer.from(content, 'utf-8')

    try {
      // Publish message to exchange
      // options is not required
      this.pubChannel.publish(exchange, routingKey, message, options)
      console.log('[AMQP] message delivered')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error('[AMQP] publish', e.message)
      if (this.pubChannel) {
        this.pubChannel.connection.close()
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private closeOnErr(err: any): boolean {
    if (!err) return false
    console.error('[AMQP] error', err)
    if (this.amqpConn) {
      this.amqpConn.close()
    }
    return true
  }
}

const rabbitmqLib = new AMQPConnection()

export default rabbitmqLib
