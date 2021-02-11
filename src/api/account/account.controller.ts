
import { Request, Response, NextFunction } from "express";
import { AccountService } from "./account.service";
import { IResponse } from './account.interface';
import { UniversalsController } from '../../@core/common/universals.controller';





export class AccountController extends UniversalsController {

  public openAccount = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response: IResponse = await new AccountService().openAccount(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data })
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public nipFee = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { ip, method, originalUrl, body, hostname } = req;
    try {
      const response: IResponse = await new AccountService().processNIPFee({ ip, method, originalUrl, hostname }, body);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data })
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public listAccountByPhoneName = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { ip, method, originalUrl, body } = req;
    try {
      const response: IResponse = await new AccountService().processListAccountByPhoneName({ ip, method, originalUrl }, body);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data })
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  // public rewardReferral = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  //   try {
  //     const response: IResponse = await new AccountService().processReferralReward(req);
  //     const { statusCode, status, message, data } = response;
  //     res.status(statusCode).json({ status, message, data });
  //   } catch (error) {
  //     this.controllerErrorHandler(req, res, error);
  //   }
  // }

  public createSaveBrigtha = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response: IResponse = await new AccountService().processCreateSaveBrigtha(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data });
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public userRewards = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response: IResponse = await new AccountService().processGetUserRewards(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data });
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
  public getAllRewards = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response: IResponse = await new AccountService().processGetAllRewards(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data });
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public customerDetailsByMobile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new AccountService().customerDetailsByMobile(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data })
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public customerAccountsByMobile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new AccountService().customerAccountsByMobile(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data })
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public securityQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new AccountService().securityQuestions();
      await this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getBanks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new AccountService().processGetBanks(req);
      await this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public checkAccountBalance = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new AccountService().checkAccountBalance(req);
      await this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public fundTransfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new AccountService().processTransfer(req);
      await this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public walletToAccountUpgrade = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new AccountService().processWalletToAccountUpgrade(req);
      await this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public customerDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new AccountService().customerDetails(req);
      if (response.responseCode === "00") {
        res.status(200).json({ status: true, message: "Customer details fetch was successful", data: response })
      } else {
        res.status(response.status || 400).json({ status: false, message: "Customer details fetch was not successful", data: response })
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error", data: null })
    }
  }

  public accountDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new AccountService().accountDetails(req);
      if (response.responseCode === "00") {
        const falseRes = { status: true, message: "Query was successful", data: null }
        const trueRes = { status: true, message: "Query was successful", data: response }
        const resp = response.accountNumber !== "ACCOUNT has no record!" ? trueRes : falseRes
        res.status(200).json(resp)
      } else {
        res.status(response.status || 400).json({ status: false, message: "Query was not successful", data: response })
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error", data: null })
    }
  }

  // public AccountDeduction = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const response = await new AccountService().processAccountDeduction(req, req.body);
  //     if (response.responseCode === "00") {
  //       res.status(200).json({ status: true, message: "Airtime payment was successful", data: response })
  //     } else {
  //       res.status(response.status || 400).json({ status: false, message: "Airtime payment was not successful", data: response })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
  // }

  // public reverseTransfer = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const response = await new AccountService().reverseTransfer(req.body.t24Reference);
  //     if (response.responseCode === "00") {
  //       res.status(200).json({ status: true, message: "Transaction reversal was successful", data: response })
  //     } else {
  //       res.status(response.status || 400).json({ status: false, message: "Transaction reversal was not successful", data: response })
  //     }
  //   } catch (error) {
  //     res.status(500).json({ status: false, message: "Internal server error", data: null })
  //   }
  // }

  public accountList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new AccountService().accountList(req);
      if (response && response.length >= 0) {
        res.status(200).json({ status: true, message: "Account list fetch was successful", data: response })
      } else {
        res.status(response.status || 400).json({ status: false, message: "Account list fetch was not successful", data: response })
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error", data: null })
    }
  }

  public miniStatement = async (req: Request, res: Response, next: NextFunction) => {
    const { query, hostname } = req
    try {
      const response = await new AccountService().miniStatement(query, hostname);
      console.log(response, 'res');
      if (response && "row" in response) {
        res.status(200).json({ status: true, message: "Query was successful", data: response.row !== null ? response : [] })
      } else {
        res.status(response.status || 400).json({ status: false, message: "Query not was successful", data: null })
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error", data: null })
    }
  }

  public sendSMS = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new AccountService().sendSMS(req.body);
      console.log(response, "sms");

      if (response.responseCode === "00") {
        res.status(200).json({ status: true, message: "SMS was sent successfully", data: response })
      } else {
        res.status(response.status || 400).json({ status: false, message: "SMS was not sent", data: response })
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error", data: null })
    }
  }

  public accountUpgrade = async (req: Request, res: Response, next: NextFunction) => {
    const { ip, method, originalUrl, body } = req;
    try {
      const response = await new AccountService().processAccountUpgrade({ ip, method, originalUrl }, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public nameEnquiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new AccountService().nameEnquiry(req);
      console.log(response, "sms");

      if (response.responseCode === "00") {
        res.status(200).json({ status: true, message: "Query was successfully", data: response })
      } else {
        res.status(response.status || 400).json({ status: false, message: "Query failed", data: response })
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error", data: null })
    }
  }

  public verifyTransaction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new AccountService().verifyTransaction(req);
      if (response.responseCode === "00") {
        res.status(200).json({ status: true, message: "Verification was successful", data: response })
      } else {
        res.status(response.status || 400).json({ status: false, message: "Verification failed", data: response })
      }
    } catch (error) {
      res.status(500).json({ status: false, message: "Internal server error", data: null })
    }
  }

  public transactionHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new AccountService().transactionHistory(req);
      if (response.responseCode === "00") {
        res.status(200).json({ status: true, message: "Query was successfully", data: response })
      } else {
        res.status(response.status || 400).json({ status: false, message: "Query failed", data: response })
      }
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }

  public nip = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new AccountService().processNIP(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
}


