import { UniversalsController } from '../../@core/common/universals.controller';
import { EmailService } from './email.service';
import { Response, Request, NextFunction } from 'express';



export class EmailController extends UniversalsController {

  public sendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { emailAddress, emailTemplate, details, subject } = req.body;
    try {
      await new EmailService().zohoMail(req, emailAddress, emailTemplate, details, subject);
      // const { statusCode, status, message, data } = response;
      // res.status(statusCode).json({ status, message, data })

    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
}
