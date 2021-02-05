import * as express from 'express';
import { inputValidator } from '../../util/middleware';
import { activitySchema } from './economic-activities.validator';
import { EconomicActivityController } from './economic-activity.controller';


const economicActivityRouter = express.Router();



economicActivityRouter.post(
  "/create",
  inputValidator({ body: activitySchema }),
  new EconomicActivityController().economicActivity
)

export default economicActivityRouter;
