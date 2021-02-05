import joi from "@hapi/joi";


export const addBeneficiarySchema = joi.object({
  beneficiaryName: joi.string().required(),
  accountNumber: joi.string().length(10).required(),
  userId: joi.string().required(),
  accountBank: joi.string().required(),
  isAccount: joi.boolean().required(),
  pin: joi.string().required(),
  bank: joi.string().required()
});

export const getBeneficiarySchema = joi.object({
  userId: joi.string().required(),
  isAccount: joi.boolean().required(),
});

export const removeBeneficiarySchema = joi.object({
  userId: joi.string().required(),
  beneficiaryId: joi.string().required(),
  pin: joi.string().length(4).required()
});
