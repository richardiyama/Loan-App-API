import express from 'express';
import { inputValidator, isAuthenticated } from '../../util/middleware';
import {
  airtimeSchema,
  verifyCableTvSchema,
  querySchema,
  verifyMeterSchema,
  insuranceSchema,
} from './bills.validator';
import { BillController } from './bills.controller';
// import { isAuthenticated } from '../../util/middleware';
import { serviceIDSchema, billSchema, commissionSchema } from './bills.validator';

export const billsRouter = express.Router();

billsRouter.get('/', (req, res) => {
  return res.status(200).json({
    message: 'welcome to bills api',
  });
});

// get variations for services
billsRouter.get(
  '/variations',
  inputValidator({ query: serviceIDSchema }),
  isAuthenticated,
  new BillController().getVariations
);

//query transaction status
billsRouter.get(
  '/query',
  inputValidator({ query: querySchema }),
  isAuthenticated,
  new BillController().getTransactionStatus,
);

billsRouter.get('/pay', (req, res) => {
  return res.status(200).json({
    message: 'welcome to bills payment api',
  });
});

//insurance
billsRouter.post(
  '/pay/insurance',
  inputValidator({ body: insuranceSchema }),
  isAuthenticated,
  new BillController().purchaseProduct,
);


billsRouter.post(
  '/pay/airtime',
  inputValidator({ body: airtimeSchema }),
  isAuthenticated,
  new BillController().purchaseProduct,
);


billsRouter.post(
  '/pay/products',
  inputValidator({ body: billSchema }),
  isAuthenticated,
  new BillController().purchaseProduct,
);

billsRouter.post(
  '/commission',
  inputValidator({ body: commissionSchema }),
  isAuthenticated,
  new BillController().addBillCommission,
);

//verify smartcard number for cable tv
billsRouter.post(
  '/cabletv/verify',
  inputValidator({ body: verifyCableTvSchema }),
  isAuthenticated,
  new BillController().verifyCableTv,
);

//verify meter number
billsRouter.post(
  '/meter/verify',
  inputValidator({ body: verifyMeterSchema }),
  // isAuthenticated,
  new BillController().verifyMeter,
);

