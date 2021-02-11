import { Request, Response, NextFunction } from 'express';
import { IResponse } from '../account/account.interface';
import { WalletService } from './wallet.service';
import { UniversalsController } from '../../@core/common/universals.controller';


export class WalletController extends UniversalsController {

  public blockWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new WalletService().blockWallet(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


  public unblockWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new WalletService().unblockWallet(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new WalletService().getWallet(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public fundWalletByAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new WalletService().fundWalletByAccount(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public fundWalletByCard = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { user, body, ip, method, originalUrl } = req;
    try {
      const response: IResponse = await new WalletService().processFundWalletByCard(user, body, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  // public validateCharge = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   try {
  //     const response: IResponse = await new WalletService().validateCharge(req);
  //     const { statusCode, status, message, data } = response;
  //     res.status(statusCode).json({ status, message, data });
  //   } catch (error) {
  //     this.controllerErrorHandler(req, res, error);
  //   }
  // }

  public deleteWalletAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { query, ip, method, originalUrl } = req;
    try {
      const response: IResponse = await new WalletService().deleteWalletAccount(query, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public reserveWalletAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, ip, method, originalUrl } = req;
    try {
      const response: IResponse = await new WalletService().processReserveWalletAccount(body, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public walletAccountDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { query, ip, method, originalUrl } = req;
    try {
      const response: IResponse = await new WalletService().walletAccountDetails(query, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public transactionStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new WalletService().transactionStatus(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public notification = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, ip, method, originalUrl } = req;
    try {
      const response: IResponse = await new WalletService().processNotification(body, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
}
