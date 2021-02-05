
import joi from '@hapi/joi';


export class WalletValidator {
  public deleteCardSchema = joi.object({
    provider: joi.string().required(),
    reference: joi.string().required(),
    type: joi.string().required(),
    amount: joi.number().required(),
    source: joi.string().required(),
    destination: joi.string().required(),
    state: joi.string().required(),
    narration: joi.string().required(),
    channel: joi.string().required(),
    sender: joi.any(),
    beneficiary: joi.any(),
    balance: {
      before: joi.number().required(),
      after: joi.number().required()
    },
    transactionData: joi.any(),
    isCredit: joi.boolean().required()
  });


  public fundByAccountSchema = joi.object({
    accountNumber: joi.string().length(10).required(),
    accountBank: joi.string().length(3).required(),
    amount: joi.number().required(),
    email: joi.string().email().required(),
    dob: joi.string()
  });

  public validateChargeSchema = joi.object({
    otp: joi.string().required(),
    flwRef: joi.string().required(),
    userId: joi.string().required(),
    channel: joi.string().required()
  });

  public fundWalletSchema = joi.object({
    amount: joi.string().required(),
    channel: joi.string().required(),
    cardId: joi.string().required(),
    pin: joi.string().length(4).required()
  });

  public validateAccountNumber = joi.object({
    accountNumber: joi.string().length(10).required()
  });

  public validateaccountReference = joi.object({
    accountReference: joi.string().required()
  });

  public userIdSchema = joi.object({
    userId: joi.string().required()
  });

  public reserveAccountSchema = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    customerEmail: joi.string().email().required(),
    bvn: joi.string().allow(""),
  });
}

