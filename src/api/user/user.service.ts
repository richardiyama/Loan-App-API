import OTP from './otp.model';
import randomatic from 'randomatic';
import { SmsService } from '../../@core/common/africastalking';
import { IResponse } from '../account/account.interface';
import User from './user.model';
import { UniversalsService } from '../../@core/common/universals.service';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { config } from 'secreta';
import { EmailService } from '../email/email.service';
import Role from '../permission/role.model';
import Verification from '../verification/verification.model';
import Audit from '../audit/audit.model';
import credentialHistory from './credentials.model';
import mongoose from 'mongoose';

const {
  JWT_SECRET,
  // FLUTTERWAVE_BASE_URL,
  // FLUTTERWAVE_SECRET,
  RUBIKPAY_VAS_URL,
  SMS_ACCOUNT_ID,
  SMS_TOKEN,
  RUBIKPAY_VAS_API_LIVE,
} = config;

const headersRubikVAS = {
  Authorization: RUBIKPAY_VAS_API_LIVE,
  'Content-Type': 'application/json',
};



export class UserService extends UniversalsService {
  // private headers = { "Content-Type": "application/json", Authorization: FLUTTERWAVE_SECRET };
  private smsHeaders = { "Content-Type": "application/json", Authorization: SMS_TOKEN }



