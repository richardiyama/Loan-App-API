import { Request, Response } from "express";
import logger from '../../util/logger/logger';


export class UniversalsController {
  protected controllerErrorHandler = (req: Request, res: Response, error) => {
    const { originalUrl, method, ip } = req;
    logger.log('warn', `URL:${originalUrl} - METHOD:${method} - IP:${ip} - ERROR:${error}`);
    return res.status(500).json({ status: false, message: "Internal server error", data: null });
  }

  protected controllerResponseHandler = async (response, res: Response): Promise<any> => {
    const { statusCode, status, message, data } = response;
    return res.status(statusCode).json({ status, message, data });
  }
}
