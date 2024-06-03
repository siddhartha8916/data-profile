import { CreateDataProfileBody, IDataProfile } from '../types/app'
import handleDatabaseOperation from '../middleware/catch-database-error'
import dataClient from '../providers/DataProvider'

const defaultSortColumn = 'last_sync_time'

class DataProfileService {
  private schemaName = 'data_profile_service'
  private tableName = 'data_profile'

  constructor() {}

  async getAllDP({
    searchTerm = '',
    limit,
    page,
    sort_by
  }: {
    searchTerm: string
    limit: number | null
    page: number | null
    sort_by: string
  }): Promise<IDataProfile[]> {
    const sortBy = sort_by && JSON.parse(sort_by)
    const sortColumn = sortBy?.column || defaultSortColumn
    const order = sortBy?.order || 'desc'

    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      const query = trx
        .select([
          'profile_id',
          'profile_name',
          'table_name',
          'schema',
          'created_by',
          'target_connection_id',
          'has_validation_error',
          'updated_by',
          'last_sync_time',
          'created_at',
          'updated_at',
          'is_active',
          'version'
        ])
        .from(`${this.schemaName}.${this.tableName}`)
        .orderBy(sortColumn, order)
        .whereILike('profile_name', `%${searchTerm}%`)
        .orWhereILike('table_name', `%${searchTerm}%`)
        .orWhereILike('created_by', `%${searchTerm}%`)

      if (limit && page) {
        const offset = (page - 1) * limit
        query.limit(limit)
        query.offset(offset)
      }
      return query
    })
  }

  async getAllDPCount(searchTerm = ''): Promise<{ count: string }[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      return trx
        .select()
        .from(`${this.schemaName}.${this.tableName}`)
        .whereILike('profile_name', `%${searchTerm}%`)
        .orWhereILike('table_name', `%${searchTerm}%`)
        .orWhereILike('created_by', `%${searchTerm}%`)
        .count('profile_id')
    })
  }

  async getDPByID({ profile_id }: { profile_id: string }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()
    return handleDatabaseOperation(knexClient, async (trx) => {
      return trx
        .select()
        .from(`${this.schemaName}.${this.tableName}`)
        .orderBy(defaultSortColumn, 'desc')
        .where({ profile_id })
    })
  }

  async checkIfDPAlreadyExists({
    profile_name,
    table_name
  }: {
    profile_name: string
    table_name?: string
  }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      const query = trx(`${this.schemaName}.${this.tableName}`).where({ profile_name })

      if (table_name) {
        query.orWhere({ table_name })
      }

      return query
    })
  }

  async deleteDPByID({ profile_id }: { profile_id: string }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      await trx(`${this.schemaName}.${this.tableName}`).forUpdate().select('*').where({ profile_id })
      return trx(`${this.schemaName}.${this.tableName}`).forUpdate().where({ profile_id }).update(
        {
          is_active: false
        },
        ['profile_id', 'profile_name']
      )
    })
  }

  async updateLastSyncTime({
    profile_id,
    last_sync_time
  }: {
    profile_id: string
    last_sync_time: string
  }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      await trx(`${this.schemaName}.${this.tableName}`).forUpdate().select('*').where({ profile_id })
      return trx(`${this.schemaName}.${this.tableName}`).forUpdate().where({ profile_id }).update(
        {
          last_sync_time
        },
        [
          'profile_id',
          'profile_name',
          'table_name',
          'target_connection_id',
          'created_by',
          'updated_by',
          'last_sync_time',
          'created_at',
          'updated_at',
          'version'
        ]
      )
    })
  }

  async createDP({
    profile
  }: {
    profile: CreateDataProfileBody & {
      created_by: string
      created_at: string
    }
  }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      return trx(`${this.schemaName}.${this.tableName}`).insert(profile, [
        'profile_id',
        'profile_name',
        'table_name',
        'schema',
        'target_connection_id',
        'has_validation_error',
        'created_by',
        'updated_by',
        'last_sync_time',
        'created_at',
        'updated_at',
        'version'
      ])
    })
  }

  async updateProfileDetails({ profile }: { profile: IDataProfile }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      const version = await trx(`${this.schemaName}.${this.tableName}`)
        .forUpdate()
        .select('*')
        .where({ profile_id: profile.profile_id })
      return trx(`${this.schemaName}.${this.tableName}`)
        .forUpdate()
        .where({ profile_id: profile.profile_id })
        .update(
          {
            profile_name: profile.profile_name,
            profile_def: profile.profile_def,
            updated_by: profile.updated_by,
            updated_at: profile.updated_at,
            version: version[0].version + 1
          },
          [
            'profile_id',
            'profile_name',
            'table_name',
            'schema',
            'target_connection_id',
            'created_by',
            'updated_by',
            'last_sync_time',
            'created_at',
            'updated_at',
            'version'
          ]
        )
    })
  }

  async updateProfileIs_Active({
    profile_id,
    status
  }: {
    profile_id: string
    status: boolean
  }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()

    return handleDatabaseOperation(knexClient, async (trx) => {
      await trx(`${this.schemaName}.${this.tableName}`).forUpdate().select('*').where({ profile_id })
      return trx(`${this.schemaName}.${this.tableName}`).forUpdate().where({ profile_id }).update(
        {
          is_active: status
        },
        ['profile_id', 'profile_name']
      )
    })
  }

  async updateProfileHas_ValidationError({
    profile_id,
    status
  }: {
    profile_id: string
    status: boolean
  }): Promise<IDataProfile[]> {
    const knexClient = dataClient.getPostgres()
    console.log('Updating hasValidationError for a profile :>> ')
    return handleDatabaseOperation(knexClient, async (trx) => {
      await trx(`${this.schemaName}.${this.tableName}`).forUpdate().select('*').where({ profile_id })
      return trx(`${this.schemaName}.${this.tableName}`).forUpdate().where({ profile_id }).update(
        {
          has_validation_error: status
        },
        ['profile_id', 'profile_name', 'has_validation_error']
      )
    })
  }
}

export default DataProfileService
