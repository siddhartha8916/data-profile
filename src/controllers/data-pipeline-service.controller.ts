import { APP_CONFIG } from '../config/constants'
import fetch, { FetchError } from 'node-fetch'
import { BadRequestError } from '../errors/bad-request-error'
import authService from '../providers/AuthProvider'

export interface DataPipelineDetails {
  dataPipelineId: number
  dataPipelineName: string
}

class DataPipelineServiceController {
  checkIfProfileIsAssociatedWithPipeline = async (profile_id: number): Promise<DataPipelineDetails | undefined> => {
    try {
      const res = await authService.getServiceAccountAccessToken()
      const response = await fetch(
        `${APP_CONFIG.dataPipelineService.url}/dataPipeline/getByProfileId?dataProfileId=${profile_id}`,
        {
          headers: {
            Authorization: `Bearer ${res?.access_token}`
          }
        }
      )
      return await response.json()
    } catch (error) {
      console.log('error checkIfProfileIsAssociatedWithPipeline :>> ', error)
      if (error instanceof FetchError) {
        throw new BadRequestError([
          { message: error?.message || 'Something bad occured', code: error?.code || 'something-bad-occured-error' }
        ])
      }
      return undefined
    }
  }
}

const dataPipelineServiceController = new DataPipelineServiceController()

export default dataPipelineServiceController
