import { config } from "secreta";
const { ACCION_API_URL } = config;

import User from '../user/user.model';
import { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import { IResponse } from './account.interface';
// import { UniversalsService } from '../../@core/common/universals. service';
// import OTP from '../user/otp.model';
import { BaseAccountService } from './baseAccount.service';
import { EmailService } from '../email/email.service';
import Reward from './reward.model';
import credentialHistory from "../user/credentials.model";


export class AccountService extends BaseAccountService {

  public securityQuestions = async () => {
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
    return this.successResponse("Fetched security questions", data);
  }

  public walletUpdate = async (metaData, body) => {
    const { creditAccount: mobileNumber, amount } = body;
    try {
      const beneficiary: any = await User.findOneAndUpdate({ mobileNumber },
        { $inc: { 'wallet.balance': amount * 100, 'wallet.ledgerBalance': amount * 100 } });
      if (!beneficiary) return this.failureResponse("Beneficiary not found")
      return this.successResponse(null, beneficiary)
    } catch (error) {
      return await this.serviceErrorHandler(metaData, error);
    }
  }



  public processWalletToAccountTransfer = async (metaData, body) => {
    const { ip, hostname, method, url } = metaData;
    const { amount, mobileNumber, bill, channel, product, narration, creditAccount, beneficiaryName } = body;
    try {
      const isAllowed = await this.processUser({ userId: "", body, metaData });
      const { status, message, data } = isAllowed;
      if (!status) return this.failureResponse(message);
      const isSuccess = await this.debitAccount(metaData, body, data.reference);
      const { status: _status, message: _message, data: _data } = isSuccess;
      if (_status == false) return this.failureResponse(_message);
      const creditWallet = await this.walletUpdate(metaData, body);
      const { status: xStatus, message: xMessage, data: receiverData } = creditWallet;
      if (xStatus == true) {
        const { firstName, lastName, email, reference } = data;
        const senderData = { firstName, lastName, email, reference }
        this.receiverTransactionHistory(receiverData._id, false, { body: mobileNumber, amount, product, channel, narration, accountNumber: beneficiaryName(creditAccount) }, senderData, "Bank-Wallet Transfer");

        return this.successResponse(message);
      };
      await this.refundAccount(_data.data, data.reference, amount, mobileNumber, bill, { body: { channel }, ip, hostname, method, url });
      return this.failureResponse(xMessage)
    } catch (error) {
      return this.serviceErrorHandler(metaData, error)
    }
  }
  public processAccountUpgrade = async (req, body) => {
    try {
      let { personalInfo, contactInfo, nextOfKinInfo, employmentInfo, meansOfIdentification, channel,
        proofOfAddress, kycTier } = body;

      nextOfKinInfo = nextOfKinInfo || { contactInfo: {} };
      meansOfIdentification = meansOfIdentification || { url: "" };
      proofOfAddress = proofOfAddress || { url: "" }
      const { contactInfo: contactDetails, ...rest } = nextOfKinInfo;
      const { url, ..._meansOfIdentification } = meansOfIdentification;
      const { url: _url, ..._proofOfAddress } = proofOfAddress;
      const user: any = await User.findOne({ mobileNumber: contactInfo.mobileNumber1 })
      if (!user || user?.accountNumber.length < 1) return this.failureResponse("User was not found");
      const reqBody = {
        personalInfo, contactInfo, nextOfKinInfo: { ...rest, contactInfo: contactDetails }, employmentInfo, meansOfIdentification: _meansOfIdentification,
        proofOfAddress: _proofOfAddress, kycTier, branchCode: "NG0010074"
      };
      const updateAccount = `${ACCION_API_URL}/account/upgrade`;
      const response = await this.apiCall(updateAccount, reqBody, await this.setHeader(channel), "POST", req.hostname);
      const responseData = await response.json();
      console.log(responseData, "responseDataresponseDataresponseData");

      if (responseData.responseCode !== "00") return this.failureResponse(responseData.responseDescription, responseData);
      const updatedUser = await User.updateOne({ mobileNumber: contactInfo.mobileNumber1 }, body);
      if (!updatedUser) return this.failureResponse("Update failed");
      return this.successResponse("Account upgraded successfully");
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public processCreateSaveBrigtha = async (req): Promise<IResponse> => {
    const { body, hostname } = req;
    let { bvn, firstName, lastName, referrer, middleName, gender, dateOfBirth, street, city, state,
      mobileNumber, photoImage, signatureImage, userId, emailAddress, channel, searchByAccountNumber,
      accountNumba, personalInfo, employmentInfo
    } = body;
    const { maritalStatus } = personalInfo; const { employmentStatus } = employmentInfo;

    const reqBody = {
      firstName, middleName, lastName, gender, dateOfBirth, street, city, state, mobileNumber, photoImage,
      signatureImage, bvn, branchCode: "NG0010068", productCode: "14", referrer, emailAddress, searchByAccountNumber,
      accountNumber: accountNumba, maritalStatus, employmentStatus
    }
    try {
      // const isUser = await this.isUser(phone)
      // if (isUser.status) return this.failureResponse("User was not found");
      const openAccount = `${ACCION_API_URL}/account/openonline`;
      const response = await this.apiCall(openAccount, reqBody, await this.setHeader(channel), "POST", hostname);
      const responseData = await response.json();
      if (responseData.responseCode !== "00") {
        return this.failureResponse(`Account was not created - ${responseData.responseDescription}`, responseData);
      }
      const _id = Types.ObjectId(userId);
      const newUser: any = await User.updateOne({ _id }, { $push: { accountNumber: responseData.accountNumber } });
      const { accountNumber, mobileNumber, createdAt } = newUser;
      new EmailService().zohoMail(req, emailAddress, "SaveBrigtha1&2", { user: firstName, accountNumber }, `${firstName}, Welcome to the Brighta side!!!`)
      return this.successResponse("Account created successfully", { accountNumber, mobileNumber, createdAt });
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public processReferralReward = async (req, referredFirstName, referredLastName, referredMobileNumber, referrerMobileNumber,
    referrerAccountNumber, referrerUserId, channel, rewardType = "account opening", amount = 100) => {
    try {
      const reqBody = {
        branchCode: "NG0010001", amount, debitCurrency: "NGN", creditAccount: referrerAccountNumber,
        narration: "SB Referral benefit", transRef: this.createRef("ref-"), charges: 0.00
      };
      const accionCBA = `${ACCION_API_URL}/payment/rewardReferral`;
      const response = await this.apiCall(accionCBA, reqBody, await this.setHeader(channel), "POST", req.hostname);
      const responseData = await response.json();
      if (responseData.responseCode !== "00") {
        await Reward.create({
          referredFirstName, referredLastName, referredMobileNumber, referrerMobileNumber,
          referrerAccountNumber, referrerUserId, rewardType, channel, amount, status: false, reason: responseData.responseDescription
        })
        return this.failureResponse(responseData.responseDescription, responseData);
      }
      const reward = await Reward.create({
        referredFirstName, referredLastName, referredMobileNumber, referrerMobileNumber,
        referrerAccountNumber, referrerUserId, rewardType, channel, amount, status: true
      })
      return this.successResponse("Reward sent", reward);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }


  public openAccount = async (req): Promise<IResponse> => {
    const { body, hostname } = req;
    const openAccount = `${ACCION_API_URL}/account/openonline`;
    let { emailAddress, newCustomer, bvn, firstName, lastName, mobileNumber: phone, referrer, referrerAccountNumber,
      referralUserId, channel, middleName, gender, dateOfBirth, street, city, state, mobileNumber, photoImage, signatureImage,
      pin, password, secQuestion, kycTier, searchByAccountNumber, accountNumba, personalInfo, employmentInfo } = body;
    const { maritalStatus } = personalInfo; const { employmentStatus } = employmentInfo;
    const reqBody = {
      firstName, middleName, lastName, gender, dateOfBirth, street, city, state, mobileNumber, photoImage,
      signatureImage, bvn, branchCode: "NG0010068", productCode: "14", referrer, emailAddress, searchByAccountNumber,
      accountNumber: accountNumba, maritalStatus, employmentStatus, kycTier
    }
    try {
      const verifiedUser = await this.verifyUser(req);
      // console.log(verifiedUser, "verifiedUser");
      if (verifiedUser !== true) return verifiedUser;
      let responseData;
      if (newCustomer && bvn !== "") {
        const response = await this.apiCall(openAccount, reqBody, await this.setHeader(channel), "POST", hostname);
        responseData = await response.json();
        if (responseData.responseCode !== "00") {
          return this.failureResponse(`Account was not created - ${responseData.responseDescription}`, responseData);
        }
        if (!referrer || referrer != "") {
          this.processReferralReward(req, firstName, lastName, phone, referrer, referrerAccountNumber, referralUserId, channel)
        }
      } else if (newCustomer && bvn === "") {
        if (emailAddress === "") return this.failureResponse("Provide email address");
        body.wallet = { balance: 0, ledgerBalance: 0, denomination: "kobo", isLocked: false };
        body.isAccount = false;
      } else if (!newCustomer && body.accountNumber && body.accountNumber.length === 0) {
        return this.failureResponse("Provide account number");
      }
      body.transactionsData = { date: new Date().toDateString(), cummulativeDailyTransaction: 0 };
      body.fullName = `${firstName} ${middleName} ${lastName}`
      body.qrCode = await this.getBaseUserRandomNumber();
      body.pin = await bcrypt.hash(pin, 10);
      body.password = await bcrypt.hash(password, 10);
      body.secQuestion = { key: secQuestion.key, value: await bcrypt.hash(secQuestion.value.trim().toLowerCase(), 10) };
      body.accountNumber = responseData ? responseData.accountNumber : body.accountNumber;
      body.kycTier = kycTier || 3;
      const newUser: any = await User.create(body);
      const { accountNumber, mobileNumber, wallet, createdAt, _id } = newUser;
      credentialHistory.create({
        mobileNumber, userId: _id, credentialHistory: [{
          password: body.password,
          pin: body.pin
        }]
      })
      if (bvn) {
        new EmailService().zohoMail(req, emailAddress, "SaveBrigtha1&2", { user: firstName, accountNumber }, `${firstName}, Welcome to the Brighta side!!!`)
      } else if (!newCustomer) {
        new EmailService().zohoMail(req, emailAddress, "onboarding", { user: firstName }, `${firstName}, Welcome to the Brighta side!!!`)
      } else {
        const walletNumber = mobileNumber.substring(1)
        new EmailService().zohoMail(req, emailAddress, "walletAccount", { firstName, accountNumber: walletNumber }, `${firstName}, Welcome to the Brighta side!!!`)
      }
      return this.successResponse("Account created successfully", { accountNumber, mobileNumber, wallet, createdAt });
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  // , referrerAccountNumber,referralUserId
  public processWalletToAccountUpgrade = async (req): Promise<IResponse> => {
    const openAccount = `${ACCION_API_URL}/account/openonline`;
    const { firstName, middleName, lastName, gender, dateOfBirth, street, city, state, mobileNumber, photoImage,
      signatureImage, bvn, emailAddress, referrer, channel, searchByAccountNumber, accountNumba,
      personalInfo, employmentInfo } = req.body;
    const { maritalStatus } = personalInfo; const { employmentStatus } = employmentInfo;
    const obj = {
      firstName, middleName, lastName, gender, dateOfBirth, street, city, state, mobileNumber, photoImage,
      signatureImage, bvn, emailAddress, referrer, productCode: "14", branchCode: "NG0010068", searchByAccountNumber,
      accountNumber: accountNumba, maritalStatus, employmentStatus, kycTier: 1
    }

    try {
      const isUser = await this.isUser(mobileNumber);
      const { status, data } = isUser;
      if (status !== true) return this.failureResponse("User was not found");
      const response = await this.apiCall(openAccount, obj, await this.setHeader(channel), "POST", req.hostname);
      const responseData = await response.json();
      const { responseCode, responseDescription, accountNumber: accountNumba } = responseData;
      if (responseCode !== "00") {
        return this.failureResponse(`Account was not created - ${responseDescription}-${accountNumba}`, responseData);
      }
      const accountNumber = responseData.accountNumber;
      if (accountNumber) {
        await User.updateOne({ mobileNumber }, { accountNumber: [accountNumber], isAccount: true });
        req.body.customerAmount = data.wallet.balance / 100;
        req.body.creditAccount = accountNumber;
        req.body.narration = "Migrated wallet balance to SaveBrigtha account"
        if (req.body.customerAmount > 0) {
          const { responseCode } = await this.walletFundTransfer(req);
          if (responseCode !== "00") return this.failureResponse("Account created successfully, wallet transfer failed");
        }
        await User.updateOne({ mobileNumber }, { accountNumber: [accountNumber], isAccount: true, bvn, $unset: { wallet: "" } });
        new EmailService().zohoMail(req, emailAddress, "SaveBrigtha1&2", { firstName, accountNumber }, `${firstName}, Welcome to the Brighta side!!!`)
        return this.successResponse("Account created successfully", { accountNumber, mobileNumber });
      } else {
        return this.failureResponse(null, "Account number was not generated");
      }
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }


  //   public processWalletToAccountUpgradeV2 = async (req): Promise<IResponse> => {
  //     const openAccount = `${ACCION_API_URL}/account/openonline`;
  //     const { firstName, middleName, lastName, gender, dateOfBirth, street, city, state, mobileNumber, photoImage,
  //       signatureImage, bvn, emailAddress, referrer, channel, searchByAccountNumber, accountNumba,
  //       personalInfo, employmentInfo } = req.body;

  //     const { maritalStatus } = personalInfo; const { employmentStatus } = employmentInfo;

  //     const obj = {
  //       firstName, middleName, lastName, gender, dateOfBirth, street, city, state, mobileNumber, photoImage,
  //       signatureImage, bvn, emailAddress, referrer, productCode: "14", branchCode: "NG0010068", searchByAccountNumber,
  //       accountNumber: accountNumba, maritalStatus, employmentStatus, kycTier: "1"
  //     }

  //     try {
  //       const isUser = await this.isUser(mobileNumber);
  //       const { status, data } = isUser;
  //       if (status !== true) return this.failureResponse("User was not found");
  //       const response = await this.apiCall(openAccount, obj, await this.setHeader(channel), "POST");
  //       const responseData = await response.json();
  //       if (responseData.responseCode !== "00") {
  //         return this.failureResponse(`Account was not created - ${responseData.responseDescription}`, responseData);
  //       }
  //       const accountNumber = responseData.accountNumber;
  //       if (accountNumber) {
  //         await User.updateOne({ mobileNumber }, { accountNumber: [accountNumber], isAccount: true });
  //         req.body.customerAmount = data.wallet.balance / 100;
  //         req.body.creditAccount = accountNumber;
  //         req.body.narration = "Migrated wallet balance to SaveBrigtha account"
  //         if (req.body.customerAmount > 0) {
  //           const { responseCode } = await this.walletFundTransfer(req);
  //           // if (responseCode !== "00") return this.failureResponse("Account created successfully, wallet transfer failed");
  //           if (responseCode !== "00") {
  // this.processReferralReward(req,firstName,lastName,mobileNumber,referrer,)
  //           }

  //         }
  //         if (referrer !== "") {

  //         }
  //         await User.updateOne({ mobileNumber }, { accountNumber: [accountNumber], isAccount: true, bvn, $unset: { wallet: "" } });
  //         new EmailService().zohoMail(req, emailAddress, "SaveBrigtha1&2", { firstName, accountNumber }, `${firstName}, Welcome to the Brighta side!!!`)
  //         return this.successResponse("Account created successfully", { accountNumber, mobileNumber });
  //       } else {
  //         return this.failureResponse(null, "Account number was not generated");
  //       }
  //     } catch (error) {
  //       return await this.serviceErrorHandler(req, error);
  //     }
  //   }


  public checkAccountBalance = async (req): Promise<IResponse | any> => {
    const { accountNumber, channel } = req.query;
    try {
      const reqBody = { accountNumber, tranRef: this.createRef() };
      const openAccount = `${ACCION_API_URL}/account/balance`;
      const response = await this.apiCall(openAccount, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      if (typeof responseData !== "object" || responseData.responseCode !== "00" || responseData.accountNumber === "INVALID ACCOUNT! Check lenght") {
        return { statusCode: 400, status: false, message: "Account was not found", data: null }
      }
      return { statusCode: 200, status: true, message: "Success", data: responseData };
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public fundTransfer = async (req): Promise<IResponse> => {
    delete req.body.beneficiaryName; delete req.body.userId; delete req.body.channel;
    try {
      const transferData = {
        ...req.body,
        debitCurrency: "NGN",
        debitValueDate: "yyyyMMdd",
        transRef: this.createRef(),
        branchCode: "NG0010001",
        creditValueDate: "yyyyMMdd",
        charges: 0.00,
        validate: false,
      }
      const localTransfer = `${ACCION_API_URL}/payment/localtransfer`;
      const response = await this.apiCall(localTransfer, transferData, await this.setHeader(req.body.channel), "POST", req.hostname);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processTransfer = async (req): Promise<IResponse> => {
    const { userId } = req.body;
    try {
      const isAllowed = await this.processUser(req);
      const { status, message, data } = isAllowed;
      if (!status) return this.failureResponse(message);
      const { reference } = data;
      await this.logTxnPinMatched(reference, "Pin matched, calling CBA", userId, "Accion2Accion transfer");
      const transferRes = await this.fundTransfer(req);
      const { responseCode, responseDescription } = transferRes;
      if (responseCode !== "00") {
        await this.logTxnFailed(reference, { message: responseDescription, transferRes }, userId,
          "Accion2Accion transfer", "Transfer failed");
        return this.failureResponse("Transfer failed", transferRes);
      };
      await this.logTxnSuccessful(reference, "Accion MFB", { message: responseDescription, data: transferRes }, userId,
        "Accion2Accion transfer", false);
      return this.successResponse("Transfer was successful", transferRes);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }


  // public processScheduleTransfer = async (req): Promise<IResponse> => {
  //   const { userId, scheduleTime } = req.body;
  //   try {
  //     const isAllowed = await this.processUser(req);
  //     const { status, message, data } = isAllowed;
  //     if (!status) return this.failureResponse(message);
  //     const { reference } = data;
  //     await this.logTxnPinMatched(reference, "Pin matched, calling CBA", userId, "Accion2Accion transfer");
  //     const transferRes = await this.fundTransfer(req);
  //     const { responseCode, responseDescription } = transferRes;
  //     if (responseCode !== "00") {
  //       await this.logTxnFailed(reference, { message: responseDescription, transferRes }, userId,
  //         "Accion2Accion transfer", "Transfer failed");
  //       return this.failureResponse("Transfer failed", transferRes);
  //     };
  //     await this.logTxnSuccessful(reference, "Accion MFB", { message: responseDescription, data: transferRes }, userId,
  //       "Accion2Accion transfer", false);
  //     return this.successResponse("Transfer was successful", transferRes);
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error);
  //   }
  // }

  public customerDetails = async (req): Promise<any> => {
    const { accountNumber, channel } = req.query;
    try {
      const reqBody = { nubanAccountNumber: accountNumber, tranRef: this.createRef() };
      const openAccount = `${ACCION_API_URL}/customer/details`;
      const response = await this.apiCall(openAccount, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }

  public accountDetails = async (req): Promise<any> => {
    const { accountNumber, channel } = req.query;
    try {
      const openAccount = `${ACCION_API_URL}/account/details`;
      const reqBody = { accountNumber, tranRef: this.createRef() };
      const response = await this.apiCall(openAccount, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }



  // public processGetRewards = async (req) => {

  //   let { referredMobileNumber, referrerMobileNumber, status } = req.body;

  //   const query = {};


  //   let { limit, page } = req.query;
  //   limit = Number(limit) || 10;
  //   page = Number(page) || 1;

  //   if (referredMobileNumber) query["referredMobileNumber"] = { "$regex": referredMobileNumber, $options: "i" };
  //   if (referrerMobileNumber) query["referrerMobileNumber"] = { "$regex": referrerMobileNumber, $options: "i" };
  //   if (status) query["status"] = status


  //   const options = { page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' } };
  //   try {
  //     // @ts-ignore
  //     const rewards: any = await Reward.paginate(query, options);
  //     const data = {
  //       docs: rewards.docs,
  //       totalAmount: rewards.totalDocs * 100,
  //       meta: {
  //         total: rewards.totalDocs,
  //         skipped: rewards.page * rewards.limit,
  //         perPage: rewards.limit,
  //         page: rewards.page,
  //         pageCount: rewards.totalPages,
  //         hasNextPage: rewards.hasNextPage,
  //         hasPrevPage: rewards.hasPrevPage,
  //       }
  //     }
  //     return this.successResponse("Rewards fetched", data)
  //   } catch (error) {
  //     return await this.serviceErrorHandler(req, error);
  //   }
  // }

  public processGetUserRewards = async (req) => {
    const obj = req.body;

    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    const options = { page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' } };
    try {
      let query = {};
      for (const [key, value] of Object.entries(obj)) {
        query = { ...query, [key]: value };
      }
      // @ts-ignore
      const rewards: any = await Reward.paginate(query, options);
      const data = {
        docs: rewards.docs,
        totalAmount: rewards.totalDocs * 100,
        meta: {
          total: rewards.totalDocs,
          skipped: rewards.page * rewards.limit,
          perPage: rewards.limit,
          page: rewards.page,
          pageCount: rewards.totalPages,
          hasNextPage: rewards.hasNextPage,
          hasPrevPage: rewards.hasPrevPage,
        }
      }
      return this.successResponse("Rewards fetched", data)
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }



  public processGetAllRewards = async (req) => {
    let { startDate, endDate, referredMobileNumber, referrerMobileNumber, status } = req.body;

    const query = {};


    let { limit, page } = req.query;
    limit = Number(limit) || 10;
    page = Number(page) || 1;

    if (startDate) {
      endDate = await endDate ? new Date(endDate) : new Date();
      const incrementedEndDate: any = new Date(endDate.getTime() + 86400000);
      query['createdAt'] = { $gte: new Date(startDate), $lt: new Date(incrementedEndDate) };
    }

    if (referredMobileNumber) query["referredMobileNumber"] = { "$regex": referredMobileNumber, $options: "i" };
    if (referrerMobileNumber) query["referrerMobileNumber"] = { "$regex": referrerMobileNumber, $options: "i" };
    if (status !== '' && status !== undefined) query["status"] = status


    const options = { page, limit, sort: { createdAt: 'desc' }, collation: { locale: 'en' } };
    try {
      // @ts-ignore
      const rewards: any = await Reward.paginate(query, options);
      const data = {
        docs: rewards.docs,
        totalAmount: rewards.totalDocs * 100,
        meta: {
          total: rewards.totalDocs,
          skipped: rewards.page * rewards.limit,
          perPage: rewards.limit,
          page: rewards.page,
          pageCount: rewards.totalPages,
          hasNextPage: rewards.hasNextPage,
          hasPrevPage: rewards.hasPrevPage,
        }
      }
      return this.successResponse("Rewards fetched", data)
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  // public processAccountDeduction = async (req, reqBody): Promise<any> => {
  //   try {
  //     reqBody = { ...this.paymentData(), ...reqBody }
  //     console.log(reqBody, "reqBody");

  //     const buyAirtime = `${ACCION_API_URL}/payment/buyairtime`;
  //     const response = await this.apiCall(buyAirtime, reqBody, await this.getHeaders(), "POST")
  //     const responseData = await response.json();
  //     return responseData;
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error)
  //   }
  // }

  // public reverseTransfer = async (t24Reference): Promise<any> => {
  //   try {
  //     const reqBody = { t24Reference };
  //     const reverseTransaction = `${ACCION_API_URL}/payment/reverseft`;
  //     const response = await this.apiCall(reverseTransaction, reqBody, await this.getHeaders(), "POST")
  //     const responseData = await response.json();
  //     return responseData;
  //   } catch (error) {
  //     return { status: 500, message: "Internal server error", data: null }
  //   }
  // }

  public accountList = async (req): Promise<any> => {
    const { accountNumber, channel } = req.query;

    try {
      const reqBody = { accountNumber, tranRef: this.createRef() };
      const reverseTransaction = `${ACCION_API_URL}/account/list`;
      const response = await this.apiCall(reverseTransaction, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }

  public miniStatement = async (query, hostname): Promise<any> => {
    try {
      const { accountNumber, channel } = query;
      const reqBody = { accountNumber };
      const reverseTransaction = `${ACCION_API_URL}/account/ministatement`;
      const response = await this.apiCall(reverseTransaction, reqBody, await this.setHeader(channel), "POST", hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }

  public sendSMS = async (body): Promise<any> => {
    try {
      const reqBody = { ...body };
      const sendSMS = `${ACCION_API_URL}/sms/send`;
      const response = await this.apiCall(sendSMS, reqBody, await this.getHeaders(), "POST", "dont.send.com")
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }

  public nameEnquiry = async (req): Promise<any> => {
    try {
      const nameEnquiry = `${ACCION_API_URL}/nip/nameEnquiry`;
      const { channel, ...reqBody } = req.body;
      const response = await this.apiCall(nameEnquiry, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public verifyTransaction = async (req): Promise<any> => {
    try {
      const nameEnquiry = `${ACCION_API_URL}/payment/confirm`;
      const { channel, ...reqBody } = req.body;
      const response = await this.apiCall(nameEnquiry, reqBody, await this.setHeader(channel), "POST", req.body)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }

  public transactionHistory = async (req): Promise<any> => {
    try {
      const transactionHistory = `${ACCION_API_URL}/account/transactionhistory`;
      const { channel, ...reqBody } = req.body;
      const response = await this.apiCall(transactionHistory, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }

  public customerDetailsByMobile = async (req): Promise<IResponse> => {
    try {
      const byMobile = `${ACCION_API_URL}/customer/details/bymobileno`;
      const { channel, ...reqBody } = req.query;
      const response = await this.apiCall(byMobile, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      console.log(responseData, "responseDataresponseDataresponseData");

      if (typeof responseData !== "object" || responseData.responseCode !== "00") {
        return { statusCode: 400, status: false, message: "Customer details was not found", data: null }
      }
      return { statusCode: 200, status: true, message: "Customer details found", data: responseData };
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }


  public processListAccountByPhoneName = async (clientDetails, body) => {
    const { mobileNumber, channel, firstName, middleName, lastName } = body;
    const reqBody = { mobileNumber, firstName, middleName, lastName };
    try {
      const byMobile = `${ACCION_API_URL}/account/list/byphoneandname`;
      const response = await this.apiCall(byMobile, reqBody, await this.setHeader(channel), "POST", clientDetails.hostname)
      const responseData = await response.json();
      if (!Array.isArray(responseData) || responseData.length === 0 || responseData[0]?.responseCode !== "00") {
        return this.failureResponse("Customer account was not found");
      }
      return this.successResponse("Customer account found", responseData);
    } catch (error) {
      return this.serviceErrorHandler(clientDetails, error)
    }
  }


  public customerAccountsByMobile = async (req): Promise<IResponse> => {
    const { channel, ...reqBody } = req.query;

    try {
      const byMobile = `${ACCION_API_URL}/account/list/bymobileno`;
      const response = await this.apiCall(byMobile, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      console.log(responseData, "responseDataresponseDataresponseData122")
      if (!Array.isArray(responseData) || responseData.length === 0 || responseData[0]?.responseCode !== "00") {
        return this.failureResponse("Customer account was not found");
      }
      return this.successResponse("Customer account found", responseData);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public processNIPFee = async (clientDetails, body) => {
    const { amount, channel } = body;
    const reqBody = { amount };
    try {
      const byMobile = `${ACCION_API_URL}/nip/fees`;
      const response = await this.apiCall(byMobile, reqBody, await this.setHeader(channel), "POST", clientDetails.hostname)
      const responseData = await response.json();
      const { responseCode, responseMessage } = responseData;
      if (responseCode !== "00") return this.failureResponse(`${responseMessage || "Fee was not fetched"}`);
      return this.successResponse("Fee fetched", responseData);
    } catch (error) {
      return this.serviceErrorHandler(clientDetails, error)
    }
  }

  public nip = async (req): Promise<any> => {
    const { nameEnquiryRef, destinationInstitutionCode, beneficiaryAccountName, beneficiaryAccountNumber,
      beneficiaryBankVerificationNumber, beneficiaryKYCLevel, originatorAccountName, originatorAccountNumber,
      originatorBankVerificationNumber, originatorKYCLevel, transactionLocation, narration, amount, channel
    } = req.body
    const reqBody = {
      nameEnquiryRef, destinationInstitutionCode, channelCode: "1", beneficiaryAccountName,
      beneficiaryAccountNumber, beneficiaryBankVerificationNumber, beneficiaryKYCLevel, originatorAccountName,
      originatorAccountNumber, originatorBankVerificationNumber, originatorKYCLevel, transactionLocation, narration,
      paymentReference: this.createRef("NIP"), amount
    }
    try {
      const nip = `${ACCION_API_URL}/nip/fundstransfer`;
      const response = await this.apiCall(nip, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public processNIP = async (req): Promise<IResponse> => {
    const { userId } = req.body;
    try {
      const isAllowed = await this.processUser(req);
      const { status, message, data } = isAllowed;
      if (!status) return this.failureResponse(message);
      const { reference } = data;
      this.logTxnPinMatched(reference, "Pin matched, calling CBA", userId, "NIP transfer");
      const transferRes = await this.nip(req);
      const { responseCode, responseDescription } = transferRes;
      if (responseCode !== "00") {
        await this.logTxnFailed(reference, { message: responseDescription, transferRes }, userId,
          "NIP transfer", "Transfer failed");
        return this.failureResponse(`${responseDescription || "Transfer failed"}`, transferRes);
      };
      await this.logTxnSuccessful(reference, "Accion MFB", { message: `${responseDescription || "success"}`, data: transferRes }, userId,
        "NIP transfer", false);
      return this.successResponse("Transfer was successful", transferRes);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processGetBanks = async (req) => {
    try {
      let listOfBanks = await this.accionBankList(req);
      const { data, status } = listOfBanks;
      if (status === false) return this.failureResponse("Failed to fetch banks");
      return this.successResponse("Banks fetched", data);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }
  // private createWalletAccount = async (firstName, lastName, emailAddress, req) => {
  //   const reqBody = {
  //     accountName: `${firstName} ${lastName}`,
  //     accountReference: this.createRef(`${firstName}-`),
  //     currencyCode: "NGN",
  //     contractCode: MONNIFY_CONTRACT_CODE,
  //     customerName: `${firstName} ${lastName}`,
  //     customerEmail: `${emailAddress}`
  //   }
  //   try {
  //     const authRes = await this.auth();
  //     const responseData = await authRes.json();
  //     const token = await responseData.responseBody.accessToken;
  //     const createAccount = `${MONNIFY_URL}/bank-transfer/reserved-accounts`;
  //     const createAccountRes = await this.apiCall(createAccount, reqBody, { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, "POST")
  //     const data = await createAccountRes.json();
  //     const { requestSuccessful, responseMessage, responseBody } = data
  //     if (!requestSuccessful) return { statusCode: 400, status: false, message: responseMessage || "Could not create wallet account, try again later", data };
  //     return { balance: 0, ledgerBalance: 0, denomination: "kobo", isLocked: false, ...responseBody };
  //   } catch (error) {
  //     return await this.serviceErrorHandler(req, error);
  //   }
  // }


  private verifyUser = async (req) => {
    const { body } = req;
    const { mobileNumber, emailAddress } = body;
    try {
      // const otp: any = await OTP.findOne({ mobileNumber });
      // if (!otp || otp.ref !== body.ref) return this.failureResponse("Invalid ref/user phone number was not verified");
      const user: any = await User.findOne({ $or: [{ mobileNumber }, { emailAddress }] })
      if (user) return this.failureResponse("User already exists", { accountNumber: user.accountNumber[0] })
      return true
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

}
