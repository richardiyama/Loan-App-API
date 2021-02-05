import { TransactionService } from './transaction.service';
import { Request, Response, NextFunction } from 'express';
import { UniversalsController } from '../../@core/common/universals.controller';


export class TransactionController extends UniversalsController {
  public getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { body, user, ip, method, originalUrl, query } = req;
    try {
      const response = await new TransactionService().processGetTransactions(user, query, body, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getTransactionsByDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processGetTransactionsByDate(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getAllTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processGetAllTransactions(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getTotalTransactionVolumeAndValue = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processGetTotalTransactionVolumeAndValue(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public getTransactionCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processGetTransactionCategories(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getTransactionStatusAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processGetTransactionStatusAdmin(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public transactionsByDateRange = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processTransactionsByDateRange(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public incomePerChannel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processIncomePerChannel(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public incomePerTransactionType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processIncomePerTransactionType(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public filterTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processTransactionsFilter(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public addTxnRules = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new TransactionService().processAddTxnRules(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

}
