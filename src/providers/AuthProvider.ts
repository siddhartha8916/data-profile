import Keycloak, { Keycloak as KeycloakType } from 'keycloak-connect'
import fetch, { FetchError } from 'node-fetch'
import { URLSearchParams } from 'url'
import { APP_CONFIG } from '../config/constants'
import { AccessTokenResponse } from '../types/auth'
import { BadRequestError } from '../errors/bad-request-error'

class AuthService {
  private keycloak!: KeycloakType

  constructor() {
    this.keycloak = new Keycloak(
      {},
      {
        realm: APP_CONFIG.authConfig.realm,
        'bearer-only': true,
        'auth-server-url': APP_CONFIG.authConfig.serverUrl,
        'ssl-required': 'external',
        resource: APP_CONFIG.authConfig.clientId,
        'confidential-port': 8443
      }
    )
  }

  getKeycloakInstance(): KeycloakType {
    return this.keycloak
  }

  async getServiceAccountAccessToken(): Promise<AccessTokenResponse | undefined> {
    try {
      const formData = new URLSearchParams()
      formData.append('username', APP_CONFIG.authConfig.serviceAccountUsername)
      formData.append('password', APP_CONFIG.authConfig.serviceAccountPassword)
      formData.append('grant_type', 'password')
      formData.append('client_id', APP_CONFIG.authConfig.clientId)
      formData.append('client_secret', APP_CONFIG.authConfig.clientSecret)

      const response = await fetch(
        `${APP_CONFIG.authConfig.serverUrl}/realms/${APP_CONFIG.authConfig.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.log('error getServiceAccessToken :>> ', error)
      if (error instanceof FetchError) {
        throw new BadRequestError([
          { message: error?.message || 'Something bad occurred', code: error?.code || 'something-bad-occurred-error' }
        ])
      }
      return undefined
    }
  }
}

const authService = new AuthService()

export default authService
