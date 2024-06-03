/* tslint:disable await-promise */
import Knex from 'knex'
import { Database } from '../config/constants'

/**
 * Initialize a new Postgres provider
 */

export async function init() {
  const knex = Knex({
    client: 'pg',
    pool: {
      min: Database.poolMin,
      max: Database.poolMax,
      idleTimeoutMillis: Database.poolIdle
    },
    connection: {
      host: Database.host,
      port: Number(Database.port),
      user: Database.user,
      database: Database.database,
      password: Database.password,
      ssl: process.env.DB_SSL === 'local' ? false : { rejectUnauthorized: false }
    },
    acquireConnectionTimeout: 2000
  })

  // Verify the connection before proceeding
  try {
    await knex.raw('SELECT now()')
    console.log('[DB] Connected')
    return knex
  } catch (error) {
    console.log(error)
    throw new Error('Unable to connect to Postgres via Knex. Ensure a valid connection.')
  }
}

export default { init }
