import { UniversalsController } from '../../@core/common/universals.controller';
import { Request, Response, NextFunction } from 'express';
import { MigrationService } from './migration.service';


export class MigrationController extends UniversalsController {
  public addNewField = async (req: Request, res: Response, next: NextFunction) => {

    try {
      const response: any = await new MigrationService().processAddNewField(req);
      this.controllerResponseHandler(response, res);
    } catch (error) {
      this.controllerErrorHandler(req, res, error)
    }
  }
}
