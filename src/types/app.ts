export type QueryType = {
  [key: string]: string | number | boolean
}

export type TPages = {
  itemCount: number
  offset: number
  perPage: number
  page: number
  next: number | null
  prev: number | null
  hasNextPage: boolean
  hasPrevPage: boolean
  pageCount: number
}

export interface CustomErrorObject {
  message: string
  code: string
}

export interface IDatabaseConnectionError {
  errno: number
  code: string
  syscall: string
  address: string
  port: number
}

export interface IColumn {
  columnId: number
  columnName: string
  references?: string
  dataType: string
  notNull: boolean
  maxAllowedChars: number | null
  defaultValue: string | null
  isPrimary?: boolean
  operation?: string
  onValue?: string | number | null
  onColumns?: string[]
}

export interface IColumnDef {
  indexColumns: IColumn[]
  regularColumns: IColumn[]
  derivedColumns: IColumn[]
}

export interface IProfileDef {
  schema: string
  columnDef: IColumnDef
}

export interface IDataProfile {
  profile_id: number
  schema: string
  profile_name: string
  table_name: string
  created_by: string
  last_sync_time: string
  updated_by: string
  created_at: string
  updated_at: string
  version: number
  target_connection_id: number
  has_validation_error: boolean
  profile_def: IProfileDef
}

export type CreateDataProfileBody = Omit<
  IDataProfile,
  'profile_id' | 'created_by' | 'last_sync_time' | 'updated_by' | 'created_at' | 'updated_at'
>

export type UpdateDataProfileBody = Omit<
  IDataProfile,
  'created_by' | 'last_sync_time' | 'updated_by' | 'created_at' | 'updated_at' | 'table_name'
>

export interface MockCreateDataProfileProps {
  profile_name?: string
  table_name?: string
  profile_def?: {
    schema?: string
    columnDef?: {
      indexColumns?: {
        notNull?: boolean
        columnId?: number
        dataType?: string
        isPrimary?: boolean
        columnName?: string
        defaultValue?: string | null | string[]
        maxAllowedChars?: number | null
      }[]
      derivedColumns?: {
        notNull?: boolean
        columnId?: number
        dataType?: string
        isUnique?: boolean
        columnName?: string
        defaultValue?: number | null
        maxAllowedChars?: number | null
        operation?: string
        onValue?: string
      }[]
      regularColumns?: {
        notNull?: boolean
        columnId?: number
        dataType?: string
        isUnique?: boolean
        columnName?: string
        defaultValue?: number | null
        maxAllowedChars?: number | null
      }[]
    }
  }
}
