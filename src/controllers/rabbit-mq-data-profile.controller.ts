import amqp from 'amqplib'
import { I_RabbitMQDataProfileUpdate_Event } from '../types/rabbit-mq'
import rabbitMQLogger from '../utils/logger/rabbit-mq-logger'
import DataProfileService from '../service/data-profile.service'
import { appCache } from '../lib/cache'

const dataProfileService = new DataProfileService()

export const processReceivedMessage_RabbitMQ = async (msg: amqp.Message | null) => {
  const content = msg?.content ? msg.content.toString() : undefined
  try {
    const parsedContent: I_RabbitMQDataProfileUpdate_Event = content ? JSON.parse(content) : {}
    console.log('Consuming message from Rabbit MQ :>> ', JSON.stringify(parsedContent))
    const { profileId, eventResponse } = parsedContent

    try {
      const status = ['VALIDATION ERROR'].includes(eventResponse) ? true : false
      const updatedProfile = await dataProfileService.updateProfileHas_ValidationError({
        profile_id: profileId,
        status
      })
      console.log('hasValidationError updated for profile : ', {
        profileId: updatedProfile?.[0]?.profile_id,
        hasValidationError: updatedProfile?.[0]?.has_validation_error
      })
      rabbitMQLogger.info(JSON.stringify({ request: parsedContent, response: updatedProfile }))
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

export async function fnConsumerDataProfileUpdate(msg: amqp.Message | null, callback: (ok: boolean) => void) {
  await processReceivedMessage_RabbitMQ(msg)
  // Complete processing and tell RabbitMQ that the message was processed successfully
  callback(true)
}
