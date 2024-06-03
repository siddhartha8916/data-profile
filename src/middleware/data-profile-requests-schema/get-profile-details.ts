import Joi from 'joi'

export const getProfileDetailsParamsSchema = Joi.object({
  profile_id: Joi.number().required(),
  last_sync_time: Joi.date().iso().required()
}).required()

export const deleteProfileParamsSchema = Joi.object({
  profile_id: Joi.number().required()
}).required()
