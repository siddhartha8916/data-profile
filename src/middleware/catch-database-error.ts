import { Knex } from 'knex'
import { DatabaseConnectionError } from '../errors/database-connection-error'

async function handleDatabaseOperation<T>(
  knexInstance: Knex,
  transactionOperation: (trx: Knex.Transaction) => Promise<T>
): Promise<T> {
  const isolationLevel = 'serializable'
  const trx = await knexInstance.transaction({ isolationLevel })

  try {
    const result = await transactionOperation(trx)
    await trx.commit()
    return result
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    await trx.rollback()
    console.log('error handleDatabaseOperation :>> ', error)
    throw new DatabaseConnectionError(error)
  }
}

export default handleDatabaseOperation