  public processUserBVNVerification = async (metaData: any, body: any): Promise<IResponse> => {
    const resolveBVN: String = `https://vas-api.rubikpay.net/api/v1/verify/authenticateBVN`;
    try {
      const response = await this.apiCall(resolveBVN, body, headersRubikVAS, metaData.method, metaData.hostname);
      const responseData = await response.json();
      const { status, message, data } = responseData;
      if (status === true && message === 'BVN Verification Completed Successfully') {
        return this.successResponse('Success', data)
      };
      return this.failureResponse(status, { data, type: 'Server Error' });
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }


  public processUpdateUser = async (params, body, metaData): Promise<IResponse> => {
    try {
      // for (const [key, value] of Object.entries(query)) {
      //   query = { ...query, [key]: value };
      // }

      const updatedUser = await User.findByIdAndUpdate({ _id: params.userId }, { ...body });
      if (!updatedUser) return this.failureResponse("Update failed");
      return this.successResponse();
    } catch (error) {
      return this.serviceErrorHandler(metaData, error)
    }
  }


  public processUserRegisteration = async (body: any, metaData): Promise<IResponse> => {

    const {
      firstName,
      lastName,
      dateOfBirth,
      email,
      gender,
      role,
      securityQuestion,
      securityAnswer,
      password,
      confirmPassword,
      transactionPin,
      confirmTransactionPin,
      phone,
      bvn,
      LGA_ofOrigin,
      maritalStatus,
      levelOfAccount,
      profileCompletion
    } = body;
    const session = await mongoose.startSession(); session.startTransaction();

    try {
      if (password !== confirmPassword) {
        return this.failureResponse('Password and confirm password must be the same');
      }
      if (transactionPin !== confirmTransactionPin) {
        return this.failureResponse('Transaction pin must be the same');
      }
      if (password.length < 8) {
        return this.failureResponse('Password must be at least 8 characters');
      }
      if (password.search(/\d/) == -1) {
        return this.failureResponse('Password must contain at least one number');
      }
      if (password.search(/[A-Z]/) == -1) {
        return this.failureResponse('Password must contain at least one capital letter');
      }
      if (password.search(/[a-zA-Z]/) == -1) {
        return this.failureResponse('Password must contain at least one letter');
      }
      if (password.search(/[^a-zA-Z0-9\@\#\$\&\_\+\.\,\;\:]/) != -1) {
        return this.failureResponse(
          "Password may only contain '@', '#', '$', '&', '_', '+', ';', ':' special characters"
        );
      }
      //
      const foundUser = await User.findOne({ $or: [{ bvn }, { email }, { phone }] });
      if (foundUser) {
        return this.failureResponse(`User already exist`);
      }

      // Hashes
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      const hashsecAnswer = await bcrypt.hash(securityAnswer, salt);
      const hashtransactionPin = await bcrypt.hash(transactionPin, salt);
      const newUser: any = await User.create([
        {
          firstName,
          lastName,
          dateOfBirth,
          email,
          gender,
          role,
          securityQuestion,
          securityAnswer: hashsecAnswer,
          transactionPin: hashtransactionPin,
          password: hashPassword,
          bvn,
          LGA_ofOrigin,
          maritalStatus,
          levelOfAccount,
          currentLogin: new Date,
          profileCompletion,
          phone
        }], { session }
      );
      if (newUser) {
        const reserveAccount = `${RUBIKPAY_VAS_URL}/wallets/create-account`;
        const reqBody = { firstName, lastName, customerEmail: email }
        const response = await this.apiCall(reserveAccount, reqBody, this.rubikPayVASHeaders, "POST");
        const responseData = await response.json()
        const { status, data } = responseData
        if (status === false) {
          await session.abortTransaction(); session.endSession();
          return this.failureResponse("Registration failed");
        }
        const { reservationReference, accountReference, accountNumber } = data;
        newUser[0].wallet = { balance: 0, reservationReference, accountReference, accountNumber }
        await newUser[0].save();
        await credentialHistory.create({
          mobileNumber: phone,
          userId: newUser._id,
          credentialHistory: [{ password: hashPassword, pin: hashtransactionPin }]
        });
        await session.commitTransaction(); session.endSession();
        return this.successResponse(null);
      }
      return this.failureResponse('Registration failed');
    } catch (error) {
      await session.abortTransaction(); session.endSession();
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public processForgotPasswordSendOTP = async (metadata, body) => {
    const { mobileNumber } = body;
    try {
      const user: any = await User.findOne({ phone: mobileNumber })
      const code = randomatic('0', 6);
      const reqBody = {
        id: '123459',
        to: [`234${mobileNumber.substring(1)}`],
        sender_mask: 'ACCION',
        priority: 'high',
        body: `Hello ${user.firstName}, \nYour reset password OTP is: ${code} \nIt will expire in 10 minutes.
          \nThis OTP is private and personal, do not share or send to any one.`,
      };
      const messageURL = `https://konnect.kirusa.com/api/v1/Accounts/${SMS_ACCOUNT_ID}/Messages`;
      const response = await this.apiCall(
        messageURL,
        reqBody,
        this.smsHeaders,
        'POST',
        metadata.hostname,
      );
      const responseData = await response.json();
      if (responseData && responseData.status === 'ok') {
        const expiresIn = new Date().getTime() + 10 * 60000;
        await OTP.findOneAndUpdate(
          { mobileNumber },
          { OTPCode: { code, expiresIn } },
          { new: true, upsert: true },
        );
        return this.successResponse(
          'Reset password OTP has been sent to your mobile number and it will expire in 10 minutes.',
          user.phone,
        );
      }
      return this.failureResponse('OTP was not sent')
    } catch (error) {
      return this.serviceErrorHandler(metadata, error);
    }
  }

  protected passwordAndPinPolicy = async (uniqueIdentifier, credential, credType, _id, mobileNumber, req) => {
    try {
      const credHistory: any = await credentialHistory.findOne(uniqueIdentifier);
      if (credHistory) {
        for (let history of credHistory.credentialHistory) {
          if (history[credType]) {
            if (await bcrypt.compare(credential, history[credType])) {
              return this.failureResponse(`You have used this ${credType} before, kindly try another ${credType}`);
            }
          }
        }
        return this.successResponse();
      } else {
        await credentialHistory.create({
          mobileNumber, userId: _id, credentialHistory: [{
            credType
          }]
        })
        return this.successResponse()
      }
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processResetPassword = async (req): Promise<IResponse> => {
    const { mobileNumber, newPassword, confirmNewPass } = req.body;
    try {
      if (newPassword !== confirmNewPass) return this.failureResponse("Both password are not the same");
      if (newPassword.length < 8) return this.failureResponse('Password must be at least 8 characters');
      if (newPassword.search(/\d/) == -1) return this.failureResponse('Password must contain at least one number');
      if (newPassword.search(/[A-Z]/) == -1) return this.failureResponse('Password must contain at least one capital letter');
      if (newPassword.search(/[a-zA-Z]/) == -1) return this.failureResponse('Password must contain at least one letter');
      if (newPassword.search(/[^a-zA-Z0-9\@\#\$\&\_\+\.\,\;\:]/) != -1) {
        return this.failureResponse(
          "Password may only contain '@', '#', '$', '&', '_', '+', ';', ':' special characters",
        );
      }
      const user: any = await User.findOne({ phone: mobileNumber });
      if (!user) return this.failureResponse("No account with this phone number");
      const { phone: dbPhone, _id } = user;
      const password = await bcrypt.hash(newPassword, 10);
      const policyPassed = await this.passwordAndPinPolicy({ userId: _id }, newPassword, "password", _id, dbPhone, req);
      const { status, message } = policyPassed;
      if (status === false) return this.failureResponse(message);
      await User.updateOne({ _id }, { $set: { password } }, { new: true, projection: { password: 0, pin: 0 } });
      await credentialHistory.updateOne(
        { userId: _id },
        { $push: { credentialHistory: { password } } },
      );
      return this.successResponse("Password change was successful");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processChangePin = async (req): Promise<IResponse> => {
    const { userId, currentPin: xpin, newPin, password: userPassword } = req.body;
    const _id = Types.ObjectId(userId);
    try {
      const user: any = await User.findOne({ _id });
      if (!user) return this.failureResponse("No user found");
      const { pin: currentPin, password, mobileNumber } = user;
      const isUserPassword = await bcrypt.compare(userPassword, password);
      if (!isUserPassword) return this.failureResponse("Invalid credentials");
      const isUserPin = await bcrypt.compare(xpin, currentPin);
      if (!isUserPin) return this.failureResponse("Invalid credentials");
      const pin = await bcrypt.hash(newPin, 10);
      const policyPassed = await this.passwordAndPinPolicy({ userId }, newPin, "pin", user._id, mobileNumber, req);
      const { status, message } = policyPassed;
      if (status === false) return this.failureResponse(message);
      await User.updateOne({ _id }, { $set: { pin } }, { new: true, projection: { password: 0, pin: 0 } });
      await credentialHistory.updateOne({ _id }, { $push: { credentialHistory: { pin } } });
      return this.successResponse("Pin change was successful");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processRegisterSendOTPKirusa = async (metaData, body): Promise<IResponse> => {
    const { mobileNumber, firstName } = body;
    try {
      const code = randomatic('0', 6);
      const reqBody = {
        id: "123459", to: [`234${mobileNumber.substring(1)}`], sender_mask: "ACCION", priority: "high",
        body: `Hello ${firstName}, \nYour OTP is: ${code} \nOTP expires in 10 minutes.
          \nThis OTP is private and personal, do not share or send to any one.`
      }
      let msg = "OTP sent to your mobile number and it will expire in 10 minutes."
      const messageURL = `https://konnect.kirusa.com/api/v1/Accounts/${SMS_ACCOUNT_ID}/Messages`;
      const response = await this.apiCall(messageURL, reqBody, this.smsHeaders, "POST", metaData.hostname);
      const responseData = await response.json();
      if (responseData && responseData.status === "ok") {
        const expiresIn = new Date().getTime() + 10 * 60000;
        await OTP.findOneAndUpdate({ mobileNumber }, { OTPCode: { code, expiresIn } }, { new: true, upsert: true });
        return this.successResponse(msg);
      } else {
        return this.failureResponse("OTP was not sent");
      }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  // The block to send OTP SMS with fluttewave
  // public processRegisterSendFwOtp = async (req, body): Promise<IResponse> => {
  //   const { firstName, email, mobileNumber } = body;

  //   const reqBody = {
  //     length: 6, customer: { name: firstName, email, phone: `234${mobileNumber}` },
  //     sender: "PayBuddy", send: "true", medium: ["sms"], "expiry": 10
  //   };
  //   try {
  //     const otpURL = `${FLUTTERWAVE_BASE_URL}/otps`;
  //     const response = await this.apiCall(otpURL, reqBody, this.headers, "POST", req.hostname);
  //     const responseData = await response.json();
  //     console.log(responseData);

  //     if (responseData.status == 'success') {
  //       let { data } = responseData;
  //       let code = data?.length > 0 ? data[0].otp : null;
  //       const expiresIn = new Date().getTime() + 10 * 60000;
  //       let msg = "OTP sent to your mobile number and it will expire in 10 minutes.";
  //       await OTP.create({ mobileNumber }, { OTPCode: { code, expiresIn } });
  //       data = data.map(item => { delete item.otp; return item; });
  //       return this.successResponse(msg, data);
  //     }
  //     return this.serviceErrorHandler(req, responseData.message);
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error);
  //   }
  // }

  public verifyOTP = async (req): Promise<IResponse> => {
    const { mobileNumber, userOTP } = req.body;
    try {
      const dbOTP: any = await OTP.findOne({ mobileNumber });

      if (!dbOTP) return this.failureResponse("Invalid code");
      const { expiresIn, code } = dbOTP.OTPCode

      if (code !== userOTP || new Date() > expiresIn) return this.failureResponse('Code is invalid/expired');
      return this.successResponse("OTP verified");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  //Login
  protected validateUserLogin = async (user: any, phone: string, xPassword: string) => {
    const { password, currentLogin, _id } = user;
    const isValidPassword = await bcrypt.compare(xPassword, password);
    if (!isValidPassword) return this.failureResponse("Invalid username/password");
    const accessToken = jwt.sign({ userId: _id }, JWT_SECRET, { expiresIn: '1d' });
    const updatedUser: any = await User.findOneAndUpdate(
      { phone },
      {
        auth: { accessToken, kind: 'Bearer' },
        lastLogin: currentLogin,
        currentLogin: new Date(),
      },
      {
        new: true,
        upsert: true,
        projection: { password: 0, transactionPin: 0, securityAnswer: 0, securityQuestion: 0 },
      },
    );
    return this.successResponse(null, updatedUser);
  }

  public processLogin = async (req) => {
    const { phone, password: xPassword } = req.body;
    try {
      const user: any = await User.findOne({ phone });
      if (!user) return this.failureResponse(`User with phone number: ${phone} does not exist`);
      const validateUserLogin = await this.validateUserLogin(user, phone, xPassword);
      const { message, status, data } = validateUserLogin;
      if (status === false) return this.failureResponse(message)
      return this.successResponse("User logged in successfully", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public processSendOTPSMSAndEmail = async (req): Promise<IResponse> => {
    const { mobileNumber, emailAddress, firstName } = req.body
    try {
      const code = randomatic('0', 6);
      const OTPCode = { code, expiresIn: new Date().getTime() + 10 * 60000 };
      let saveOTP: any;
      saveOTP = await OTP.findOneAndUpdate({ mobileNumber }, { OTPCode }, { new: true });
      if (!saveOTP) saveOTP = await OTP.create({ mobileNumber, OTPCode });
      await new SmsService().sendMessage(`+234${mobileNumber.substring(0)}`,
        `Accion MFB: \nComplete your registration with the OTP below: \nCode: ${code} \nOTP expires in 10 minutes`,
        "PayBuddy")
      await new EmailService().sendEmail(req, emailAddress, "OTP", firstName, "Accion Internet/Mobile Banking Registration", code)
      return this.successResponse("OTP sent, expires in 1 hour", saveOTP)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public sendOTP = async (req): Promise<IResponse> => {
    const { mobileNumber } = req.query
    try {
      const code = randomatic('0', 6);
      const OTPCode = { code, expiresIn: new Date().getTime() + 10 * 60000 };
      let saveOTP: any;
      saveOTP = await OTP.findOneAndUpdate({ mobileNumber }, { OTPCode }, { new: true });
      if (!saveOTP) saveOTP = await OTP.create({ mobileNumber, OTPCode });
      await new SmsService().sendMessage(`+234${mobileNumber.substring(0)}`,
        `Accion MFB: \nComplete your registration with the OTP below: \nCode: ${saveOTP.OTPCode.code} \nOTP expires in 10 minutes`,
        "PayBuddy")
      return { statusCode: 200, status: true, message: "OTP sent, expires in 10 minutes", data: saveOTP }
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processSendOTPWithKirusa = async (metaData, body): Promise<IResponse> => {
    // const { mobileNumber, firstName, email, isAccount } = body
    const { mobileNumber, firstName } = body;
    try {
      const code = randomatic('0', 6);
      const reqBody = {
        id: "123459", to: [`234${mobileNumber.substring(1)}`], sender_mask: "ACCION", priority: "high",
        body: `Hello ${firstName}, \nYour OTP code has arrived.\nCode: ${code} \nOTP expires in 10 minutes.
              \nThis OTP is private and personal, do not share or send to any one.`
      }
      let msg = "OTP sent to your mobile number and it will expire in 10 minutes."
      const messageURL = `https://konnect.kirusa.com/api/v1/Accounts/${SMS_ACCOUNT_ID}/Messages`;
      const response = await this.apiCall(messageURL, reqBody, this.smsHeaders, "POST", metaData.hostname);
      const responseData = await response.json();
      if (responseData && responseData.status === "ok") {
        const expiresIn = new Date().getTime() + 10 * 60000;
        await OTP.updateOne({ mobileNumber }, { OTPCode: { code, expiresIn } }, { upsert: true });
        return this.successResponse(msg)
      } else {
        return this.failureResponse("OTP was not sent");
      }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public processSendResetCodeKirusa = async (metaData, body): Promise<IResponse> => {
    const { mobileNumber } = body;
    let user: any = await User.findOne({ mobileNumber });
    if (!user) return { statusCode: 400, status: false, message: "User not found", data: null };
    // const { firstName, emailAddress: email } = user
    const { firstName } = user

    const code = randomatic('0', 6);
    const resetCode = { code, expiresIn: new Date().getTime() + 10 * 60000 }
    const reqBody = {
      id: "123459", to: [`234${mobileNumber.substring(1)}`], sender_mask: "ACCION", priority: "high",
      body: `Hello ${firstName}, \nYour OTP code has arrived.\nCode: ${code} \nOTP expires in 10 minutes.
      \nThis OTP is private and personal, do not share or send to any one.`
    }
    try {
      const messageURL = `https://konnect.kirusa.com/api/v1/Accounts/${SMS_ACCOUNT_ID}/Messages`;
      const response = await this.apiCall(messageURL, reqBody, this.smsHeaders, "POST", metaData.hostname);
      const responseData = await response.json();
      if (responseData && responseData.status === "ok") {
        await User.updateOne({ mobileNumber }, { resetCode }, { new: true, projection: { auth: 0 } });
        // new EmailService().zohoMail(metaData, email, "otp", { otp: code }, "AccionPay Validation OTP")
        return this.successResponse("Reset code sent to your mobile number and email and it will expire in 10 minutes. If you didn't get an SMS, check your inbox, spam, and promotions email folders before retrying");
      } else {
        return this.successResponse("Reset code was not sent.");
      }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public processSendResetCode = async (req): Promise<IResponse> => {
    const { mobileNumber } = req.query;
    try {
      const code = randomatic('0', 6);
      const resetCode = { code, expiresIn: new Date().getTime() + 60 * 60000 };
      let user: any;
      user = await User.findOneAndUpdate({ mobileNumber }, { resetCode }, { new: true, projection: { auth: 0 } });
      if (!user) return { statusCode: 400, status: false, message: "User not found", data: null };
      if (!this.isEligible(user)) return { statusCode: 400, status: false, message: 'User account not active', data: null };
      new SmsService().sendMessage(`+234${mobileNumber.substring(0)}`, `Accion MFB: \nKindly find your reset code below: \nCode: ${user.resetCode.code} \nCode will expire in 1 hour`, "PayBuddy");
      return this.successResponse("Reset code was sent, it expires in 1 hour", null);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  // public processResetPassword = async (req): Promise<IResponse> => {
  //   const { mobileNumber, resetCode, newPassword } = req.body;
  //   try {
  //     const user: any = await User.findOne({ mobileNumber });
  //     if (!user) return { statusCode: 400, status: false, message: "Invalid code", data: null }
  //     const { _id, } = user;
  //     const { expiresIn, code } = user.resetCode;
  //     if (code !== resetCode || new Date() > expiresIn) return this.failureResponse("Code is invalid/expired");
  //     const password = await bcrypt.hash(newPassword, 10);
  //     const policyPassed = await this.passwordAndPinPolicy({ mobileNumber }, newPassword, "password", _id, mobileNumber, req);
  //     const { status, message } = policyPassed;
  //     if (status === false) return this.failureResponse(message);
  //     await User.findOneAndUpdate({ mobileNumber }, {
  //       $set: { password, resetCode: { code: null, expiresIn: null }, auth: { accessToken: null, kind: null } }
  //     }, { new: true, projection: { password: 0 } });
  //     await credentialHistory.updateOne({ mobileNumber }, { $push: { credentialHistory: { password } } });
  //     return this.successResponse("Password reset was successful. Login with the new password");
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error);
  //   }
  // }

  public processResetPin = async (req): Promise<IResponse> => {
    const { mobileNumber, resetCode, newPin } = req.body;
    try {
      const user: any = await User.findOne({ mobileNumber });
      if (!user) return { statusCode: 400, status: false, message: "Invalid code", data: null }
      const { expiresIn, code } = user.resetCode;
      if (code !== resetCode || new Date() > expiresIn) return { statusCode: 400, status: false, message: 'Code is invalid/expired ', data: null };
      const pin = await bcrypt.hash(newPin, 10);
      const policyPassed = await this.passwordAndPinPolicy({ mobileNumber }, newPin, "pin", user._id, mobileNumber, req);
      const { status, message } = policyPassed;
      if (status === false) return this.failureResponse(message);
      await User.findOneAndUpdate({ mobileNumber }, {
        $set: { pin, resetCode: { code: null, expiresIn: null }, auth: { accessToken: null, kind: null } }
      }, { new: true, projection: { password: 0 } });
      await credentialHistory.updateOne({ mobileNumber }, { $push: { credentialHistory: { pin } } })
      return this.successResponse("Pin reset was successful. Transact with your new pin");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processChangePasswordV2 = async (clientDetails, body): Promise<IResponse> => {
    const { userId, newPassword, secQstnAns } = body;
    const _id = Types.ObjectId(userId);
    try {
      const user: any = await User.findOne({ _id });
      if (!user) return this.failureResponse("No user found");
      const { mobileNumber, secQuestion } = user;
      const formatSecAns = secQstnAns.trim().toLowerCase()
      let isMatch = await bcrypt.compare(formatSecAns, secQuestion.value);
      if (!isMatch) return this.failureResponse("Answer to security question did not match");
      const password = await bcrypt.hash(newPassword, 10);
      const policyPassed = await this.passwordAndPinPolicy({ userId }, newPassword, "password", user._id, mobileNumber, clientDetails);
      const { status, message } = policyPassed;
      if (status === false) return this.failureResponse(message);
      await User.updateOne({ _id }, { $set: { password } }, { new: true, projection: { password: 0, pin: 0 } });
      await credentialHistory.updateOne({ _id }, { $push: { credentialHistory: { password } } })
      return this.successResponse("Password change was successful");
    } catch (error) {
      return this.serviceErrorHandler(clientDetails, error);
    }
  }

  public processChangePinV2 = async (clientDetails, body): Promise<IResponse> => {
    const { userId, newPin, secQstnAns } = body;
    const _id = Types.ObjectId(userId);
    try {
      const user: any = await User.findOne({ _id });
      if (!user) return this.failureResponse("No user found");
      const { mobileNumber, secQuestion } = user;
      const formatSecAns = secQstnAns.trim().toLowerCase()
      const isMatch = await bcrypt.compare(formatSecAns, secQuestion.value);
      if (!isMatch) return this.failureResponse("Answer to security question did not match");
      const policyPassed = await this.passwordAndPinPolicy({ userId }, newPin, "pin", user._id, mobileNumber, clientDetails);
      const { status, message } = policyPassed;
      if (status === false) return this.failureResponse(message);
      const pin = await bcrypt.hash(newPin, 10);
      await User.updateOne({ _id }, { $set: { pin } }, { new: true, projection: { password: 0, pin: 0 } });
      await credentialHistory.updateOne({ _id }, { $push: { credentialHistory: { pin } } });
      return this.successResponse("Pin change was successful");
    } catch (error) {
      return this.serviceErrorHandler(clientDetails, error);
    }
  }

  public processSecQuestion = async (clientDetails, query) => {
    const { userId, mobileNumber } = query;
    const _id = Types.ObjectId(userId);
    const data = [
      { key: 1, value: "What is your favourite colour?" },
      { key: 2, value: "What is your mother's maiden name?" },
      { key: 3, value: "What is your favourite movie?" },
      { key: 4, value: "Where were you when you had your first kiss?" },
      { key: 5, value: "What is your favourite book?" },
      { key: 6, value: "What is your first pet's name?" },
      { key: 7, value: "Where did you go on your first vacation?" },
      { key: 8, value: "Who was your first crush?" },
      { key: 9, value: "What was your first boss's last name?" },
      { key: 10, value: "What is the last name of your favourite teacher?" }
    ]
    try {
      const user: any = userId ? await User.findOne({ _id }) : await User.findOne({ mobileNumber });
      if (!user) return this.failureResponse("User does not exist");
      for (let item of data) {
        if (item.key == user.secQuestion.key) {
          return this.successResponse("Security question fetched", item.value);
        }
      }
      return this.failureResponse("Failed to fetch security question");
    } catch (error) {
      return this.serviceErrorHandler(clientDetails, error)
    }
  }

  // public processChangePasswordV2 = async (req): Promise<IResponse> => {
  //   const { userId, newPassword, currentPassword: xPassword } = req.body;
  //   const _id = Types.ObjectId(userId);
  //   try {
  //     const user: any = await User.findOne({ _id });
  //     if (!user) return this.failureResponse("No user found");
  //     const { password: currentPassword, mobileNumber } = user;
  //     const isUserPassword = await bcrypt.compare(xPassword, currentPassword);
  //     if (!isUserPassword) return this.failureResponse("Invalid credentials");
  //     const password = await bcrypt.hash(newPassword, 10);
  //     const policyPassed = await this.credentialPolicy({ userId }, newPassword, "password", user._id, mobileNumber, req);
  //     const { status, message } = policyPassed;
  //     if (status === false) return this.failureResponse(message);
  //     await User.updateOne({ _id }, { $set: { password } }, { new: true, projection: { password: 0, pin: 0 } });
  //     await credentialHistory.updateOne({ _id }, { $push: { credentialHistory: { password } } })
  //     return this.successResponse("Password change was successful");
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error);
  //   }
  // }

  public processCountUsers = async (req) => {
    try {
      const { startDate, endDate } = req.body;
      const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };

      let userReport = await User.aggregate([
        { $match: query },
        {
          $facet: {
            web: [
              { $match: { channel: "web" } },
              { $count: "total" }
            ],
            mobile: [
              { $match: { channel: "mobile" } },
              { $count: "total" }
            ]
          }
        }
      ])
      userReport[0]["total"] = (userReport[0].web[0]?.total || 0) + (userReport[0].mobile[0]?.total || 0);
      return this.successResponse("Report generated", userReport)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processGetAccountSummary = async (req) => {
    const { startDate, endDate } = req.body;
    const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
    try {

      const accountReport = await User.aggregate([
        { $match: query },
        {
          $facet: {
            totalUsers: [
              {
                $group: {
                  _id: "",
                  total: {
                    $sum: 1
                  },
                }
              },
            ],
            accountOpened: [
              { $match: { isAccount: true } },
              {
                $group: {
                  _id: "",
                  total: {
                    $sum: 1
                  },
                }
              }
            ],
            accountTier: [
              // { $match: { isAccount: true } },
              {
                $group: {
                  _id: "$kycTier",
                  total: {
                    $sum: 1
                  },
                }
              }
            ],
            accountOpenedByReferral: [
              //
              { $match: { referrer: { "$nin": [null, ""] } } },
              {
                $group: {
                  _id: "",
                  total: {
                    $sum: 1
                  },
                }
              }
            ],
          }
        }
      ])
      return this.successResponse("Account Summary fetched", accountReport);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processAccountRegistrationType = async (req) => {
    const { startDate, endDate, dayRange } = req.body;
    const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
    let format = "%Y-%m";
    let groupBy: any = { $month: "$createdAt" };
    if (dayRange) {
      groupBy = { $dayOfYear: "$createdAt" };
      format = "%Y-%m-%d";
    }

    try {
      const income = await User.aggregate([
        { $match: query },
        {
          $group: {
            _id: groupBy,
            date: { $first: { $dateToString: { format, date: "$$CURRENT.createdAt" } } },
            account: {
              $sum: {
                $cond: { if: { "$eq": ["$isAccount", true] }, then: 1, else: 0 }
              }
            },
            wallet: {
              $sum: {
                $cond: { if: { "$eq": ["$isAccount", false] }, then: 1, else: 0 }
              }
            },
            all: { $sum: 1 }
          }
        }
      ])
      return this.successResponse("Query successful", income)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processAccountOpenedByReferralByDateRange = async (req) => {
    const { startDate, endDate, dayRange } = req.body;
    const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };
    let format = "%Y-%m";
    let groupBy: any = { $month: "$createdAt" };
    if (dayRange) {
      groupBy = { $dayOfYear: "$createdAt" };
      format = "%Y-%m-%d";
    }
    try {
      const accounts = await User.aggregate([
        { $match: query },
        {
          $group: {
            _id: groupBy,
            date: { $first: { $dateToString: { format, date: "$$CURRENT.createdAt" } } },
            nonReferredAccount: {
              $sum: {
                $cond: {
                  if: {
                    "$or": [
                      { "$eq": ["$referrer", ""] },
                      { "$ifNull": ['$referrer', false] },
                    ]
                  }, then: 1, else: 0
                }
              }
            },
            all: { $sum: 1 }
          }
        }
      ])
      return this.successResponse("Query successful", accounts)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processGlobalUserWallet = async (req): Promise<any> => {
    try {

      const { startDate, endDate } = req.body;
      const query = { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } };

      query["isAccount"] = false;
      const transactionCategory = await User.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$wallet.balance"
            },
            count: {
              $sum: 1
            },

          }
        }
      ])
      return this.successResponse("Global Wallet fetched", transactionCategory)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }

  }

  public processGetUser = async (user, query, metaData) => {

    let projection;
    if (!query.full) {
      projection = {
        personalInfo: 0, contactInfo: 0, nextOfKinInfo: 0, empolymentInfo: 0, meansOfIdentification: 0,
        proofOfAddress: 0
      }
    }
    delete query?.full
    try {
      for (const [key, value] of Object.entries(query)) {
        query = { ...query, [key]: value };
      }
      query._id = Types.ObjectId(user._id);
      const geUser = await User.findOne(query, projection);
      if (!geUser) return this.failureResponse("No user found");
      return this.successResponse("User found", user)
    } catch (error) {
      return this.serviceErrorHandler(metaData, error)
    }
  }

  public processSearchUsers = async (req) => {
    const projection = {
      personalInfo: 0, contactInfo: 0, nextOfKinInfo: 0, empolymentInfo: 0, meansOfIdentification: 0,
      proofOfAddress: 0, pin: 0, password: 0, photoImage: 0
    }
    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    const options = { page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' }, projection };
    try {
      // @ts-ignore
      const users: any = await User.paginate({ fullName: { "$regex": req.body.fullName, $options: "i" } }, options);
      const data = {
        docs: users.docs,
        meta: {
          total: users.totalDocs,
          skipped: users.page * users.limit,
          perPage: users.limit,
          page: users.page,
          pageCount: users.totalPages,
          hasNextPage: users.hasNextPage,
          hasPrevPage: users.hasPrevPage,
        }
      }
      return this.successResponse("Users fetched", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processSearchUsersByMobile = async (req) => {
    try {
      const project = { mobileNumber: 1, fullName: 1 }
      const users: any = await User.find({ mobileNumber: { "$regex": req.body.mobileNumber, $options: "i" } }, project);
      return this.successResponse("Users fetched", users);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }


  public processGetUsers = async (req): Promise<IResponse> => {
    let { startDate, endDate, mobileNumber, source, fullName } = req.body;

    const query = {};

    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);

      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };
    }

    if (mobileNumber) query["mobileNumber"] = { "$regex": mobileNumber, $options: "i" };
    if (fullName) query["fullName"] = { "$regex": fullName, $options: "i" };
    if (source !== '' && source !== undefined) query["isAccount"] = source


    const options = {
      page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' },
      projection: { pin: 0, password: 0 }
    };

    try {
      // @ts-ignore
      const users: any = await User.paginate(query, options);
      const data = {
        docs: users.docs,
        meta: {
          total: users.totalDocs,
          skipped: users.page * users.limit,
          perPage: users.limit,
          page: users.page,
          pageCount: users.totalPages,
          hasNextPage: users.hasNextPage,
          hasPrevPage: users.hasPrevPage,
        }
      }
      return this.successResponse("Users fetched", data)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

  public processFetchAdmin = async (body, pathQuery, originalUrl, method, ip): Promise<IResponse> => {
    let { startDate, endDate, mobileNumber, status, fullName } = body;

    const query = { 'role': { "$nin": [null, "", "user"] } };

    let { limit, page } = pathQuery;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);

      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };
    }

    if (mobileNumber) query["mobileNumber"] = { "$regex": mobileNumber, $options: "i" };
    if (fullName) query["fullName"] = { "$regex": fullName, $options: "i" };
    if (status) query["admin.status"] = status

    console.log(query)

    const options = {
      page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' },
      projection: { fullName: 1, firstName: 1, middleName: 1, lastName: 1, mobileNumber: 1, role: 1, admin: 1, gender: 1, createdAt: 1 }
    };

    try {
      // @ts-ignore
      const users: any = await User.paginate(query, options);
      const data = {
        docs: users.docs,
        meta: {
          total: users.totalDocs,
          skipped: users.page * users.limit,
          perPage: users.limit,
          page: users.page,
          pageCount: users.totalPages,
          hasNextPage: users.hasNextPage,
          hasPrevPage: users.hasPrevPage,
        }
      }
      return this.successResponse("Admin fetched", data)
    } catch (error) {
      return this.serviceErrorHandler({ originalUrl, method, ip }, error)
    }
  };

  public processCurrentlyLoggedInUsers = async (req): Promise<IResponse> => {
    const obj = req.body;
    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;
    const options = {
      page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' },
      projection: { mobileNumber: 1, fullName: 1, firstName: 1, auth: 1, currentLogin: 1 }
    };

    try {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 1);

      let query = { 'auth.accessToken': { "$nin": [null, ""] }, 'role': { "$nin": [null, "", "user"] }, 'currentLogin': { $gt: currentDate } };
      for (const [key, value] of Object.entries(obj)) {
        query = { ...query, [key]: value };
      }
      // @ts-ignore
      const users: any = await User.paginate(query, options);
      const data = {
        docs: users.docs,
        meta: {
          total: users.totalDocs,
          skipped: users.page * users.limit,
          perPage: users.limit,
          page: users.page,
          pageCount: users.totalPages,
          hasNextPage: users.hasNextPage,
          hasPrevPage: users.hasPrevPage,
        }
      }
      return this.successResponse("Users fetched", data)
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  };

  protected validateSecureUserLogin = async (user: any, mobileNumber: string, xPassword: string, secQstnAns) => {
    if (!this.isEligible(user)) return this.failureResponse("User account not active");
    const { password, role, currentLogin: pastLogin, secQuestion } = user;
    const isValidPassword = await bcrypt.compare(xPassword, password);
    if (!isValidPassword) return this.failureResponse("Invalid username/password");
    const formatSecAns = secQstnAns.trim().toLowerCase()
    const isMatch = await bcrypt.compare(formatSecAns, secQuestion.value);
    if (!isMatch) return this.failureResponse("Answer to security question did not match");
    const body = JSON.stringify({ mobileNumber, role, _id: user._id });
    const accessToken = jwt.sign({ user: body }, JWT_SECRET, { expiresIn: '1d' });
    const lastLogin = pastLogin;
    const currentLogin = new Date();
    const updatedUser: any = await User.findOneAndUpdate({ mobileNumber }, {
      auth: { accessToken, kind: 'Bearer' }, lastLogin, currentLogin
    }, {
      new: true, projection: {
        pin: 0, password: 0, personalInfo: 0, contactInfo: 0, nextOfKinInfo: 0, empolymentInfo: 0,
        meansOfIdentification: 0, proofOfAddress: 0
      }
    });
    return this.successResponse(null, updatedUser);
  }

  public processSecureLogin = async (reqDetails, body) => {
    const { mobileNumber, password: xPassword, secQstnAns } = body;
    try {
      const user: any = await User.findOne({ mobileNumber });
      if (!user) return this.failureResponse("User not found");
      const validateUserLogin = await this.validateSecureUserLogin(user, mobileNumber, xPassword, secQstnAns);
      const { message, status, data } = validateUserLogin;
      if (status === false) return this.failureResponse(message)
      return this.successResponse("User logged in successfully", data);
    } catch (error) {
      return this.serviceErrorHandler(reqDetails, error);
    }
  };

  public processAdminLogout = async (req) => {
    const { mobileNumber } = req.body;
    try {
      await User.findOneAndUpdate({ mobileNumber }, {
        auth: { accessToken: null, kind: '' }
      })
      return this.successResponse("User logged out successfully");
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };

  public processAdminLogin = async (req) => {

    const { headers, url, method, ip } = req;

    try {
      const { mobileNumber, password: xPassword } = req.body
      const user: any = await User.findOne({ mobileNumber });
      if (!user) return this.failureResponse("User not found");
      if (!user.admin || user.admin.status !== "approved") return this.failureResponse("Admin Request awaiting approval");
      const userRole: any = await Role.findOne({ role: user.role })
      if (!userRole) return this.failureResponse("User not an admin")
      const validateUserLogin = await this.validateUserLogin(user, mobileNumber, xPassword);
      const { message, status, data } = validateUserLogin;
      if (status === false) return this.failureResponse(message)
      await Audit.create({
        username: user.fullName,
        firstName: user.firstName,
        action: 'LOGIN',
        method,
        mobileNumber,
        ip,
        url,
        systemUsed: headers['user-agent']
      });
      return this.successResponse("Admin logged in successfully", { user: data, permissions: userRole });
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }

  }


  public processUserAddressVerification = async (req) => {
    try {
      const { body, hostname } = req;
      const { mobileNumber } = body;

      let addressVerificationHeader = await this.assignHeader(hostname);

      const user: any = await User.findOne({ mobileNumber });
      console.log(user)
      if (user.isAddressVerified && user.isAddressVerified.status === true) return this.successResponse('User already verified', user.isAddressVerified)
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}verify/submitAddressVerification`, req.body, addressVerificationHeader, "POST", hostname);
      const responseData = await response.json();

      const { status, data, message } = responseData;
      if (status !== true) return this.failureResponse(message);
      await this.storeInformation("create", data.reference, data, "address")
      await User.updateOne({ mobileNumber: req.body.mobileNumber }, { $set: { isAddressVerified: { verificationStarted: true, date: new Date().toDateString() } } });
      return this.successResponse("Data submitted for address verification", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processNINVerification = async (req) => {
    console.log(RUBIKPAY_VAS_URL)
    try {
      const { body, hostname } = req;

      const { mobileNumber, ...rest } = body;

      let ninVerificationHeader = await this.assignHeader(hostname);

      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}verify/ninNumberVerification`, rest, ninVerificationHeader, "POST", hostname)
      const responseData = await response.json();

      const { status, data, message } = responseData;
      if (status !== true) return this.failureResponse(message);
      if (data.fieldMatches.lastname === false) return this.failureResponse("Name doesn't match");
      await User.updateOne({ mobileNumber }, { $set: { isNINVerified: true } });
      return this.successResponse("NIN Verification completed", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }


  public processNINVerificationByMobileNumber = async (req) => {
    try {
      const { mobileNumber } = req.body;
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}verify/ninPhoneVerification`, req.body, this.rubikPayVASHeaders, "POST", req.hostname)
      const responseData = await response.json();

      const { status, data, message } = responseData;
      if (status !== true) return this.failureResponse(message);
      if (data.fieldMatches.lastname === false) return this.failureResponse("Name doesn't match");
      await User.updateOne({ mobileNumber }, { $set: { isNINVerified: true } });
      return this.successResponse("NIN Verification completed", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processDriverLicenseVerification = async (req) => {
    try {
      const { body, hostname } = req;

      const { mobileNumber, ...rest } = body;

      let driverLicenseVerificationHeader = await this.assignHeader(hostname);

      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}verify/driverLicenseVerification`, rest, driverLicenseVerificationHeader, "POST", hostname)
      const responseData = await response.json();

      const { status, data, message } = responseData;
      if (status !== true) return this.failureResponse(message);
      if (data.fieldMatches.lastname === false) return this.failureResponse("Name doesn't match");
      await User.updateOne({ mobileNumber }, { $set: { isDriverLicenseVerified: true } });
      return this.successResponse("Driver License verification completed", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processUserAddressVerificationNifty = async (req) => {
    try {
      const { body, hostname } = req;
      let addressVerificationHeader = await this.assignHeader(hostname);
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}verify/verifyAddressRequest`, body, addressVerificationHeader, "POST", hostname)
      const responseData = await response.json();
      const { status, data, message } = responseData;
      if (status !== true) return this.failureResponse(message);
      await this.storeInformation("create", data.reference, data, "address")
      return this.successResponse("Data submitted for address verification", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processUserGuarantorVerification = async (req) => {

    try {
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}verify/submitGuarantorVerification`, req.body, this.rubikPayVASHeaders, "POST", req.hostname)
      const responseData = await response.json();

      const { status, data, message } = responseData;
      if (status !== true) return this.failureResponse(message);
      // await User.updateOne({ mobileNumber: req.body.mobileNumber }, { $set: { isAddressVerified: { verificationStarted: true, date: new Date().toDateString() }  } });
      await this.storeInformation("create", data.id, data, "guarantor")
      return this.successResponse("Data submitted for address verification", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }


  public processWebHookData = async (req) => {
    try {
      const { data, type } = req.body
      // await User.updateOne({ mobileNumber: req.body.mobileNumber }, { $set: { isAddressVerified: { verificationStarted: true, date: new Date().toDateString() }  } });
      await this.storeInformation("update", data.id, data, type)
      return this.successResponse("Verification Details received", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }


  async storeInformation(databaseAction: string, reference: any, data: any, type?: string,) {
    try {
      if (databaseAction === "create") {
        const body = {
          type: type,
          reference,
          isCancelled: false,
          isVerified: false,
          userDetail: data,
          verifiedDetail: {}
        };
        const createVerification = await Verification.create(body);
        return createVerification;
      } else {
        if (databaseAction === "cancel") {
          const cancelReq = await Verification.updateOne({ type }, {
            $set: {
              isCancelled: true,
            }
          })
          return cancelReq;
        } else if (databaseAction === "update") {
          console.log(type, type, reference)
          const updateVerification = await Verification.updateOne({ type, reference }, {
            $set: {
              isVerified: true,
              verifiedDetail: data
            }
          });
          return updateVerification;
        }
      }
    } catch (error) {
      return { code: 500, message: error, data: null }
    }
  }


}
