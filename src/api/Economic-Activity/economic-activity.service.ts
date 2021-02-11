import { UniversalsService } from '../../@core/common/universals.service';
import EconomicActivitySchema from './economic-activitity.model';
import { IResponse } from '../account/account.interface';


export class EconomicActivitiesService extends UniversalsService {
  public processEconomicActivities = async (req): Promise<IResponse> => {
    try {
      const economicActivity = await EconomicActivitySchema.create(req.body);
      return this.successResponse("Activity added", economicActivity);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }
}
