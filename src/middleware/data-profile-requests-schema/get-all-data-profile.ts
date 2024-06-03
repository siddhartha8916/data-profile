import Joi from 'joi'

export const getAllDataProfileQueryParamsSchema = Joi.object({
  search_term: Joi.string().optional(),
  limit: Joi.number().required().optional(),
  page: Joi.number().required().optional(),
  sort_by: Joi.string()
    .regex(/\{"column":"[A-Za-z]+_[A-Za-z]+","order":"(?:asc|desc)"\}/)
    .optional()
})
