/* eslint-disable import/first */
// /* eslint-disable import/prefer-default-export */

import express from 'express';


import {
  verifyAccountSchema,
  amountSchema,
  transferToWalletSchema,
  walletToBankTransfer
} from './finance.validator';

import { inputValidator, isAuthenticated } from '../../util/middleware';
import { FinanceController } from './finance.controller';
import { createRecipientSchema, paystackTransferSchema, transferToAccion } from './finance.validator';

export const financeRouter = express.Router();

financeRouter.get('/', (_req, res) => {
  return res.status(200).json({
    message: 'welcome to finances api',
  });
});


financeRouter.post(
  '/wallet/transferBank',
  inputValidator({ body: walletToBankTransfer }),
  isAuthenticated,
  new FinanceController().walletToBankTransfer
);
financeRouter.post(
  '/wallet/transferWallet',
  inputValidator({ body: transferToWalletSchema }),
  isAuthenticated,
  new FinanceController().walletToWalletTransfer
);
financeRouter.post(
  '/wallet/verifyAccount',
  inputValidator({ body: verifyAccountSchema }),
  isAuthenticated,
  new FinanceController().verifyAccount
);
financeRouter.post(
  '/wallet/verifyAccountPS',
  inputValidator({ body: verifyAccountSchema }),
  new FinanceController().verifyAccountPS
);
financeRouter.get(
  '/wallet/transferFee',
  inputValidator({ query: amountSchema }),
  // isAuthenticated,
  new FinanceController().getTransferFee
);

financeRouter.get(
  '/wallet/transferFeePS',
  inputValidator({ query: amountSchema }),
  // isAuthenticated,
  new FinanceController().getTransferFeePS
);

financeRouter.get(
  '/wallet/getTransfer/:id',
  isAuthenticated,
  new FinanceController().getSingleTransfer
);

financeRouter.get(
  '/wallet/webhook',
  new FinanceController().getTransferFeePS
);


financeRouter.post(
  '/wallet/fw-web',
  new FinanceController().fwWebhook
);

financeRouter.get(
  '/wallet/getBanks',
  isAuthenticated,
  new FinanceController().getBanks
);

financeRouter.post(
  '/wallet/createTransferRecipient',
  inputValidator({ body: createRecipientSchema }),
  // isAuthenticated,
  new FinanceController().createRecipient,
);

financeRouter.post(
  '/wallet/walletToAccionTransfer',
  inputValidator({ body: transferToAccion }),
  // isAuthenticated,
  new FinanceController().walletToAccionTransfer,
);

financeRouter.post(
  '/wallet/paystackTransfer',
  inputValidator({ body: paystackTransferSchema }),
  // isAuthenticated,
  new FinanceController().paystackTransfer
);

financeRouter.get(
  '/wallet/getBanksPS',
  // isAuthenticated,
  new FinanceController().getBanksPS,
);

financeRouter.get(
  '/admin/fetchPSRecord',
  // isAuthenticated,
  new FinanceController().fetchPSRecord,
);

financeRouter.post(
  '/wallet/hook',
  new FinanceController().webHook
);

// financeRouter.post(
//   '/wallet/withdrawl',
//   inputValidator({ body: withdrawlWalletSchema }),
//   isAuthenticated,
//   isPermitted(['finance:create:any']),
//   financeController.withdrawlWallet,
// );

// financeRouter.post(
//   '/wallet/approveFundWallet',
//   inputValidator({ body: approveFundWalletSchema }),
//   isAuthenticated,
//   isPermitted(['finance:create:any']),
//   financeController.approveFundWallet,
// );

// financeRouter.post(
//   '/wallet/requestPayout',
//   inputValidator({ body: requestPayoutSchema }),
//   isAuthenticated,
//   isPermitted(['finance:create:own', 'finance:create:any']),
//   financeController.requestPayout,
// );

// financeRouter.post(
//   '/wallet/decidePayoutRequest',
//   inputValidator({ body: decidePayoutRequestSchema }),
//   isAuthenticated,
//   isPermitted(['finance:create:any']),
//   financeController.decidePayoutRequest,
// );

// || || () () | TRANSFER SECTION  | () () || || \\ END
