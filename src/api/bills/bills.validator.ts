import joi from '@hapi/joi';

export const airtimeSchema = joi.object({
  mobileNumber: joi.string().required(),
  debitAccountNumber: joi.string().allow('').required(),
  pin: joi.string().required(),
  channel: joi.string().required(),
  serviceID: joi.string().required(),
  amount: joi.number().required(),
  phone: joi.number().required(),
  narration: joi.string().max(50),
  bill: joi.string().valid("airtime").required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  prod: joi.boolean()
});

export const billSchema = joi.object({
  debitAccountNumber: joi.string().allow('').required(),
  mobileNumber: joi.string().required(),
  pin: joi.string().required(),
  channel: joi.string().valid("web", "mobile").required(),
  serviceID: joi.string().required(),
  amount: joi.number().required(),
  phone: joi.number().required(),
  billersCode: joi.string().required(),
  variationCode: joi.string().required(),
  narration: joi.string().max(50),
  bill: joi.string().valid("airtime", "data", "waec-registration", "waec-result", "electricity", "cableTV").required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  prod: joi.boolean()
});

export const verifyCableTvSchema = joi.object({
  serviceID: joi.string().required(),
  billersCode: joi.string().required(),
  narration: joi.string().max(50)
});

export const commissionSchema = joi.object({
  serviceId: joi.string().required(),
  type: joi.string().required(),
  commission: joi.number().required()
});

export const querySchema = joi.object({
  requestId: joi.string().required()
});

export const serviceIDSchema = joi.object({
  serviceID: joi.string().required()
});

export const verifyMeterSchema = joi.object({
  billersCode: joi.string().required(),
  serviceID: joi.string().required(),
  type: joi.string().required(),
});

export const insuranceSchema = joi.object({
  debitAccountNumber: joi.string().allow('').required(),
  mobileNumber: joi.string().length(11).required(),
  pin: joi.string().length(4).required(),
  channel: joi.string().required(),
  serviceID: joi.string().required(),
  billersCode: joi.string().required(),
  variationCode: joi.string().required(),
  amount: joi.string().required(),
  phone: joi.string().length(11).required(),
  insuredName: joi.string().required(),
  engineNumber: joi.string().required(),
  chasisNumber: joi.string().required(),
  plateNumber: joi.string().required(),
  vehicleMake: joi.string().required(),
  vehicleColor: joi.string().required(),
  vehicleModel: joi.string().required(),
  yearOfMake: joi.string().required(),
  contactAddress: joi.string().required(),
  bill: joi.string().valid("insurance").required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  prod: joi.boolean()
});
