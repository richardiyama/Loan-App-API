
import { EconomicActivitiesService } from './economic-activity.service';
import { UniversalsController } from '../../@core/common/universals.controller';
import { Request, Response, NextFunction } from 'express';


export class EconomicActivityController extends UniversalsController {
  public economicActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response = await new EconomicActivitiesService().processEconomicActivities(req);
      this.controllerResponseHandler(response, res)
    } catch (error) {
      this.controllerErrorHandler(req, res, error);
    }
  }
}
