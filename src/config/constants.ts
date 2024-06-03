/* eslint-disable @typescript-eslint/no-namespace */
import 'dotenv/config'
import parseDbUrl from 'parse-database-url'

export const allowedDataTypes = ['INT', 'VARCHAR', 'TIMESTAMP', 'DATE', 'TIMESTAMP_TZ', 'NUMERIC', 'BOOLEAN', 'CHAR']
export const allowedOperations = ['CONCATENATE', 'SUM', 'DIFF', 'PRODUCT', 'MOD', 'DIVIDE', 'AGE', '']
export const disallowedCharsRegexWithSpace = /[{$()}<>!@%^&*()=\-+,.\/?\s]/
export const disallowedCharsRegexWithoutSpace = /[{$()}<>!@%^&*()=\-+,.\/?]/
export const maxOnColumnsAllowed = 4
export const CAHCE_TIMEOUT = 86400

export const APP_CONFIG = {
  rabbitMQ: {
    url: process.env.RABBIT_MQ_URL!,
    prefetchCount: process.env.RABBIT_MQ_PREFETCH_COUNT!,
    dataCatalogEventsExchange: process.env.RABBIT_MQ_DATA_CATALOG_EVENTS_EXCHANGE!,
    dataCatalogUpdateRoutingKey: process.env.RABBIT_MQ_DATA_CATALOG_UPDATE_ROUTING_KEY!,
    dataCatalogUpdateQueue: process.env.RABBIT_MQ_DATA_CATALOG_UPDATE_QUEUE!,
    dataProfileUpdateQueue: process.env.RABBIT_MQ_DATA_PROFILE_UPDATE_QUEUE!
  },
  connectionService: {
    url: process.env.CONNECTION_SERVICE_URL!
  },
  dataPipelineService: {
    url: process.env.DATA_PIPELINE_SERVICE_URL!
  },
  authConfig: {
    realm: process.env.KEYCLOAK_REALM!,
    serverUrl: process.env.KEYCLOAK_SERVER_URL!,
    clientId: process.env.KEYCLOAK_CLIENT_ID!,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
    serviceAccountUsername: process.env.KEYCLOAK_SERVICE_ACCOUNT_USERNAME!,
    serviceAccountPassword: process.env.KEYCLOAK_SERVICE_ACCOUNT_PASSWORD!
  }
}

export namespace Database {
  export const schema = process.env.CONNECTOR_SCHEMA_NAME!
  export const url = process.env.DATA_PROFILE_SERVICE_DATABASE_URL!
  export const config = parseDbUrl(url)
  export const { database, driver, host, password, port, user } = config
  export const poolMin = Number(process.env.DATABASE_POOL_MIN || '2')
  export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10')
  export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000')
  export const connectorTable = process.env.CONNECTOR_TABLE_NAME!
}

export namespace Knex {
  export const config = {
    client: 'pg',
    connection: {
      host: process.env.DATABASE_HOSTNAME || Database.host,
      database: process.env.DATABASE_NAME || Database.database,
      user: process.env.DATABASE_USERNAME || Database.user,
      password: process.env.DATABASE_PASSWORD || Database.password,
      port: process.env.DATABASE_PORT || Database.port
    },
    pool: {
      min: process.env.DATABASE_POOL_MIN,
      max: process.env.DATABASE_POOL_MAX,
      idle: process.env.DATABASE_POOL_IDLE
    }
  }
}

export namespace Server {
  export const port = Number(process.env.PORT || '8000')
  export const bodyLimit = '100kb'
  export const corsHeaders = ['Link']
  export const isDev = process.env.NODE_ENV === 'development'
}
