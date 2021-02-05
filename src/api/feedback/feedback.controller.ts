import { IResponse } from './../account/account.interface';
import { UniversalsController } from "../../@core/common/universals.controller";
import { FeedbackService } from './feedback.service';
import { Request, Response, NextFunction } from 'express';


export class FeedbackController extends UniversalsController {
  public feedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new FeedbackService().processFeedback(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getFeedback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new FeedbackService().processGetFeedbacks(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public fetchAudit = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response: IResponse = await new FeedbackService().processFetchingOfAudit(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data })
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public fetchNotification = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const response: IResponse = await new FeedbackService().processFetchingOfNotification(req);
      const { statusCode, status, message, data } = response;
      res.status(statusCode).json({ status, message, data })
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }


}
