import { Knex } from 'knex'
import PostgresProvider from './PostgresProvider'

export class DataClient {
  private postgres!: Knex

  async init(): Promise<void> {
    this.postgres = await PostgresProvider.init()
  }

  getPostgres(): Knex {
    return this.postgres
  }
}

const dataClient = new DataClient()

export default dataClient
