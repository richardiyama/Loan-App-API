import { VerificationService } from './verification.service';
import { Request, Response, NextFunction } from 'express';
import { UniversalsController } from '../../@core/common/universals.controller';



export class VerificationController extends UniversalsController {
  public bvnVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new VerificationService().bvnVerification(req);
      res.json(response);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }
  public addressVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new VerificationService().processAddressVerify(req);
      res.json(response);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public processNinNumberVerification = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new VerificationService().processNinNumberVerification(req);
      res.json(response);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public processNinPhoneVerification  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new VerificationService().processNinPhoneVerification(req);
      res.json(response);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public processVerifyDriverLicense  = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new VerificationService().processVerifyDriverLicense(req);
      res.json(response);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }
}




  
   

