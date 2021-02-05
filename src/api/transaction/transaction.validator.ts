import joi from '@hapi/joi';


export const getTransactionsSchema = joi.object({
  reference: joi.string(),
  amount: joi.number(),
  type: joi.string(),
  status: joi.string(),
  state: joi.string(),
  channel: joi.string(),
  product: joi.string().valid("airtime", "bill", "transfer"),
  debitAccount: joi.string()
});

export const dateRangeSchema = joi.object({
  startDate: joi.string(),
  endDate: joi.string(),
  userId: joi.string()
});


export const transRangeSchema = joi.object({
  startDate: joi.string().required(),
  endDate: joi.string().required(),
  type: joi.string(),
  channel: joi.string().allow(""),
  dayRange: joi.boolean()
});

export const transactionFilterSchema = joi.object({
  startDate: joi.string().allow(""),
  endDate: joi.string().allow(""),
  status: joi.string().allow(""),
  source: joi.string().allow(""),
  type: joi.string().allow(""),
  reference: joi.string().allow(""),
  customerName: joi.string().allow(""),
  accountNumber: joi.string().allow(""),
  minAmount: joi.number().allow(""),
  maxAmount: joi.number().allow("")
});

export const getTenantTransactionsSchema = joi.object({
  // mobile: joi.string().pattern(/^[+][\d]+/, { name: 'numbers' }),
  reference: joi.string(),
  amount: joi.number(),
  type: joi.string(),
});

export const getProviderTransactionsSchema = joi.object({
  reference: joi.string(),
  amount: joi.number(),
  type: joi.string(),
});

export const addTxnsRule = joi.object({
  tier: joi.number().required(),
  dailyComulativeLimit: joi.number().required(),
  maxCumulativeBalance: joi.number().required(),
  maxTransactionLimit: joi.number().required(),
  maxDailyLimit: joi.number().required()
});

export const addTransactionSchema = joi.object({
  mobile: joi.string().pattern(/^[+][\d]+/, { name: 'numbers' }),
  reference: joi.string(),
  amount: joi.number(),
  narration: joi.string(),
  currency: joi
    .any()
    .valid('NGN')
    .required(),
  sender: joi.any(),
  beneficiary: joi.any(),
  type: joi.string(),
  transactionData: joi.any(),
  provider: joi.string(),
  channel: joi.string(),
});
