import * as express from 'express';
import { AccountController } from './account.controller';
import { inputValidator, isAuthenticated } from '../../util/middleware';
import { AccountValidator } from './account.validator';



export const accountRouter = express.Router();

// @desc        Route to open an account
// @route       POST /api/v1/accounts/openAccount
// @access      Public
accountRouter.post(
  '/openAccount',
  inputValidator({ body: new AccountValidator().openAccountSchema }),
  new AccountController().openAccount
);

// @desc        Route to upgrade wallet to account
// @route       POST /api/v1/accounts/walletToAccountUpgrade
// @access      Public
accountRouter.post(
  '/walletToAccountUpgrade',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().walletToAccountUpgrade }),
  new AccountController().walletToAccountUpgrade
);

// accountRouter.post(
//   '/rewardReferral',
//   new AccountController().rewardReferral
// );

accountRouter.post(
  '/rewards',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().userRewardSchema }),
  new AccountController().userRewards
);

accountRouter.post(
  '/createSaveBrigtha',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().createSaveBrigthaSchema }),
  new AccountController().createSaveBrigtha
);

accountRouter.post(
  '/admin/rewards',
  inputValidator({ body: new AccountValidator().adminRewardsSchema }),
  new AccountController().getAllRewards
);

// @desc        Route to get banks
// @route       POST /api/v1/accounts/getBanks
// @access      Public
accountRouter.get(
  '/getBanks',
  new AccountController().getBanks
);

// @desc        Route to save an existing account
// @route       POST /api/v1/accounts/existingAccount
// @access      Public
accountRouter.post(
  '/existingAccount',
  inputValidator({ body: new AccountValidator().existingAccountSchema }),
  new AccountController().openAccount
);


// @desc        Route to upgrade account
// @route       POST /api/v1/accounts/upgrade
// @access      Public
accountRouter.post(
  '/upgrade',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().accountUpgradeSchema }),
  new AccountController().accountUpgrade
);

// @desc        Route to check account balance
// @route       GET /api/v1/accounts/checkBalance
// @access      Public
accountRouter.get(
  '/checkBalance',
  inputValidator({ query: new AccountValidator().accNumberSchema }),
  new AccountController().checkAccountBalance
);

// // @desc        Route to transfer funds
// // @route       GET /api/v1/accounts/fundTransfer
// // @access      Public

accountRouter.post(
  '/fundTransfer',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().transferSchema }),
  new AccountController().fundTransfer
);

// // @desc        Route to get customer details
// // @route       GET /api/v1/accounts/customerDetails
// // @access      Public
accountRouter.get(
  '/customerDetails',
  inputValidator({ query: new AccountValidator().accNumberSchema }),
  new AccountController().customerDetails
);

// @desc        Route to get customer details
// @route       GET /api/v1/accounts/accountDetails
// @access      Public
accountRouter.get(
  '/accountDetails',
  inputValidator({ query: new AccountValidator().accNumberSchema }),
  new AccountController().accountDetails
);

// @desc        Route to make NIP
// @route       POST /api/v1/accounts/nip
// @access      Public
accountRouter.post(
  '/nip',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().nipTransferSchema }),
  new AccountController().nip
);

// @desc        Route to fetch NIP fee
// @route       POST /api/v1/accounts/nipFees
// @access      Public
accountRouter.post(
  '/nipFees',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().feeSchema }),
  new AccountController().nipFee
);


// @desc        Route to phoneName
// @route       POST /api/v1/accounts/nipFees
// @access      Public
accountRouter.post(
  '/detailsByPhoneName',
  isAuthenticated,
  inputValidator({ body: new AccountValidator().phoneName }),
  new AccountController().listAccountByPhoneName
);

// @desc        Route to list user accounts
// @route       GET /api/v1/accounts/list
// @access      Public
accountRouter.get(
  '/list',
  inputValidator({ query: new AccountValidator().accNumberSchema }),
  new AccountController().accountList
);

// @desc        Route to generate mini statement
// @route       GET /api/v1/accounts/list
// @access      Public
accountRouter.get(
  '/ministatement',
  inputValidator({ query: new AccountValidator().accNumberSchema }),
  new AccountController().miniStatement
);

// @desc        Route to send sms
// @route       GET /api/v1/accounts/sendSMS
// @access      Public
accountRouter.post(
  '/sendSMS',
  inputValidator({ body: new AccountValidator().smsSchema }),
  new AccountController().sendSMS
);

// @desc        Route to name enquiry
// @route       GET /api/v1/accounts/nameEnquiry
// @access      Public
accountRouter.post(
  '/nameEnquiry',
  inputValidator({ body: new AccountValidator().nameEnquirySchema }),
  new AccountController().nameEnquiry
);

// @desc        Route to verify transaction (This only applies to bill payment and airtime purchase)
// @route       GET /api/v1/accounts/verifyTransaction
// @access      Public
accountRouter.post(
  '/verifyTransaction',
  inputValidator({ body: new AccountValidator().verifyTransSchema }),
  new AccountController().verifyTransaction
);

accountRouter.post(
  '/transactionHistory',
  inputValidator({ body: new AccountValidator().transactionHistorySchema }),
  new AccountController().transactionHistory
);

accountRouter.get(
  '/securityQuestions',
  new AccountController().securityQuestions
);

accountRouter.get(
  '/customer/detailsByMobile',
  inputValidator({ query: new AccountValidator().mobileNumberSchema }),
  new AccountController().customerDetailsByMobile
);

accountRouter.get(
  '/detailsByMobile',
  inputValidator({ query: new AccountValidator().mobileNumberSchema }),
  new AccountController().customerAccountsByMobile
);
