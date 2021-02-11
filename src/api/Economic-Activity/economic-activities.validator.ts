import joi from '@hapi/joi';


export const activitySchema = joi.object({
  economicActivity: joi.string().required(),
  rankOfSales: joi.string().required(),
  grossMarginLimits: joi.object().required(),
  netMarginLimits: joi.object().required(),
  householdExpenseRatioLimits: joi.object().required()
})
