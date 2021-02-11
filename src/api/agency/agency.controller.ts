import { AgencyService } from './agency.service';
import { Request, Response, NextFunction } from 'express';
import { UniversalsController } from '../../@core/common/universals.controller';


export class AgencyController extends UniversalsController {
  public getAgencyFees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new AgencyService().processFetchAgencySettingsFee(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }

  public updateAgencyFees = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await new AgencyService().processUpdateAgencySettingsFee(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
}
