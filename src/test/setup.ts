import Knex from 'knex'
import dotenv from 'dotenv'
import path from 'path'
import rabbitmqLib from '../service/rabbit-mq'
dotenv.config({ path: path.join(__dirname, '../../.env') })

export const test_schema = 'data_profile_service'
export const test_database = 'postgres'
export const test_table = 'data_profile'
export const test_run_history_table = 'data_profile_run_history'

export const knexTestClient = Knex({
  client: process.env.DB_CLIENT,
  connection: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    pool: { min: 1, max: 5 }
  }
})

async function createTestSchemaAndDatabase() {
  try {
    await knexTestClient.raw(`DROP SCHEMA IF EXISTS ${test_schema} CASCADE`)
    await knexTestClient.raw(`CREATE SCHEMA ${test_schema}`)
  } catch (error) {
    console.log('error', error)
  }
}

async function createDataProfileTable() {
  await knexTestClient.raw(`CREATE TABLE ${test_schema}.${test_table} (
    profile_id SERIAL PRIMARY KEY,
    profile_name VARCHAR(255) NOT NULL UNIQUE,
    table_name VARCHAR(255) NOT NULL UNIQUE,
    schema VARCHAR(255) NOT NULL,
  	target_connection_id integer NOT NULL,
    created_by VARCHAR(50) NOT NULL,
    last_sync_time TIMESTAMP WITH TIME ZONE,
    updated_by VARCHAR(50),
    last_sync_by VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT false,
    has_validation_error BOOLEAN DEFAULT false,
    profile_def JSONB NOT NULL,
    version INTEGER DEFAULT 0
);`)
  await knexTestClient.raw(`CREATE TABLE ${test_schema}.${test_run_history_table} (
    catalog_execution_id serial PRIMARY KEY,
  	event_id VARCHAR(255) NOT NULL UNIQUE,
    data_profile_id integer NOT NULL references data_profile_service.data_profile(profile_id),
  	target_connection_id integer NOT NULL,
    execution_start_time TIMESTAMP WITH TIME ZONE,
    execution_end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(255) NOT NULL,
  	error_message VARCHAR
);`)
}

export async function dropDataBaseAndSchema() {
  try {
    await knexTestClient.raw(`DROP SCHEMA IF EXISTS ${test_schema} CASCADE`)
  } catch (error) {
    console.log('error', error)
  }
}

beforeAll(async () => {
  await createTestSchemaAndDatabase()
  await createDataProfileTable()

  process.env.NODE_ENV = 'test'
  process.env.RABBIT_MQ_URL = 'amqp://user_admin_mis_mq:guest@localhost:5672//mis-app-vhost'
  process.env.RABBIT_MQ_PREFETCH_COUNT = '1'
  process.env.RABBIT_MQ_DATA_CATALOG_EVENTS_EXCHANGE = 'x.datacatalog-events-exchange'
  process.env.RABBIT_MQ_DATA_CATALOG_UPDATE_ROUTING_KEY = 'datacatalog.execute'
  process.env.RABBIT_MQ_DATA_CATALOG_UPDATE_QUEUE = 'x.datacatalog-cataloging-update-queue'

  process.env.CONNECTION_SERVICE_URL = 'http://localhost:8088'
  process.env.DATA_PIPELINE_SERVICE_URL = 'http://localhost:9099'

  process.env.DB_HOST = '127.0.0.1'
  process.env.DB_PORT = '5433'
  process.env.DB_USER = 'postgres'
  process.env.DB_NAME = 'postgres'
  process.env.DB_PASSWORD = 'postgres'
  process.env.DB_CLIENT = 'pg'

  rabbitmqLib.initConnection(() => {
    // // Start the consumer worker when the connection to RabbitMQ has been made
    // rabbitmqLib.startConsumer(APP_CONFIG.rabbitMQ.dataCatalogUpdateQueue!, fnConsumer)
    // Start the publisher when the connection to RabbitMQ has been made
    rabbitmqLib.startPublisher()
  })
})

beforeEach(async () => {
  await knexTestClient.raw(`DELETE FROM ${test_schema}.${test_run_history_table} CASCADE`)
  await knexTestClient.raw(`DELETE FROM ${test_schema}.${test_table} CASCADE`)
})

afterEach(async () => {
  await knexTestClient.raw(`DELETE FROM ${test_schema}.${test_run_history_table} CASCADE`)
  await knexTestClient.raw(`DELETE FROM ${test_schema}.${test_table} CASCADE`)
})

// eslint-disable-next-line no-var, @typescript-eslint/no-explicit-any
var trx: any
beforeEach(function (done) {
  knexTestClient.transaction(function (newTrx) {
    trx = newTrx
    done()
  })
})

afterEach(function (done) {
  trx.rollback().then(async function () {
    done()
  })
})

afterAll(async () => {
  await dropDataBaseAndSchema()
  await knexTestClient.destroy()
})
