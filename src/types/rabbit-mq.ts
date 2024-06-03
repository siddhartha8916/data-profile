export interface RabbitMQDataCatalogReceivedEvent {
  eventId: string
  eventTime: string
  targetConnectionId: string
  profileId: string
  catalogExecutionId: number
  message: string
  eventResponse: 'CREATE TABLE SUCCESS' | 'CREATE TABLE FAILURE' | 'ALTER TABLE SUCCESS' | 'ALTER TABLE FAILURE'
}

export interface RabbitMQDataCatalogSuccessEvent {
  eventId: string
  eventTime: string
  srcConnectionId: string
  targetConnectionId: string
  profileId: string
  dataPipelineId: string
  dataPipelineRunId: number
  eventResponse: string
  filepath: string
  message: string
}

export interface RabbitMQDataCatalogErrorEvent extends RabbitMQDataCatalogSuccessEvent {}

export interface RabbitMQDataCatalogEvent_DataProfileCreated {
  eventId: string
  eventTime: string
  connectionId: string
  profileId: string
  catalogExecutionId: string
  eventRequest: string
}

export interface DataProfile_RunHistory {
  catalog_execution_id: string
  event_id: string
  data_profile_id: string
  target_connection_id: string
  execution_start_time: string
  execution_end_time: string
  status: string
  error_message: string
}

export interface I_RabbitMQDataProfileUpdate_Event {
  eventId: string
  eventTime: string
  eventResponse: string
  profileId: string
}
