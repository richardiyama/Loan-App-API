import User from '../user/user.model';
import { UniversalsService } from '../../@core/common/universals.service';



export class BaseBillService extends UniversalsService {
  public generateRequestId = () => {
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      result = '';
    const length = 6;
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
  };

  // public checkUserWallet = async (mobileNumber, amount) => {
  //   const query = { mobileNumber };
  //   const user: any = await User.findOne(query);
  //   if (!user) {
  //     const obj = {
  //       code: 404,
  //       message: 'User not found',
  //       status: false,
  //     };
  //     return obj;
  //   }

  //   //Check users wallet
  //   if (user.wallet.ledgerBalance >= amount) {
  //     return {
  //       code: 200,
  //       message: 'Sufficient wallet funds',
  //       status: true,
  //     };
  //   }

  //   return {
  //     code: 401,
  //     message: 'Insufficient wallet funds',
  //     status: false,
  //   };
  // };

  public updateUserWallet = async (mobileNumber, amount, type, wallet?) => {
    if (type == 'DEBIT') {
      wallet.ledgerBalance = wallet.ledgerBalance - (+amount * 100);
    } else {
      wallet.ledgerBalance = wallet.ledgerBalance + (+amount * 100);
    }
    wallet.balance = wallet.ledgerBalance;
    const user = await User.updateOne({ mobileNumber }, { wallet });
    if (!user) return this.failureResponse("User not found");
    return this.successResponse("success", user)
  };

  // public isUser = async (mobileNumber) => {
  //   console.log("000000");

  //   const query = { mobileNumber };
  //   const user: any = await User.findOne(query, { projection: { balance: 0, ledgerBalance: 0 } });
  //   if (!user) {
  //     return { data: null, message: 'User not found', status: false };
  //   }
  //   return { message: "Success", data: user, status: true };
  // }

  public matchVTPassElectricity = async (vtpassServiceId: string, vtpassVariationCode: string, amount: string, vtpassBillersCode) => {
    switch (vtpassServiceId && vtpassVariationCode) {
      case "eko-electric" && "prepaid":
        return { serviceID: "PHCNEKO", billersCode: vtpassBillersCode, amount };
      case "eko-electric" && "postpaid":
        return { serviceID: "PHCNPPEKO", billersCode: vtpassBillersCode, amount };
      case "ikeja-electric" && "prepaid":
        return { serviceID: "PHCNIKJ", billersCode: vtpassBillersCode, amount };
      case "ikeja-electric" && "postpaid":
        return { serviceID: "PHCNPPIKJ", billersCode: vtpassBillersCode, amount };
      case "kano-electric" && "prepaid":
        return { serviceID: "PHCNKAN", billersCode: vtpassBillersCode, amount };
      case "kano-electric" && "postpaid":
        return { serviceID: "PHCNPPKAN", billersCode: vtpassBillersCode, amount };
      case "jos-electric" && "prepaid":
        return { serviceID: "PHCNJOS", billersCode: vtpassBillersCode, amount }
      case "jos-electric" && "postpaid":
        return { serviceID: "PHCNPPJOS", billersCode: vtpassBillersCode, amount }
      case "kaduna-electric" && "prepaid":
        return { serviceID: "PHCNKAD", billersCode: vtpassBillersCode, amount }
      case "kaduna-electric" && "postpaid":
        return { serviceID: "PHCNPPKAD", billersCode: vtpassBillersCode, amount }
      default:
        return {};
    }
  }

  public formatInsuranceRequest = async (body) => {
    body.Insured_Name = body.insuredName; delete body.insuredName;
    body.Engine_Number = body.engineNumber; delete body.engineNumber;
    body.Chasis_Number = body.chasisNumber; delete body.chasisNumber;
    body.Plate_Number = body.plateNumber; delete body.plateNumber;
    body.Vehicle_Make = body.vehicleMake; delete body.vehicleMake;
    body.Vehicle_Color = body.vehicleColor; delete body.vehicleColor;
    body.Vehicle_Model = body.vehicleModel; delete body.vehicleModel;
    body.Year_of_Make = body.yearOfMake; delete body.yearOfMake;
    body.Contact_Address = body.contactAddress; delete body.contactAddress;
    return body
  }

}
