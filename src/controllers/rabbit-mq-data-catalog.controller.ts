import amqp from 'amqplib'
import { RabbitMQDataCatalogEvent_DataProfileCreated, RabbitMQDataCatalogReceivedEvent } from '../types/rabbit-mq'
import rabbitmqLib from '../service/rabbit-mq'
import { APP_CONFIG } from '../config/constants'
import dataProfileRunHistoryService from '../service/data-profile-run-history.service'
import rabbitMQLogger from '../utils/logger/rabbit-mq-logger'
import DataProfileService from '../service/data-profile.service'
import { appCache } from '../lib/cache'

const dataProfileService = new DataProfileService()

export const processReceivedMessage_RabbitMQ = async (msg: amqp.Message | null) => {
  const content = msg?.content ? msg.content.toString() : undefined
  try {
    const parsedContent: RabbitMQDataCatalogReceivedEvent = content ? JSON.parse(content) : {}
    console.log('Consuming message from Rabbit MQ :>> ', JSON.stringify(parsedContent))
    const { catalogExecutionId, eventResponse, message, profileId } = parsedContent

    try {
      const updatedProfileRunHistory = await dataProfileRunHistoryService.dataProfile_UpdateRunHistoryStatus({
        catalog_execution_id: Number(catalogExecutionId),
        error_message: message,
        eventResponse: eventResponse
      })
      const status = ['ALTER TABLE SUCCESS', 'CREATE TABLE SUCCESS'].includes(eventResponse) ? true : false
      await dataProfileService.updateProfileIs_Active({ profile_id: profileId, status })
      console.log('Status updated for catalog : ', updatedProfileRunHistory[0].catalog_execution_id)
      rabbitMQLogger.info(JSON.stringify({ request: parsedContent, response: updatedProfileRunHistory }))
      appCache.clear()
    } catch (error) {
      rabbitMQLogger.error(JSON.stringify({ error }))
    }
  } catch (error) {
    console.log('Unable to parse incoming message to valid JSON:')
    console.log('Original Buffer :>> ', msg)
    console.log('Parsed Content :>> ', content)
    console.log('Error :>> ', error)
  }
}

export function sendMessageToDataCatalogExchange_RabbitMQ(
  dataProfileCreatedMessage: RabbitMQDataCatalogEvent_DataProfileCreated
) {
  console.log('Sending Message to Rabbit MQ for Data Profile :>> ', JSON.stringify(dataProfileCreatedMessage))
  rabbitmqLib.publishMessage(
    APP_CONFIG.rabbitMQ.dataCatalogEventsExchange!,
    APP_CONFIG.rabbitMQ.dataCatalogUpdateRoutingKey!,
    JSON.stringify(dataProfileCreatedMessage)
  )
}

export async function fnConsumer(msg: amqp.Message | null, callback: (ok: boolean) => void) {
  await processReceivedMessage_RabbitMQ(msg)
  // Complete processing and tell RabbitMQ that the message was processed successfully
  callback(true)
}
