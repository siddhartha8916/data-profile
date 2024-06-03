import Joi from 'joi'
import {
  allowedDataTypes,
  allowedOperations,
  disallowedCharsRegexWithSpace,
  disallowedCharsRegexWithoutSpace
} from '../../config/constants'

// Define Joi schema for validation
export const dataProfileUpdateBodySchema = Joi.object({
  profile_id: Joi.number().required(),
  profile_name: Joi.string().required().regex(disallowedCharsRegexWithoutSpace, { invert: true }),
  profile_def: Joi.object({
    columnDef: Joi.object({
      indexColumns: Joi.array()
        .items(
          Joi.object({
            notNull: Joi.boolean().required(),
            regex: Joi.string().allow(null),
            dataType: Joi.string()
              .valid(...allowedDataTypes)
              .required(),
            isPrimary: Joi.boolean().required(),
            columnName: Joi.string().required().regex(disallowedCharsRegexWithSpace, { invert: true }),
            references: Joi.object({
              tableName: Joi.string().required().regex(disallowedCharsRegexWithSpace, { invert: true }),
              columnName: Joi.string().required().regex(disallowedCharsRegexWithSpace, { invert: true })
            }).allow(null),
            defaultValue: Joi.any()
              .when('dataType', {
                is: 'INT',
                then: Joi.number().required()
              })
              .when('dataType', {
                is: 'VARCHAR',
                then: Joi.string().required()
              })
              .when('dataType', {
                is: 'TIMESTAMP',
                then: Joi.date().iso().required()
              })
              .when('dataType', {
                is: 'TIMESTAMP_TZ',
                then: Joi.date().iso().required()
              })
              .when('dataType', {
                is: 'DATE',
                then: Joi.date().iso().required()
              })
              .when('dataType', {
                is: 'NUMERIC',
                then: Joi.number().precision(10).required()
              })
              .when('dataType', {
                is: 'BOOLEAN',
                then: Joi.boolean().required()
              })
              .when('dataType', {
                is: 'CHAR',
                then: Joi.string().length(1).required()
              })
              .allow(null),
            maxAllowedChars: Joi.number()
              .when('dataType', {
                is: 'CHAR',
                then: Joi.number().max(1).allow(null).required()
              })
              .when('dataType', {
                is: 'VARCHAR',
                then: Joi.number().required(),
                otherwise: Joi.number().min(1).allow(null).required()
              })
              .messages({ 'number.base': 'maxAllowedChars must be defined' })
              .required()
          })
        )
        .min(1)
        .max(4)
        .required(),
      regularColumns: Joi.array()
        .items(
          Joi.object({
            notNull: Joi.boolean().required(),
            dataType: Joi.string()

              .valid(...allowedDataTypes)
              .required(),
            regex: Joi.string().allow(null),
            isUnique: Joi.boolean().required(),
            columnName: Joi.string().required().regex(disallowedCharsRegexWithSpace, { invert: true }),
            references: Joi.object({
              tableName: Joi.string().required().regex(disallowedCharsRegexWithSpace, { invert: true }),
              columnName: Joi.string().required().regex(disallowedCharsRegexWithSpace, { invert: true })
            }).allow(null),
            defaultValue: Joi.any()
              .when('dataType', {
                is: 'INT',
                then: Joi.number().required()
              })
              .when('dataType', {
                is: 'VARCHAR',
                then: Joi.string().required()
              })
              .when('dataType', {
                is: 'TIMESTAMP',
                then: Joi.date().iso().required()
              })
              .when('dataType', {
                is: 'TIMESTAMP_TZ',
                then: Joi.date().iso().required()
              })
              .when('dataType', {
                is: 'DATE',
                then: Joi.date().iso().required()
              })
              .when('dataType', {
                is: 'NUMERIC',
                then: Joi.number().precision(10).required()
              })
              .when('dataType', {
                is: 'BOOLEAN',
                then: Joi.boolean().required()
              })
              .when('dataType', {
                is: 'CHAR',
                then: Joi.string().length(1).required()
              })
              .allow(null),
            maxAllowedChars: Joi.number()
              .when('dataType', {
                is: 'CHAR',
                then: Joi.number().max(1).allow(null).required()
              })
              .when('dataType', {
                is: 'VARCHAR',
                then: Joi.number().required(),
                otherwise: Joi.number().min(1).allow(null).required()
              })
              .messages({ 'number.base': 'maxAllowedChars must be defined' })
              .required()
          })
        )
        .min(0)
        .required(),
      derivedColumns: Joi.array()
        .items(
          Joi.object({
            notNull: Joi.boolean().required(),
            dataType: Joi.string()
              .valid(...allowedDataTypes)
              .required(),
            columnName: Joi.string().required().regex(disallowedCharsRegexWithSpace, { invert: true }),
            maxAllowedChars: Joi.number()
              .when('dataType', {
                is: 'CHAR',
                then: Joi.number().max(1).allow(null).required()
              })
              .when('dataType', {
                is: 'VARCHAR',
                then: Joi.number().required(),
                otherwise: Joi.number().min(1).allow(null).required()
              })
              .messages({ 'number.base': 'maxAllowedChars must be defined' })
              .required(),
            operation: Joi.string()
              .valid(...allowedOperations)
              .required(),
            onValue: Joi.alternatives()
              .conditional('operation', {
                is: 'CONCATENATE',
                then: Joi.string().required(),
                otherwise: Joi.number().required()
              })
              .allow(null),
            onColumns: Joi.array().items(Joi.string()).min(1).required()
          })
        )
        .min(0)
        .required()
    }).required()
  }).required(),
  version: Joi.number().required()
})
