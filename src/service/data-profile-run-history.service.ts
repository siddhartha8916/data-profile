import crypto from 'crypto'

import handleDatabaseOperation from '../middleware/catch-database-error'
import { DataProfile_RunHistory } from '../types/rabbit-mq'
import dataClient from '../providers/DataProvider'

// const defaultSortColumn = 'status'

class DataProfileRunHistoryService {
  private schemaName = 'data_profile_service'
  private tableName = 'data_profile_run_history'

  constructor() {}

  async dataProfile_AddRunHistory({
    profile_id,
    target_connection_id
  }: {
    profile_id: number
    target_connection_id: number
  }): Promise<DataProfile_RunHistory[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      const data = {
        event_id: crypto.randomUUID(),
        data_profile_id: profile_id,
        target_connection_id,
        execution_start_time: new Date().toISOString(),
        status: 'QUEUED',
        error_message: ''
      }

      return trx(`${this.schemaName}.${this.tableName}`).insert(data, [
        'catalog_execution_id',
        'event_id',
        'data_profile_id',
        'execution_start_time',
        'execution_end_time',
        'target_connection_id',
        'status',
        'error_message'
      ])
    })
  }

  async dataProfile_UpdateRunHistoryStatus({
    catalog_execution_id,
    eventResponse,
    error_message
  }: {
    catalog_execution_id: number
    eventResponse: string
    error_message: string
  }): Promise<DataProfile_RunHistory[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      await trx(`${this.schemaName}.${this.tableName}`).forUpdate().select('*').where({ catalog_execution_id })

      const status = ['ALTER TABLE SUCCESS', 'CREATE TABLE SUCCESS'].includes(eventResponse) ? 'SUCCESS' : 'FAILURE'

      return trx(`${this.schemaName}.${this.tableName}`).forUpdate().where({ catalog_execution_id }).update(
        {
          status,
          execution_end_time: new Date().toISOString(),
          error_message
        },
        [
          'catalog_execution_id',
          'data_profile_id',
          'execution_start_time',
          'execution_end_time',
          'status',
          'error_message'
        ]
      )
    })
  }
}

const dataProfileRunHistoryService = new DataProfileRunHistoryService() // Created an instance outside the class

export default dataProfileRunHistoryService
