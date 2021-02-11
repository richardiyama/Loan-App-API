// /* eslint-disable import/prefer-default-export */
import joi from '@hapi/joi';

// || || () () | PROVIDER SECTION  | () () || || \\ START

export const amountSchema = joi.object({
  amount: joi.number().required()
});

export const transferWalletSchema = joi.object({
  amount: joi.number().invalid(0).required(),
  sender: joi.string().required(),
  beneficiary: joi.string().required(),
  narration: joi.string().required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  channel: joi.string().valid("web", "mobile").required()
});


export const createRecipientSchema = joi.object({
  recipientName: joi.string().required(),
  bankCode: joi.string().required(),
  accountNumber: joi.string().required(),
});

export const walletToBankTransfer = joi.object({
  amount: joi.number().required(),
  narration: joi.string().max(50).allow(""),
  accountNumber: joi.string().length(10).required(),
  accountBank: joi.string().required(),
  pin: joi.string().length(4).required(),
  beneficiaryName: joi.string().required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  channel: joi.string().valid("web", "mobile").required()
});

export const transferToWalletSchema = joi.object({
  mobileNumber: joi.string().required(),
  amount: joi.number().min(0).required(),
  narration: joi.string().max(50),
  accountNumber: joi.string().length(10).required(),
  accountBank: joi.string().required(),
  pin: joi.string().length(4).required(),
  beneficiaryName: joi.string().required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  channel: joi.string().valid("web", "mobile").required(),
  api: joi.string().required()
});

export const transferToAccion = joi.object({
  beneficiaryName: joi.string().required(),
  amount: joi.number().required(),
  creditAccount: joi.string().required(),
  narration: joi.string().allow(""),
  mobileNumber: joi.string().required(),
  pin: joi.string().required(),
  channel: joi.string().required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  api: joi.string().required(),
  fee: joi.number().min(0).required(),
  customerAmount: joi.number().min(10).required(),
  prod: joi.boolean()
})

export const paystackTransferSchema = joi.object({
  userId: joi.string().required(),
  amount: joi.number().min(0).required(),
  narration: joi.string().max(50),
  accountNumber: joi.string().length(10).required(),
  bankCode: joi.string().required(),
  pin: joi.string().length(4).required(),
  beneficiaryName: joi.string().required(),
  product: joi.string().valid("airtime", "bill", "transfer").required(),
  channel: joi.string().valid("web", "mobile").required(),
  api: joi.string().required(),
  fee: joi.number().min(0).required(),
  customerAmount: joi.number().min(100).required()
});

export const verifyAccountSchema = joi.object({
  accountNumber: joi.string().required(),
  accountBank: joi.string().required()
});

export const withdrawlWalletSchema = joi.object({
  username: joi.string().required(),
  amount: joi.number().invalid(0).required(),
  bankCode: joi.string().required(),
  accountNumber: joi.string().required(),
  beneficiary: joi.string().required(),
  narration: joi.string().required(),
  currency: joi.any().valid('NGN').required(),
});

export const approveFundWalletSchema = joi.object({
  username: joi.string().required(),
  reference: joi.string().required(),
  paymentGateway: joi.string().required(),
});

export const requestPayoutSchema = joi.object({
  username: joi.string().required(),
  amount: joi.number().required(),
  beneficiary: joi.object({
    bankCode: joi.string().required(),
    accountNumber: joi.string().required(),
    bankName: joi.string().required(),
    accountName: joi.string().required(),
  }),
  narration: joi.string(),
  channel: joi.string(),
});

export const decidePayoutRequestSchema = joi.object({
  reference: joi.string().required(),
  action: joi.string().valid('APPROVE', 'DECLINE').required(),
  comment: joi.string(),
});

// || || () () | TRANSFER SECTION  | () () || || \\ END
