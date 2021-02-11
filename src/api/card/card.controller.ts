import { CardService } from './card.service';
import { IResponse } from '../account/account.interface';
import { NextFunction, Request, Response } from 'express';
import { UniversalsController } from '../../@core/common/universals.controller';




export class CardController extends UniversalsController {
  public getUserCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user, ip, method, originalUrl } = req;
    try {
      const response: IResponse = await new CardService().getUserCard(user, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public getCards = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new CardService().getCards(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public deleteCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { user, ip, method, originalUrl, body } = req;
    try {
      const response: IResponse = await new CardService().deleteCard(user, body, { ip, method, originalUrl });
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public verifyAndAddCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new CardService().verifyAndAddCard(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public addCard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body
    try {
      const response: IResponse = await new CardService().addCard(body, body);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public verifyReference = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response: IResponse = await new CardService().verifyReference(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
}
