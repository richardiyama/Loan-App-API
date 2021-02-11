import { UniversalsService } from '../../@core/common/universals.service';
import { IResponse } from '../account/account.interface';
import { Types } from 'mongoose';
import Beneficiary from './beneficiary.model';
import User from '../user/user.model';
import bcrypt from 'bcrypt';



export class BeneficiaryService extends UniversalsService {
  public processSaveBeneficiary = async (req): Promise<IResponse> => {
    const { accountNumber, userId, isAccount, pin } = req.body;
    let _id = Types.ObjectId(userId);
    const user: any = await User.findOne({ _id });
    const isValidPin = await bcrypt.compare(pin, user.pin);
    if (!isValidPin) return this.failureResponse("Invalid pin")
    try {
      const isExisting = await Beneficiary.findOne({ accountNumber, userId, isAccount });
      if (isExisting) return this.failureResponse("Beneficiary already exists");
      delete req.body.pin;
      const accountBeneficiary = await Beneficiary.create(req.body);
      if (!accountBeneficiary) return this.failureResponse("Beneficiary save failed");
      return this.successResponse("Beneficiary saved");
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processUserBeneficiaries = async (req): Promise<IResponse> => {
    const { userId, isAccount } = req.body;
    try {
      const accountBeneficiary = await Beneficiary.find({ userId, isAccount });
      if (!accountBeneficiary) return this.failureResponse("No beneficiary found");
      return this.successResponse("Beneficiary fetched", accountBeneficiary);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processRemoveBeneficiary = async (req): Promise<IResponse> => {
    const { userId, beneficiaryId, pin } = req.query;
    let _id = Types.ObjectId(userId);
    const user: any = await User.findOne({ _id });
    _id = Types.ObjectId(beneficiaryId);
    const isValidPin = await bcrypt.compare(pin, user.pin);
    if (!isValidPin) return this.failureResponse("Invalid pin")
    try {
      const accountBeneficiary = await Beneficiary.deleteOne({ userId, _id });
      if (!accountBeneficiary.deletedCount) return this.failureResponse("No beneficiary found");
      return this.successResponse("Beneficiary removed");
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }
}
