export interface AccessTokenResponse {
  access_token: string
  expires_in: number
  refresh_expires_in: number
  refresh_token: string
  token_type: string
  'not-before-policy': number
  session_state: string
  scope: string
}

export interface KeycloakParsedAccessToken {
  token: string
  clientId: string
  header: {
    alg: string
    typ: string
    kid: string
  }
  content: {
    exp: number
    iat: number
    auth_time: number
    jti: string
    iss: string
    aud: string
    sub: string
    typ: string
    azp: string
    nonce: string
    session_state: string
    acr: string
    'allowed-origins': string[]
    realm_access: {
      roles: string[]
    }
    resource_access: {
      account: {
        roles: string[]
      }
    }
    scope: string
    sid: string
    superset_role: string
    email_verified: boolean
    name: string
    preferred_username: string
    given_name: string
    family_name: string
    email: string
  }
}

export interface KeycloakParsedAccessTokenWithGrant {
  access_token: KeycloakParsedAccessToken
}
