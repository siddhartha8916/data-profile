import { GrantProperties, Token } from 'keycloak-connect'
import { KeycloakParsedAccessTokenWithGrant } from './auth'

export interface KeycloakToken extends Token {
  token: string
}

interface GrantPropertiesWithToken extends GrantProperties {
  access_token?: KeycloakToken
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      kauth?: {
        grant?: GrantPropertiesWithToken | KeycloakParsedAccessTokenWithGrant
      }
    }
  }
}
