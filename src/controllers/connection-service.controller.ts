import { APP_CONFIG } from '../config/constants'
import fetch, { FetchError } from 'node-fetch'
import { BadRequestError } from '../errors/bad-request-error'
import authService from '../providers/AuthProvider'

export interface AllDatabaseDetails {
  connectionId: number
  connectionName: string
  type: string
}

class ConnectionServiceController {
  getAllDatabase = async (): Promise<AllDatabaseDetails[] | undefined> => {
    try {
      const res = await authService.getServiceAccountAccessToken()
      const response = await fetch(`${APP_CONFIG.connectionService.url}/connections/connection/database`, {
        headers: {
          Authorization: `Bearer ${res?.access_token}`
        }
      })
      return await response.json()
    } catch (error) {
      console.log('error getAllDatabase :>> ', error)
      if (error instanceof FetchError) {
        throw new BadRequestError([
          { message: error?.message || 'Something bad occured', code: error?.code || 'something-bad-occured-error' }
        ])
      }
      return undefined
    }
  }
}

const connectionServiceController = new ConnectionServiceController()

export default connectionServiceController
