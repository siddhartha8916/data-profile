export const checkEnvironmentVariables = () => {
  if (!process.env.DATA_PROFILE_SERVICE_DATABASE_URL) {
    throw new Error('DATA_PROFILE_SERVICE_DATABASE_URL not defined')
  }
  if (!process.env.DB_SSL) {
    throw new Error('DB_SSL not defined')
  }
  if (!process.env.DATA_PIPELINE_SERVICE_URL) {
    throw new Error('DATA_PIPELINE_SERVICE_URL not defined')
  }
  if (!process.env.CONNECTION_SERVICE_URL) {
    throw new Error('CONNECTION_SERVICE_URL not defined')
  }
  if (!process.env.RABBIT_MQ_DATA_CATALOG_UPDATE_QUEUE) {
    throw new Error('RABBIT_MQ_DATA_CATALOG_UPDATE_QUEUE not defined')
  }
  if (!process.env.RABBIT_MQ_DATA_CATALOG_UPDATE_ROUTING_KEY) {
    throw new Error('RABBIT_MQ_DATA_CATALOG_UPDATE_ROUTING_KEY not defined')
  }
  if (!process.env.RABBIT_MQ_DATA_PROFILE_UPDATE_QUEUE) {
    throw new Error('RABBIT_MQ_DATA_PROFILE_UPDATE_QUEUE not defined')
  }
  if (!process.env.KEYCLOAK_REALM) {
    throw new Error('KEYCLOAK_REALM not defined')
  }
  if (!process.env.KEYCLOAK_SERVER_URL) {
    throw new Error('KEYCLOAK_SERVER_URL not defined')
  }
  if (!process.env.KEYCLOAK_CLIENT_ID) {
    throw new Error('KEYCLOAK_CLIENT_ID not defined')
  }
  if (!process.env.KEYCLOAK_CLIENT_SECRET) {
    throw new Error('KEYCLOAK_CLIENT_SECRET not defined')
  }
  if (!process.env.KEYCLOAK_SERVICE_ACCOUNT_USERNAME) {
    throw new Error('KEYCLOAK_SERVICE_ACCOUNT_USERNAME not defined')
  }
  if (!process.env.KEYCLOAK_SERVICE_ACCOUNT_PASSWORD) {
    throw new Error('KEYCLOAK_SERVICE_ACCOUNT_PASSWORD not defined')
  }

  const utcData = new Date().toUTCString()
  const isoDate = new Date().toISOString()
  console.log('Date in UTC format', utcData)
  console.log('Date in ISO format', isoDate)
}
