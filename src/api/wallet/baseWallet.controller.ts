// import { IResponse } from '../account/account.interface';
import { UniversalsService } from '../../@core/common/universals.service';
// import { Response, Request } from 'express';
// import logger from '../../util/logger/logger';




export class WalletBaseController extends UniversalsService {
  // protected sendResponse = async (response, req: Request, res: Response) => {
  //   try {
  //     const { statusCode, data, message, status } = response;
  //     return statusCode === 200 ?
  //       res.status(200).json({ status, message, data }) :
  //       res.status(statusCode).json({ status, message, data })
  //   } catch (error) {
  //     return await this.errorHandler(req, res, error);
  //   }
  // }

  // protected errorHandler = async (req: Request, res: Response, error) => {
  //   var { originalUrl, method, ip } = req;
  //   logger.log('warn', `URL:${originalUrl} - METHOD:${method} - IP:${ip} - ERROR:${error}`);
  //   return res.status(500).json({ status: false, message: "Internal server error", data: null });
  // }
}
