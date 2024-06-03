import { Request, Response } from 'express'
import catchAsyncError from '../middleware/catch-async-error'
import {
  CreateDataProfileBody,
  CustomErrorObject,
  IColumn,
  IColumnDef,
  IProfileDef,
  UpdateDataProfileBody
} from '../types/app'
import { NotFoundError } from '../errors/not-found-error'
import DataProfileService from '../service/data-profile.service'
import { BadRequestError } from '../errors/bad-request-error'
import { CAHCE_TIMEOUT, maxOnColumnsAllowed } from '../config/constants'
import { CachePriority, appCache } from '../lib/cache'
import { constructPagesObject } from '../utils/helpers'
import { sendMessageToDataCatalogExchange_RabbitMQ } from './rabbit-mq-data-catalog.controller'
import { RabbitMQDataCatalogEvent_DataProfileCreated } from '../types/rabbit-mq'
import dataProfileRunHistoryService from '../service/data-profile-run-history.service'
import connectionServiceController from './connection-service.controller'
import dataPipelineServiceController from './data-pipeline-service.controller'
import { KeycloakParsedAccessTokenWithGrant } from '../types/auth'

class DataProfileController {
  private dataProfileService: DataProfileService

  constructor() {
    // Create an instance in the constructor
    this.dataProfileService = new DataProfileService()
  }

  // Same column names not allowed
  private checkDuplicateColumnNames = ({ columnDef }: { columnDef: IColumnDef }): CustomErrorObject[] => {
    const { indexColumns, regularColumns, derivedColumns } = columnDef
    const columnNames = new Set()

    const duplicates: CustomErrorObject[] = []

    const checkDuplicatesInArray = (columns: IColumn[], type: string) => {
      columns.forEach((column) => {
        if (columnNames.has(column.columnName)) {
          duplicates.push({
            message: `Duplicate column '${column.columnName}' in ${type}`,
            code: `duplicate-columnName-${type}|${column.columnName}`
          })
        } else {
          columnNames.add(column.columnName)
        }
      })
    }

    checkDuplicatesInArray(indexColumns, 'indexColumns')
    checkDuplicatesInArray(regularColumns, 'regularColumns')
    checkDuplicatesInArray(derivedColumns, 'derivedColumns')

    return duplicates
  }

  // References property only allowed for INT, CHAR and VARCHAR
  private validateReferencesProperty = ({ columnDef }: { columnDef: IColumnDef }): CustomErrorObject[] => {
    const { indexColumns, regularColumns, derivedColumns } = columnDef
    const missingDefaults: CustomErrorObject[] = []

    const checkReferencesInArray = (columns: IColumn[], type: string) => {
      columns.forEach((column) => {
        if (!['VARCHAR', 'CHAR', 'INT'].includes(column.dataType)) {
          if (column.references) {
            missingDefaults.push({
              message: `references not allowed for '${column.columnName}' in ${type} (Only allowed when dataType is 'VARCHAR', 'CHAR', 'INT')`,
              code: `references-not-allowed|${column.columnName}`
            })
          }
        }
      })
    }

    checkReferencesInArray(indexColumns, 'indexColumns')
    checkReferencesInArray(regularColumns, 'regularColumns')
    checkReferencesInArray(derivedColumns, 'derivedColumns')

    return missingDefaults
  }

  // Not allow maxAllowedChars for DATE, TIMESTAMP, TIMESTAMP_TZ datatype
  private checkMaxAllowedChars = ({ columnDef }: { columnDef: IColumnDef }): CustomErrorObject[] => {
    const { indexColumns, regularColumns, derivedColumns } = columnDef
    const errors: CustomErrorObject[] = []

    const checkMaxAllowedInArray = (columns: IColumn[], type: string) => {
      columns.forEach((column) => {
        if (['DATE', 'TIMESTAMP', 'TIMESTAMP_TZ', 'INT', 'NUMERIC'].includes(column.dataType)) {
          if (column.maxAllowedChars !== null) {
            errors.push({
              message: `maxAllowedChars in ${type}.${column.columnName} must be null for (DATE, TIMESTAMP, TIMESTAMP_TZ, INT, NUMERIC)`,
              code: `maxAllowedChars-null-error|${column.columnName}`
            })
          }
        }
      })
    }

    checkMaxAllowedInArray(indexColumns, 'indexColumns')
    checkMaxAllowedInArray(regularColumns, 'regularColumns')
    checkMaxAllowedInArray(derivedColumns, 'derivedColumns')

    return errors
  }

