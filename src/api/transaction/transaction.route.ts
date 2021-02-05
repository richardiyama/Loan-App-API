/* eslint-disable import/prefer-default-export */
import express from 'express';

import { TransactionController } from './transaction.controller';
import { getTransactionsSchema, dateRangeSchema, transRangeSchema, addTxnsRule, transactionFilterSchema } from './transaction.validator';
import {
  inputValidator,
  isAuthenticated,
  // isPermitted,
} from '../../util/middleware';

export const transactionRouter = express.Router();

transactionRouter.get('/', (_req, res) => {
  return res.status(200).json({
    message: 'welcome to transactions api',
  });
});

transactionRouter.post(
  '/getTransactions',
  inputValidator({ body: getTransactionsSchema }),
  isAuthenticated,
  new TransactionController().getTransactions
);

transactionRouter.post(
  '/getTransactionsByDate',
  inputValidator({ body: dateRangeSchema }),
  isAuthenticated,
  new TransactionController().getTransactionsByDate
);

transactionRouter.get(
  '/admin/getAllTransactions',
  isAuthenticated,
  new TransactionController().getAllTransactions
);
transactionRouter.post(
  '/admin/transactionCategory',
  isAuthenticated,
  new TransactionController().getTransactionCategory
);
transactionRouter.post(
  '/admin/transactionStatus',
  isAuthenticated,
  new TransactionController().getTransactionStatusAdmin
);
transactionRouter.post(
  '/admin/transactionTotals',
  isAuthenticated,
  inputValidator({ body: dateRangeSchema }),
  new TransactionController().getTotalTransactionVolumeAndValue
);

transactionRouter.post(
  '/admin/dateRange',
  inputValidator({ body: transRangeSchema }),
  isAuthenticated,
  new TransactionController().transactionsByDateRange
);

transactionRouter.post(
  '/admin/income/channel',
  inputValidator({ body: transRangeSchema }),
  isAuthenticated,
  new TransactionController().incomePerChannel
);

transactionRouter.post(
  '/admin/income/transactionType',
  inputValidator({ body: transRangeSchema }),
  isAuthenticated,
  new TransactionController().incomePerTransactionType
);

transactionRouter.post(
  '/admin/filter',
  inputValidator({ body: transactionFilterSchema }),
  isAuthenticated,
  new TransactionController().filterTransactions
);
// transactionRouter.put(
//   '/update',
//   inputValidator(getTransactionSchema),
//
//   isAuthenticated,
//   paymentController.getTransaction,
// );

transactionRouter.post(
  '/add',
  inputValidator({ body: addTxnsRule }),
  new TransactionController().addTxnRules,
);
