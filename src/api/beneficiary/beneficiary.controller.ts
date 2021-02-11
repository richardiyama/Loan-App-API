import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../account/account.interface';
import { BeneficiaryService } from './beneficiary.service';
import { UniversalsController } from '../../@core/common/universals.controller';




export class BeneficiaryController extends UniversalsController {
  public rootRoute = async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Welcome to beneficiary mangement service", data: null })
  }
  public saveBeneficiary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new BeneficiaryService().processSaveBeneficiary(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data });
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public userBeneficiaries = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new BeneficiaryService().processUserBeneficiaries(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data });
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public removeBeneficiary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new BeneficiaryService().processRemoveBeneficiary(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data });
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
}
