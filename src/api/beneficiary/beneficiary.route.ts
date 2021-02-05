import * as express from 'express';
import { BeneficiaryController } from './beneficiary.controller';
import { inputValidator } from '../../util/middleware';
import { removeBeneficiarySchema, addBeneficiarySchema, getBeneficiarySchema } from './beneficiary.validator';


const beneficiaryRouter = express.Router();


beneficiaryRouter.get(
  "/",
  new BeneficiaryController().rootRoute
)

beneficiaryRouter.post(
  "/create",
  inputValidator({ body: addBeneficiarySchema }),
  new BeneficiaryController().saveBeneficiary
)

beneficiaryRouter.post(
  "/user",
  inputValidator({ body: getBeneficiarySchema }),
  new BeneficiaryController().userBeneficiaries
)

beneficiaryRouter.delete(
  "/remove",
  inputValidator({ query: removeBeneficiarySchema }),
  new BeneficiaryController().removeBeneficiary
)
export default beneficiaryRouter;
