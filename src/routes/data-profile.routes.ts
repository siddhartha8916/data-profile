import express from 'express'
import {
  validateDataProfileCreateRequestBody,
  validateProfileParams,
  validateGetAllDataProfileQueryParams,
  validateUpdateLastSyncTimeBody,
  validateDataProfileUpdateRequestBody
} from '../middleware/validate-request'
import DataProfileController from '../controllers/data-profile.controller'
import { validateIsBodyEmpty } from '../middleware/validate-empty-body'
import { validateIsQueryEmpty } from '../middleware/validate-empty-query'
import { validateIsParamsEmpty } from '../middleware/validate-empty-params'

const dataProfileRoutes = express.Router()

dataProfileRoutes.post(
  '/',
  validateIsParamsEmpty,
  validateIsQueryEmpty,
  validateDataProfileCreateRequestBody,
  DataProfileController.createDataProfile
)

dataProfileRoutes.get(
  '/',
  validateIsBodyEmpty,
  validateGetAllDataProfileQueryParams,
  DataProfileController.getAllDataProfile
)

dataProfileRoutes.put(
  '/',
  validateIsQueryEmpty,
  validateDataProfileUpdateRequestBody,
  DataProfileController.updateDataProfile
)

dataProfileRoutes.get(
  '/:profile_id',
  validateIsBodyEmpty,
  validateIsQueryEmpty,
  validateProfileParams,
  DataProfileController.getDataProfileDetails
)

dataProfileRoutes.delete(
  '/:profile_id',
  validateIsBodyEmpty,
  validateIsQueryEmpty,
  validateProfileParams,
  DataProfileController.deleteDataProfile
)

dataProfileRoutes.put(
  '/update/last-sync-time',
  validateIsQueryEmpty,
  validateIsParamsEmpty,
  validateUpdateLastSyncTimeBody,
  DataProfileController.updateLastSyncTime
)

export default dataProfileRoutes
