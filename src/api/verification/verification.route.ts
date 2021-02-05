import * as express from "express";
import { inputValidator } from '../../util/middleware';
import { BVNSchema,AddressSchema,NinNumberSchema,NinPhoneSchema,DriverLicenceSchema } from '../loan/loan.validator';
//import { ninNumberSchema } from "../user/user.validator";
import { VerificationController} from './verification.controller';

export const verificationRouter = express.Router();

verificationRouter.post(
  "/bvnVerification",
  inputValidator({ query: BVNSchema }),
  new VerificationController().bvnVerification
)

verificationRouter.post(
  "/addressVerification",
  inputValidator({body:AddressSchema }),
  new VerificationController().addressVerification
)

verificationRouter.post(
  "/ninNumberVerification",
  inputValidator({body:NinNumberSchema }),
  new VerificationController().processNinNumberVerification
)

verificationRouter.post(
  "/ninPhoneVerification",
  inputValidator({body:NinPhoneSchema }),
  new VerificationController().processNinPhoneVerification
)


verificationRouter.post(
  "/verifyDriverLicense",
  inputValidator({body:DriverLicenceSchema }),
  new VerificationController().processVerifyDriverLicense
)

