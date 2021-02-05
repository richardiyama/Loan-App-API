import { IResponse } from '../account/account.interface';
import { UniversalsService } from '../../@core/common/universals.service';
import FeeSetting from '../audit/fee-settings.model';

export class AgencyService extends UniversalsService {

  public processUpdateAgencySettingsFee = async (req): Promise<IResponse> => {

    const obj = req.body
    try {
      await FeeSetting.updateOne({}, {
        $set: {
          ["agency." + obj.transactionType]: obj
        }
      });
      return this.successResponse("Agency Fees updated", null)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };
  public processFetchAgencySettingsFee = async (req): Promise<IResponse> => {
    try {
      const fees = await FeeSetting.findOne({}, { agency: 1 });
      return this.successResponse("Agency Fees fetched", fees)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

}