  // Only 4 onColumns property allowed in derivedColumns
  private validateDerivedColumnOnColumnsCount({ derivedColumns }: { derivedColumns: IColumn[] }): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []

    derivedColumns.forEach((column) => {
      if (column?.onColumns && column?.onColumns?.length > maxOnColumnsAllowed) {
        errors.push({
          message: `Exceeded maximum allowed onColumns for derivedColumn`,
          code: `max-onColumns-exceeded|${column.columnName}`
        })
      }
    })

    return errors
  }

  // Check for derivedColumns having only those columnNames which are defined in either indexColumns ar regularColumns
  private validateDerivedColumnsOnColumnsNameIsValid = ({
    columnDef
  }: {
    columnDef: IColumnDef
  }): CustomErrorObject[] => {
    const { indexColumns, regularColumns, derivedColumns } = columnDef

    const validColumnNames = new Set([
      ...indexColumns.map((column) => column.columnName),
      ...regularColumns.map((column) => column.columnName)
    ])

    const invalidOnColumns = derivedColumns.filter((column) => {
      if (column.onColumns && Array.isArray(column.onColumns)) {
        return column.onColumns.some((onCol) => !validColumnNames.has(onCol))
      }
      return false
    })

    if (invalidOnColumns.length > 0) {
      return invalidOnColumns.map((column) => ({
        message: `Invalid onColumns in '${column.columnName}' within derivedColumns`,
        code: `invalid-onColumns|${column.columnName}`
      }))
    }

    return []
  }

  private validateConcatenateOperation(
    column: IColumn,
    columnDataTypesMap: Map<string, string>,
    derivedColIdx: number
  ): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []

    if (column.operation === 'CONCATENATE') {
      if (column.dataType !== 'VARCHAR') {
        errors.push({
          message: `For CONCATENATE operation, derivedColumns[${derivedColIdx}].'${column.columnName}' must be VARCHAR`,
          code: `concatenate-datatype-error|${column.columnName}`
        })
      }

      column?.onColumns?.forEach((colName: string) => {
        const dataType = columnDataTypesMap.get(colName)
        if (!['CHAR', 'VARCHAR'].includes(dataType!)) {
          errors.push({
            message: `For CONCATENATE operation, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be CHAR or VARCHAR`,
            code: `concatenate-operation-error|${colName}`
          })
        }
      })
    }

    return errors
  }

  private validateAgeOperation(
    column: IColumn,
    columnDataTypesMap: Map<string, string>,
    derivedColIdx: number
  ): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []

    if (column.operation === 'AGE') {
      // todo Check for derivedColumn dataType based on AGE operation selected
      if (column.dataType !== 'INT') {
        errors.push({
          message: `For AGE operation, derivedColumns[${derivedColIdx}].'${column.columnName}' must be INT`,
          code: `age-datatype-error|${column.columnName}`
        })
      }

      if (column.onValue !== null) {
        errors.push({
          message: `For AGE operation, onValue is not allowed`,
          code: `age-onValue-error|${column.columnName}`
        })
      }

      if (column?.onColumns?.length !== 1) {
        errors.push({
          message: `For AGE operation, only one onColumn is allowed`,
          code: `age-onColumn-error|${column.columnName}`
        })
      }

      column?.onColumns?.forEach((colName: string) => {
        const dataType = columnDataTypesMap.get(colName)
        if (!['DATE', 'TIMESTAMP', 'TIMESTAMP_TZ'].includes(dataType!)) {
          errors.push({
            message: `For AGE operation, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be ('DATE', 'TIMESTAMP', 'TIMESTAMP_TZ')`,
            code: `age-onColumns-datatype-error|${colName}`
          })
        }
      })
    }

    return errors
  }

  private validateModOperation(
    column: IColumn,
    columnDataTypesMap: Map<string, string>,
    derivedColIdx: number
  ): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []
    if (column.operation === 'MOD') {
      // const colDataType = column.dataType
      if (!['INT', 'NUMERIC'].includes(column.dataType)) {
        errors.push({
          message: `For MOD operation, derivedColumns[${derivedColIdx}].'${column.columnName}' must be INT or NUMERIC`,
          code: `mod-datatype-error|${column.columnName}`
        })
      }
      if (column.onValue === null) {
        if (column?.onColumns?.length !== 2) {
          errors.push({
            message: `For MOD operation with onValue null, exactly two onColumns are allowed`,
            code: `mod-onValue-null-columns-error|${column.columnName}`
          })
        }
      } else if (column?.onColumns?.length !== 1) {
        errors.push({
          message: `For MOD operation with onValue, only one onColumn is allowed`,
          code: `mod-onValue-columns-error|${column.columnName}`
        })
      }

      column?.onColumns?.forEach((colName) => {
        const dataType = columnDataTypesMap.get(colName)
        const colDataType = column.dataType

        if (colDataType === 'INT' && dataType !== 'INT') {
          errors.push({
            message: `For MOD operation, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be INT`,
            code: `mod-mathematical-operation-error-int|${colName}`
          })
        } else if (colDataType === 'NUMERIC' && !['INT', 'NUMERIC'].includes(dataType!)) {
          errors.push({
            message: `For MOD operation, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be NUMERIC or INT`,
            code: `mod-mathematical-operation-error-num-int|${colName}`
          })
        }
      })
    }
    return errors
  }

  private validateDivideOperation(
    column: IColumn,
    columnDataTypesMap: Map<string, string>,
    derivedColIdx: number
  ): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []

    if (column.operation === 'DIVIDE') {
      if (column.onValue === null) {
        if (column?.onColumns?.length !== 2) {
          errors.push({
            message: `For DIVIDE operation with onValue null, exactly two onColumns are allowed`,
            code: `divide-onValue-null-columns-error|${column.columnName}`
          })
        }
      } else if (column?.onColumns?.length !== 1) {
        errors.push({
          message: `For DIVIDE operation with onValue, only one onColumn is allowed`,
          code: `divide-onValue-columns-error|${column.columnName}`
        })
      }

      if (column.dataType !== 'NUMERIC') {
        errors.push({
          message: `For DIVIDE operation, derivedColumns[${derivedColIdx}].'${column.columnName}' must be NUMERIC`,
          code: `divide-datatype-error|${column.columnName}`
        })
      }

      column?.onColumns?.forEach((colName) => {
        const dataType = columnDataTypesMap.get(colName)
        if (!['NUMERIC', 'INT'].includes(dataType!)) {
          errors.push({
            message: `For DIVIDE operation, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be NUMERIC or INT`,
            code: `divide-onColumns-datatype-error|${colName}`
          })
        }
      })
    }

    return errors
  }

  private validateSumOperation(
    column: IColumn,
    columnDataTypesMap: Map<string, string>,
    derivedColIdx: number
  ): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []

    if (column.operation === 'SUM') {
      if (!['INT', 'NUMERIC'].includes(column.dataType)) {
        errors.push({
          message: `For SUM operation, derivedColumns[${derivedColIdx}].'${column.columnName}' must be INT or NUMERIC`,
          code: `sum-datatype-error|${column.columnName}`
        })
      }

      column?.onColumns?.forEach((colName) => {
        const dataType = columnDataTypesMap.get(colName)
        if (column.dataType === 'INT' && dataType !== 'INT') {
          errors.push({
            message: `For SUM operation with INT type, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be INT`,
            code: `sum-onColumns-int-datatype-error|${colName}`
          })
        } else if (column.dataType === 'NUMERIC' && !['INT', 'NUMERIC'].includes(dataType!)) {
          errors.push({
            message: `For SUM operation with NUMERIC type, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be INT or NUMERIC`,
            code: `sum-onColumns-numeric-datatype-error|${colName}`
          })
        }
      })
    }

    return errors
  }

  private validateDiffOperation(
    column: IColumn,
    columnDataTypesMap: Map<string, string>,
    derivedColIdx: number
  ): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []
    if (column.operation === 'DIFF') {
      if (!['INT', 'NUMERIC'].includes(column.dataType)) {
        errors.push({
          message: `For DIFF operation, derivedColumns[${derivedColIdx}].'${column.columnName}' must be INT or NUMERIC`,
          code: `diff-datatype-error|${column.columnName}`
        })
      }

      if (column.onValue === null) {
        if (column?.onColumns?.length !== 2) {
          errors.push({
            message: `For DIFF operation with onValue null, exactly two onColumns are allowed`,
            code: `diff-onValue-null-columns-error|${column.columnName}`
          })
        }
      } else if (column?.onColumns?.length !== 1) {
        errors.push({
          message: `For DIFF operation with onValue, only one onColumn is allowed`,
          code: `diff-onValue-columns-error|${column.columnName}`
        })
      }

      column?.onColumns?.forEach((colName) => {
        const dataType = columnDataTypesMap.get(colName)
        const colDataType = column.dataType

        if (colDataType === 'INT' && dataType !== 'INT') {
          errors.push({
            message: `For DIFF operation, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be INT`,
            code: `diff-onColumns-int-datatype-error|${colName}`
          })
        } else if (colDataType === 'NUMERIC' && !['INT', 'NUMERIC'].includes(dataType!)) {
          errors.push({
            message: `For DIFF operation, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be NUMERIC or INT`,
            code: `diff-onColumns-numeric-datatype-error|${colName}`
          })
        }
      })
    }
    return errors
  }

  private validateProductOperation(
    column: IColumn,
    columnDataTypesMap: Map<string, string>,
    derivedColIdx: number
  ): CustomErrorObject[] {
    const errors: CustomErrorObject[] = []

    if (column.operation === 'PRODUCT') {
      if (!['INT', 'NUMERIC'].includes(column.dataType)) {
        errors.push({
          message: `For PRODUCT operation, derivedColumns[${derivedColIdx}].'${column.columnName}' must be INT or NUMERIC`,
          code: `product-datatype-error|${column.columnName}`
        })
      }

      column?.onColumns?.forEach((colName) => {
        const dataType = columnDataTypesMap.get(colName)
        if (column.dataType === 'INT' && dataType !== 'INT') {
          errors.push({
            message: `For PRODUCT operation with INT type, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be INT`,
            code: `product-onColumns-int-datatype-error|${colName}`
          })
        } else if (column.dataType === 'NUMERIC' && !['INT', 'NUMERIC'].includes(dataType!)) {
          errors.push({
            message: `For PRODUCT operation with NUMERIC type, onColumns derivedColumns[${derivedColIdx}].'${colName}' must be INT or NUMERIC`,
            code: `product-onColumns-numeric-datatype-error|${colName}`
          })
        }
      })
    }

    return errors
  }

  private checkOnePrimaryColumn(indexColumns: IColumn[]) {
    let primaryCount = 0

    for (const column of indexColumns) {
      if (column.isPrimary) {
        primaryCount++
        if (primaryCount > 1) {
          throw new BadRequestError([
            {
              message: `More than one column is primary`,
              code: `more-than-one-isPrimary-error|`
            }
          ])
        }
      }
    }

    if (primaryCount === 0) {
      throw new BadRequestError([
        {
          message: `At least one column should be primary`,
          code: `atleast-one-isPrimary-error|`
        }
      ])
    }
  }

  private checkPrimaryColumnDataType(indexColumns: IColumn[]) {
    for (const column of indexColumns) {
      if (column.isPrimary && !['INT', 'VARCHAR'].includes(column.dataType)) {
        throw new BadRequestError([
          {
            message: `Only INT and VARCHAR must be selected for Primary Column`,
            code: `dataType-isPrimary-error|${column.columnName}`
          }
        ])
      }
    }
  }

  private checkDefaultValueForPrimaryColumns(indexColumns: IColumn[]) {
    for (const column of indexColumns) {
      if (column.isPrimary && column.defaultValue) {
        throw new BadRequestError([
          {
            message: `Default Value not allowed for primary column`,
            code: `no-defaultvalue-isPrimary-error|${column.columnName}`
          }
        ])
      }
    }
  }

  private validatePrimaryColumns({ indexColumns }: { indexColumns: IColumn[] }) {
    this.checkOnePrimaryColumn(indexColumns)
    this.checkPrimaryColumnDataType(indexColumns)
    this.checkDefaultValueForPrimaryColumns(indexColumns)
  }

  // Check for derivedColumns onColumns field DataType
  // To match the dataType of onColumns field to be VARCHAR or CHAR when operation is CONCATENATE
  // To match the dataType of onColumns field to be NUMERIC or INT when operation is 'SUM', 'DIFF', 'PRODUCT', 'MOD', 'DIVIDE'
  // To check for MOD and DIVIDE(only one onColumns exist if onValue is null) else (only two columns are allowed)
  private validateDerivedColumnsOnColumnsDataType({ columnDef }: { columnDef: IColumnDef }): CustomErrorObject[] {
    const { indexColumns, regularColumns, derivedColumns } = columnDef
    const errors: CustomErrorObject[] = []

    const columnDataTypesMap = new Map()
    indexColumns.forEach((col) => {
      columnDataTypesMap.set(col.columnName, col.dataType)
    })
    regularColumns.forEach((col) => {
      columnDataTypesMap.set(col.columnName, col.dataType)
    })

    derivedColumns.forEach((column, derivedColIdx) => {
      // Call separate validation functions based on column.operation
      errors.push(
        ...this.validateConcatenateOperation(column, columnDataTypesMap, derivedColIdx),
        ...this.validateAgeOperation(column, columnDataTypesMap, derivedColIdx),
        ...this.validateModOperation(column, columnDataTypesMap, derivedColIdx),
        ...this.validateDivideOperation(column, columnDataTypesMap, derivedColIdx),
        ...this.validateSumOperation(column, columnDataTypesMap, derivedColIdx),
        ...this.validateDiffOperation(column, columnDataTypesMap, derivedColIdx),
        ...this.validateProductOperation(column, columnDataTypesMap, derivedColIdx)
        // Add more validation functions for other operations...
      )
    })

    return errors
  }

  private validateVersion({ dbVersion, receivedVersion }: { dbVersion: number; receivedVersion: number }) {
    if (+dbVersion !== +receivedVersion) {
      if (+dbVersion > +receivedVersion) {
        throw new BadRequestError([
          {
            message: 'The provided version is outdated compared to the current version.',
            code: 'data-profile-update-version-behind|'
          }
        ])
      } else {
        throw new BadRequestError([
          {
            message: 'The provided version is ahead of the current version.',
            code: 'data-profile-update-version-ahead|'
          }
        ])
      }
    }
    // Handle equality case if needed
  }

  private async checkTargetConnectionExists(target_connection_id: number): Promise<void> {
    const allDatabase = await connectionServiceController.getAllDatabase()
    const connExists = allDatabase?.some((item) => item.connectionId === Number(target_connection_id))

    if (!connExists) {
      throw new BadRequestError([{ message: 'Target Connection Not Found', code: 'target-connection-error' }])
    }
  }

  private async ifProfileIsAssociatedWithAPipeline({
    profile_id,
    profile_name
  }: {
    profile_id: number
    profile_name: string
  }): Promise<void> {
    const pipelineExists = await dataPipelineServiceController.checkIfProfileIsAssociatedWithPipeline(profile_id)

    if (pipelineExists?.dataPipelineId) {
      throw new BadRequestError([
        {
          message: `Unable to edit profile, profile ${profile_name} is associated with pipeline ${pipelineExists?.dataPipelineName}`,
          code: `profile-asscoiated-with-pipeline|${profile_name} : ${pipelineExists?.dataPipelineName}`
        }
      ])
    }
  }

  private async checkIfProfileIsEditable({
    profile_id,
    profile_name
  }: {
    profile_id: number
    profile_name: string
  }): Promise<void> {
    await this.ifProfileIsAssociatedWithAPipeline({
      profile_id,
      profile_name
    })
  }

  createDataProfile = catchAsyncError(async (req: Request, res: Response) => {
    const request_body = req.body as CreateDataProfileBody
    const { profile_name, table_name, profile_def, target_connection_id } = request_body as CreateDataProfileBody

    // Multiple Primary Columns not allowed
    this.validatePrimaryColumns({ indexColumns: profile_def.columnDef.indexColumns })

    // Same column names not allowed
    const duplicateColumnNamesError = this.checkDuplicateColumnNames({ columnDef: profile_def.columnDef })
    if (duplicateColumnNamesError.length > 0) {
      throw new BadRequestError(duplicateColumnNamesError)
    }

    // References property only allowed for CHAR and VARCHAR
    const referencesError = this.validateReferencesProperty({ columnDef: profile_def.columnDef })
    if (referencesError.length > 0) {
      throw new BadRequestError(referencesError)
    }

    // Only 4 onColumns property allowed in derivedColumns
    const validateDerivedColumnOnColumnsCountError = this.validateDerivedColumnOnColumnsCount({
      derivedColumns: profile_def.columnDef.derivedColumns
    })
    if (validateDerivedColumnOnColumnsCountError.length > 0) {
      throw new BadRequestError(validateDerivedColumnOnColumnsCountError)
    }

    // Check for derivedColumns having only those columnNames which are defined in either indexColumns ar regularColumns
    const validateDerivedColumnsOnColumnsError = this.validateDerivedColumnsOnColumnsNameIsValid({
      columnDef: profile_def.columnDef
    })
    if (validateDerivedColumnsOnColumnsError.length > 0) {
      throw new BadRequestError(validateDerivedColumnsOnColumnsError)
    }

    // Check for derivedColumns onColumns field DataType
    // To match the dataType of onColumns field to be VARCHAR or CHAR when operation is CONCATENATE
    // To match the dataType of onColumns field to be NUMERIC or INT when operation is 'SUM', 'DIFF', 'PRODUCT', 'MOD', 'DIVIDE'
    // To check for MOD and DIVIDE(only one onColumns exist if onValue is null) else (only two columns are allowed)

    const validateDerivedColumnsOnColumnsDataTypeError = this.validateDerivedColumnsOnColumnsDataType({
      columnDef: profile_def.columnDef
    })
    if (validateDerivedColumnsOnColumnsDataTypeError.length > 0) {
      throw new BadRequestError(validateDerivedColumnsOnColumnsDataTypeError)
    }

    const validateMaxAllowedChars = this.checkMaxAllowedChars({
      columnDef: profile_def.columnDef
    })
    if (validateMaxAllowedChars.length > 0) {
      throw new BadRequestError(validateMaxAllowedChars)
    }

    const queryResults = await this.dataProfileService.checkIfDPAlreadyExists({ profile_name, table_name })

    if (queryResults.length != 0) {
      throw new BadRequestError([
        {
          message: `Data Profile already exists ${profile_name}-${table_name}`,
          code: `data-profile.duplicate|${profile_name}-${table_name}`
        }
      ])
    }
    await this.checkTargetConnectionExists(target_connection_id)

    const created_by = (req.kauth?.grant as KeycloakParsedAccessTokenWithGrant).access_token.content.name
    const created_at = new Date().toISOString() // Assign created_at

    // Create the modified request_body with additional properties
    const modified_request_body: CreateDataProfileBody & {
      created_by: string
      created_at: string
    } = {
      ...request_body,
      created_by,
      created_at
    }

    const createQueryRes = await this.dataProfileService.createDP({
      profile: modified_request_body
    })

    const dataProfile_runHistoryDetails = await dataProfileRunHistoryService.dataProfile_AddRunHistory({
      profile_id: createQueryRes[0].profile_id,
      target_connection_id
    })

    // Send Message to RabbitMQ Data Catalog Exchange Event
    const msg: RabbitMQDataCatalogEvent_DataProfileCreated = {
      catalogExecutionId: dataProfile_runHistoryDetails[0].catalog_execution_id,
      connectionId: dataProfile_runHistoryDetails[0].target_connection_id,
      eventId: dataProfile_runHistoryDetails[0].event_id,
      eventRequest: 'CREATE TABLE',
      eventTime: dataProfile_runHistoryDetails[0].execution_start_time,
      profileId: dataProfile_runHistoryDetails[0].data_profile_id
    }
    sendMessageToDataCatalogExchange_RabbitMQ(msg)

    appCache.clear()

    res.status(200).json({
      data: createQueryRes
    })
  })

  getAllDataProfile = catchAsyncError(async (req: Request, res: Response) => {
    const { search_term, page, limit, sort_by } = req.query as {
      search_term: string
      page: string
      limit: string
      sort_by: string
    }
    const redisFiltersKey = JSON.stringify({ search_term, limit, page, sort_by } || '')
    const cachedData = appCache.getItem(`all-data-profile-${redisFiltersKey}`)

    if (cachedData) {
      res.set('X-Cached-Result', 'true')
      res.status(200).json(cachedData)
      return
    }

    const queryResults = await this.dataProfileService.getAllDP({
      searchTerm: search_term,
      limit: +limit || null,
      page: +page || null,
      sort_by
    })
    const totalCount = await this.dataProfileService.getAllDPCount(search_term)
    const pagination = constructPagesObject(+totalCount?.[0].count, +page, +limit)

    const result = {
      data: queryResults,
      pagination
    }

    appCache.setItem(`all-data-profile-${redisFiltersKey}`, result, {
      expirationSliding: CAHCE_TIMEOUT, // In seconds
      priority: CachePriority.Normal // Set priority if needed
    })
    res.set('X-Cached-Result', 'false')
    res.status(200).json(result)
  })

  getDataProfileDetails = catchAsyncError(async (req: Request, res: Response) => {
    const { profile_id } = req.params
    const redisFiltersKey = profile_id
    const cachedData = appCache.getItem(`data-profile-${redisFiltersKey}`)

    if (cachedData) {
      res.set('X-Cached-Result', 'true')
      res.status(200).json({
        data: cachedData
      })
      return
    }

    const queryResults = await this.dataProfileService.getDPByID({ profile_id })

    if (queryResults.length === 0) {
      throw new NotFoundError([{ message: 'Profile Details Not Found', code: 'profile-not-found|' }])
    }

    appCache.setItem(`data-profile-${redisFiltersKey}`, queryResults, {
      expirationSliding: CAHCE_TIMEOUT,
      priority: CachePriority.Normal
    })

    res.set('X-Cached-Result', 'false')
    res.status(200).json({
      data: queryResults
    })
  })

  deleteDataProfile = catchAsyncError(async (req: Request, res: Response) => {
    const { profile_id } = req.params

    const queryResults = await this.dataProfileService.getDPByID({ profile_id })

    if (queryResults.length === 0) {
      throw new NotFoundError([{ message: 'Profile Details Not Found', code: 'profile-not-found|' }])
    }

    await this.dataProfileService.deleteDPByID({ profile_id })

    appCache.clearItem(`data-profile-${JSON.stringify(profile_id)}`)
    appCache.clearStartingWith(`all-data-profile-`)

    res.status(204).json()
  })

  updateLastSyncTime = catchAsyncError(async (req: Request, res: Response) => {
    const { profile_id, last_sync_time } = req.body as {
      profile_id: string
      last_sync_time: string
    }

    const queryResults = await this.dataProfileService.getDPByID({ profile_id })

    if (queryResults.length === 0) {
      throw new NotFoundError([{ message: 'Profile Details Not Found', code: 'profile-not-found|' }])
    }

    const updateQueryResults = await this.dataProfileService.updateLastSyncTime({
      profile_id,
      last_sync_time
    })

    if (updateQueryResults.length === 0) {
      throw new BadRequestError([
        {
          message: 'The profile is being modified. Try again later',
          code: 'data-profile-modification-in-progress|'
        }
      ])
    }

    const updatedProfileDetails = await this.dataProfileService.getDPByID({ profile_id })

    appCache.clearItem(`data-profile-${profile_id}`)
    appCache.clearStartingWith(`all-data-profile-`)
    appCache.setItem(`data-profile-${profile_id}`, updatedProfileDetails, {
      expirationSliding: CAHCE_TIMEOUT,
      priority: CachePriority.Normal
    })

    res.status(200).json({
      data: updateQueryResults
    })
  })

  updateDataProfile = catchAsyncError(async (req: Request, res: Response) => {
    const { profile_id, profile_def, profile_name, version: receivedVersion } = req.body as UpdateDataProfileBody

    const profileDetails = await this.dataProfileService.getDPByID({ profile_id: profile_id.toString() })

    if (profileDetails.length === 0) {
      throw new NotFoundError([{ message: 'Profile Details Not Found', code: 'profile-not-found|' }])
    }

    await this.checkIfProfileIsEditable({ profile_id, profile_name })

    this.validatePrimaryColumns({ indexColumns: profile_def.columnDef.indexColumns })

    // Same column names not allowed
    const duplicateColumnNamesError = this.checkDuplicateColumnNames({ columnDef: profile_def.columnDef })
    if (duplicateColumnNamesError.length > 0) {
      throw new BadRequestError(duplicateColumnNamesError)
    }

    // References property only allowed for CHAR and VARCHAR
    const referencesError = this.validateReferencesProperty({ columnDef: profile_def.columnDef })
    if (referencesError.length > 0) {
      throw new BadRequestError(referencesError)
    }

    // Only 4 onColumns property allowed in derivedColumns
    const validateDerivedColumnOnColumnsCountError = this.validateDerivedColumnOnColumnsCount({
      derivedColumns: profile_def.columnDef.derivedColumns
    })
    if (validateDerivedColumnOnColumnsCountError.length > 0) {
      throw new BadRequestError(validateDerivedColumnOnColumnsCountError)
    }

    // Check for derivedColumns having only those columnNames which are defined in either indexColumns ar regularColumns
    const validateDerivedColumnsOnColumnsError = this.validateDerivedColumnsOnColumnsNameIsValid({
      columnDef: profile_def.columnDef
    })
    if (validateDerivedColumnsOnColumnsError.length > 0) {
      throw new BadRequestError(validateDerivedColumnsOnColumnsError)
    }

    // Check for derivedColumns onColumns field DataType
    // To match the dataType of onColumns field to be VARCHAR or CHAR when operation is CONCATENATE
    // To match the dataType of onColumns field to be NUMERIC or INT when operation is 'SUM', 'DIFF', 'PRODUCT', 'MOD', 'DIVIDE'
    // To check for MOD and DIVIDE(only one onColumns exist if onValue is null) else (only two columns are allowed)

    const validateDerivedColumnsOnColumnsDataTypeError = this.validateDerivedColumnsOnColumnsDataType({
      columnDef: profile_def.columnDef
    })
    if (validateDerivedColumnsOnColumnsDataTypeError.length > 0) {
      throw new BadRequestError(validateDerivedColumnsOnColumnsDataTypeError)
    }

    const validateMaxAllowedChars = this.checkMaxAllowedChars({
      columnDef: profile_def.columnDef
    })
    if (validateMaxAllowedChars.length > 0) {
      throw new BadRequestError(validateMaxAllowedChars)
    }

    const profileExists = await this.dataProfileService.checkIfDPAlreadyExists({ profile_name })
    if (profileExists.length > 0 && profileExists[0].profile_id !== profile_id) {
      throw new BadRequestError([
        { message: 'Another profile already exists with the same name', code: 'profile-update-duplicate-error|' }
      ])
    }

    this.validateVersion({ dbVersion: profileDetails?.[0].version, receivedVersion })

    // TODO : remove when schema is not under profile_def
    const updatedProfileDef: IProfileDef = {
      schema: profileDetails?.[0]?.profile_def?.schema,
      columnDef: profile_def?.columnDef
    }

    const updatedProfileBody = profileDetails[0]
    updatedProfileBody.profile_name = profile_name
    // updatedProfileBody.profile_def = profile_def
    updatedProfileBody.profile_def = updatedProfileDef
    updatedProfileBody.updated_at = new Date().toISOString()
    updatedProfileBody.updated_by = (req.kauth?.grant as KeycloakParsedAccessTokenWithGrant).access_token.content.name

    const updateQueryRes = await this.dataProfileService.updateProfileDetails({
      profile: updatedProfileBody
    })

    const queryResults = await this.dataProfileService.getDPByID({ profile_id: profile_id.toString() })

    const dataProfile_runHistoryDetails = await dataProfileRunHistoryService.dataProfile_AddRunHistory({
      profile_id: updateQueryRes[0].profile_id,
      target_connection_id: queryResults?.[0]?.target_connection_id
    })

    await this.dataProfileService.updateProfileIs_Active({ profile_id: profile_id.toString(), status: false })

    const msg: RabbitMQDataCatalogEvent_DataProfileCreated = {
      catalogExecutionId: dataProfile_runHistoryDetails[0].catalog_execution_id,
      connectionId: dataProfile_runHistoryDetails[0].target_connection_id,
      eventId: dataProfile_runHistoryDetails[0].event_id,
      eventRequest: 'ALTER TABLE',
      eventTime: dataProfile_runHistoryDetails[0].execution_start_time,
      profileId: dataProfile_runHistoryDetails[0].data_profile_id
    }
    sendMessageToDataCatalogExchange_RabbitMQ(msg)

    appCache.clearStartingWith(`all-data-profile-`)
    appCache.clearItem(`data-profile-${profile_id}`)
    appCache.setItem(`data-profile-${profile_id}`, queryResults, {
      expirationSliding: CAHCE_TIMEOUT,
      priority: CachePriority.Normal
    })

    res.status(200).json({ data: updateQueryRes })
  })
}

const controller = new DataProfileController() // Created an instance outside the class

export default controller
