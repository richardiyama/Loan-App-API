import * as express from 'express';
import { inputValidator, isAuthenticated } from '../../util/middleware';
import { WalletValidator } from './wallet.validator';
import { WalletController } from './wallet.controller';

// , fundWalletByCard

export const walletRouter = express.Router();

// @desc        Route to fundd wallet through third party account
// @route       GET /api/v1/wallets/fundWalletByAccount
// @access      Public
walletRouter.post(
  '/fundWalletByAccount',
  inputValidator({ body: new WalletValidator().fundByAccountSchema }),
  new WalletController().fundWalletByAccount
);

// walletRouter.post(
//   '/validateCharge',
//   inputValidator({ body: new WalletValidator().validateChargeSchema }),
//   new WalletController().validateCharge
// );

walletRouter.get(
  "/"
)

walletRouter.post(
  '/fundWalletByCard',
  isAuthenticated,
  inputValidator({ body: new WalletValidator().fundWalletSchema }),
  new WalletController().fundWalletByCard
);

walletRouter.delete(
  '/deleteWalletAccount',
  inputValidator({ query: new WalletValidator().validateAccountNumber }),
  new WalletController().deleteWalletAccount
);

walletRouter.post(
  '/createWalletAccount',
  inputValidator({ body: new WalletValidator().reserveAccountSchema }),
  new WalletController().reserveWalletAccount
);

walletRouter.get(
  '/walletAccountDetails',
  inputValidator({ query: new WalletValidator().validateaccountReference }),
  new WalletController().walletAccountDetails
);

walletRouter.get(
  '/transactionStatus',
  inputValidator({ query: new WalletValidator().validateaccountReference }),
  new WalletController().transactionStatus
);

walletRouter.get(
  '/admin/block',
  inputValidator({ query: new WalletValidator().userIdSchema }),
  new WalletController().blockWallet
);
walletRouter.get(
  '/admin/unblock',
  inputValidator({ query: new WalletValidator().userIdSchema }),
  new WalletController().unblockWallet
);

walletRouter.get(
  '/getWallet',
  inputValidator({ query: new WalletValidator().userIdSchema }),
  new WalletController().getWallet
);

walletRouter.post(
  '/notification',
  new WalletController().notification
);
