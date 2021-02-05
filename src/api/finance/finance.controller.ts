import { IResponse } from '../account/account.interface';
import { FinanceService } from './finance.service';
import { Request, Response, NextFunction } from 'express';
import { UniversalsController } from '../../@core/common/universals.controller';


export class FinanceController extends UniversalsController {
  public bulkTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // const response: IResponse = await new FinanceService().bulkTransfer(req.body);
      // this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public walletToWalletTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new FinanceService().processWalletToWalletTransfer(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public getBanks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().getBanks(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public walletToAccionTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new FinanceService().processWalletToAccionTransfer(req);
      await this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


  public getTransferFeePS = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().processGetTransferFeePS(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public webHook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().processWebhookPS(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public getBanksPS = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().getBanksPS(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public fetchPSRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().fetchPSTransactionHistory(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public createRecipient = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().processCreateRecipient(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public paystackTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().processInitiateTransfer(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public walletToBankTransfer = async (req: Request, res: Response, next: NextFunction) => {
    const { body, ip, originalUrl, method, user } = req;
    try {
      const response: IResponse = await new FinanceService().processWalletToBankTransfer(body, { ip, originalUrl, method }, user);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error)
    }
  }

  public getTransferFee = async (req: Request, res: Response, next: NextFunction) => {
    const { query, ip, originalUrl, method } = req;
    try {
      const response: IResponse = await new FinanceService().processGetTransferFee(query, { ip, originalUrl, method });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error)
    }
  }

  public getSingleTransfer = async (req: Request, res: Response, next: NextFunction) => {
    const { params, ip, originalUrl, method } = req;
    try {
      const response: IResponse = await new FinanceService().processGetSingleTransfer(params, { ip, originalUrl, method });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error)
    }
  }

  public fwWebhook = async (req: Request, res: Response, next: NextFunction) => {
    const { body, ip, originalUrl, method, headers } = req;
    try {
      const response: IResponse = await new FinanceService().processFWWebhook(body, { ip, originalUrl, method, headers });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    const { body, ip, method, originalUrl } = req;
    try {
      const response: IResponse = await new FinanceService().processVerifyAccount(body, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error)
    }
  }

  public verifyAccountPS = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: IResponse = await new FinanceService().processVerifyAccountPS(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      await this.controllerErrorHandler(req, res, error)
    }
  }

}
