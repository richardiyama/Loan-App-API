import { Request, Response, NextFunction } from "express";
import { BillService } from './bill.service';
import { IResponse } from '../account/account.interface';
import { UniversalsController } from '../../@core/common/universals.controller';



export class BillController extends UniversalsController {

  public getTransactionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new BillService().getTransactionStatus(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public getVariations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new BillService().getVariations(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public purchaseProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new BillService().processPayments(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public addBillCommission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new BillService().processCommission(req.body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public verifyCableTv = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: any = await new BillService().verifyCableTV(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

  public verifyMeter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: any = await new BillService().verifyMeter(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  };

}



