import { config } from "secreta";
import { UniversalsService } from '../../@core/common/universals.service';
const { PAYSTACK_API, BUDDY_PAYSTACK_SECRET,RUBIKPAY_VAS_URL} = config;
const headersPaystack = { 'Authorization': BUDDY_PAYSTACK_SECRET, "Content-Type": "application/json" }
const headersVerifyMe = { 'Authorization': BUDDY_PAYSTACK_SECRET, "Content-Type": "application/json" }


export class VerificationService extends UniversalsService {
  public bvnVerification = async (req) => {
    const resolveBVN = `${PAYSTACK_API}/bank/resolve_bvn/${req.query.bvn}`;
    try {
      const response = await this.apiCall(resolveBVN, null, headersPaystack, "GET", req.hostname);
      const responseData = await response.json();
      const { status, message, data } = responseData;
      if (status === false) {
        if (-(message.indexOf("balance is not enough"))) return this.failureResponse("Service down");
        return this.failureResponse(message);
      };
      return this.successResponse("success", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processNinNumberVerification = async (req) => {
    const { nin: nin, firstName: firstname, lastName: lastname, dob } = req.body;
    const reqBody = { nin,firstname, lastname, dob };
    const ninAPI = `${RUBIKPAY_VAS_URL}/verify/ninNumberVerification`;
    try {
      const response = await this.apiCall(ninAPI, reqBody, headersVerifyMe, "POST", req.hostname)
      const responseData = await response.json();
      const { status, data, message } = responseData;
      if (status !== "success") return this.failureResponse(message);
      return this.successResponse("User data found", data);
      // return responseData;
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processNinPhoneVerification = async (req) => {
    const { mobileNumber: mobileNumber,firstName: firstname, lastName: lastname, dob } = req.body;
    const reqBody = { mobileNumber,firstname, lastname, dob };
    const ninAPI = `${RUBIKPAY_VAS_URL}/verify/ninPhoneVerification`;
    try {
      const response = await this.apiCall(ninAPI, reqBody, headersVerifyMe, "POST", req.hostname)
      const responseData = await response.json();
      const { status, data, message } = responseData;
      if (status !== "success") return this.failureResponse(message);
      return this.successResponse("User data found", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processVerifyDriverLicense = async (req) => {
    const { mobileNumber: mobileNumber, firstName: firstname, lastName: lastname, dob } = req.body;
    const reqBody = { mobileNumber,firstname, lastname, dob };
    const verifyMeAPI = `${RUBIKPAY_VAS_URL}/verify/driverLicenseVerification`;
    try {
      const response = await this.apiCall(verifyMeAPI, reqBody, headersVerifyMe, "POST", req.hostname)
      const responseData = await response.json();
      const { status, data, message } = responseData;
      if (status !== "success") return this.failureResponse(message);
      return this.successResponse("User data found", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

     public processAddressVerify = async (req) => {
      const { lga, city,street,address,state,webHookUrl,idType,
        idNumber,firstName,lastName,mobileNumber, landmark, dob } = req.body;
      const reqBody = { lga,city,street,address,state,webHookUrl,
        idType,idNumber,firstName,lastName,mobileNumber,landmark,dob };
       const verifyMeAPI = `${RUBIKPAY_VAS_URL}/verify/verifyAddressRequest`;
       try {
         const response = await this.apiCall(verifyMeAPI, reqBody, headersVerifyMe, "POST")
         const responseData = await response.json();
         const { status, data, message } = responseData;
         if (status !== "success") return this.failureResponse(message);
         return this.successResponse("User data found", data);
       } catch (error) {
         return this.serviceErrorHandler(req, error)
       }
   }
}
