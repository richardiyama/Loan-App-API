
import md5 from 'md5';
import uniqid from 'uniqid';
import { encode } from 'base-64';
import crypto from 'crypto';
import randomize from 'randomatic';
import { config } from 'secreta';
import moment from 'moment';
import fetch from 'node-fetch';
const { MONNIFY_URL, MONNIFY_USERNAME, MONNIFY_PASSWORD, ACCION_API_URL, RUBIKPAY_VAS_API_TEST, RUBIKPAY_VAS_API_LIVE } = config;
// const { ACCION_API_URL, RUBIKPAY_VAS_API_TEST, RUBIKPAY_VAS_API_LIVE } = config;

import logger from '../../util/logger/logger';
import User from '../../api/user/user.model';
import { IResponse } from '../../api/account/account.interface';
// import { AccountService } from '../../api/account/account.service';
import Transaction from '../../api/transaction/transaction.model';
import Audit from '../../api/audit/audit.model';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import BillCommission from '../../api/bills/billCommission.model';
import Notification from '../../api/notification/notification.model';
import { EmailService } from '../../api/email/email.service';
const { USERNAME, PASSWORD, SECRET_KEY } = config;
const { CBA_USER_M, CBA_PASS_M, CBA_KEY_M, CBA_USER_I, CBA_PASS_I, CBA_KEY_I } = config;



export class UniversalsService {
  rubikPayVASHeadersTest = { "Content-Type": "application/json", Authorization: RUBIKPAY_VAS_API_TEST };
  rubikPayVASHeaders = { "Content-Type": "application/json", Authorization: RUBIKPAY_VAS_API_LIVE };
  localLiveUrl = "http://localhost:7070"
  productionLiveUrl = "http://ibanking.accionmfb.com/"

  protected assignHeader = (hostname: any) => {
    return (hostname == "52.160.106.88") || (hostname == "api.accionmfb.com") ? this.rubikPayVASHeaders : this.rubikPayVASHeadersTest;
  }

  protected logAuditActivity = async (headers: any, url: string, method: string, ip: any, mobileNumber: string, action: string, pin?: string) => {
    const user: any = await User.findOne({ mobileNumber }, { firstName: 1, fullName: 1, pin: 1 });
    if (!user) return this.failureResponse("Not Authorized");
    if (pin) {
      const { pin: currentPin } = user;
      const isUserPassword = await bcrypt.compare(pin, currentPin);
      if (!isUserPassword) return this.failureResponse("Invalid credentials");
    }

    const { fullName, firstName } = user
    await Audit.create({
      username: fullName,
      firstName: firstName,
      action,
      method,
      mobileNumber,
      ip,
      url,
      systemUsed: headers['user-agent']
    });
    return this.successResponse('Action Registered', { fullName, firstName });
  }

  protected failureResponse = async (message?, data?): Promise<IResponse> => {
    return { statusCode: 400, status: false, message: message || "failed", data: data || null }
  }

  protected preconditionFailed = async (message?, data?): Promise<IResponse> => {
    return { statusCode: 412, status: false, message: message || "failed", data: data || null }
  }

  protected successResponse = async (message?, data?): Promise<IResponse> => {
    return { statusCode: 200, status: true, message: message || "Success", data }
  }

  protected apiCall = async (api, body, headers, method, hostname?, isXML?: boolean) => {
    try {
      let payLoad = { headers, method }
      if (isXML === true) {
        payLoad["body"] = body;
      } else {
        body ? payLoad["body"] = JSON.stringify(body) : payLoad;
      }
      console.log("lllll");
      const result = await fetch(api, payLoad);

      const { url, status, statusText } = result;

      if (hostname == "167.172.100.241" && (["4", "5"].includes(status.toString()[0]))) {
        await Notification.create({ url, statusText, status })
        await new EmailService().zohoMail({ api, body, headers, method }, "chekwubeudeogu@gmail.com", "failure-notification", { url, statusText, status }, "Failed API Alert");
      }
      return result;
    } catch (error) {
      this.serviceErrorHandler({ api, body, headers, method }, error)
    }
  }




  protected auth = async () => {
    try {
      const headers = {
        Authorization: 'Basic ' + encode(MONNIFY_USERNAME + ':' + MONNIFY_PASSWORD),
        'Content-Type': 'application/json',
      }
      console.log(headers, MONNIFY_URL, "kkkkkkkkkkkkkkk")
      const login = `${MONNIFY_URL}/auth/login`;
      const response = await this.apiCall(login, {}, headers, "POST")
      return response;
    } catch (error) {
      return { statusCode: 500, status: true, message: "An error occurred", data: null }
    }
  }

  private calculateHash = async (nonce, timeStamp) => {
    return crypto
      .createHash('sha512')
      .update(`${nonce}:${timeStamp}:${USERNAME}:${SECRET_KEY}`)
      .digest('hex');
  };

  protected getHeaders = async () => {
    const timeStamp = moment().format('YYYYMMDDHHmmss');
    const nonce = uniqid('Rubik-');
    const headers = {
      Authorization: `Basic ${encode(`${USERNAME}:${PASSWORD}`)}`,
      'Content-Type': 'application/json',
      SignatureMethod: 'SHA512',
      Accept: 'application/json',
      Timestamp: timeStamp,
      Nonce: nonce,
      Signature: await this.calculateHash(nonce, timeStamp),
    };
    return headers;
  };


  private calculateHashProd = async (nonce, timeStamp, username, key) => {
    return crypto
      .createHash('sha512')
      .update(`${nonce}:${timeStamp}:${username}:${key}`)
      .digest('hex');
  };

  private getHeadersProd = async (username, password, key) => {
    const timeStamp = moment().format('YYYYMMDDHHmmss');
    const nonce = uniqid('Rubik-');
    const headers = {
      Authorization: `Basic ${encode(`${username}:${password}`)}`,
      'Content-Type': 'application/json',
      SignatureMethod: 'SHA512',
      Accept: 'application/json',
      Timestamp: timeStamp,
      Nonce: nonce,
      Signature: await this.calculateHashProd(nonce, timeStamp, username, key)
    };
    return headers;
  };


  protected setHeader = async (channel) => {
    if (channel === "web") {
      return await this.getHeadersProd(CBA_USER_I, CBA_PASS_I, CBA_KEY_I);
    } else {
      return await this.getHeadersProd(CBA_USER_M, CBA_PASS_M, CBA_KEY_M);
    }
  }

  protected creditWallet = (wallet, amount) => {
    wallet.balance = ((wallet.balance * 1) + (amount * 1));
    return wallet;
  }
  protected getBaseUserRandomNumber = () => {
    return new Promise((resolve, _reject) => {
      const rd = randomize('A0', 6);
      // const cnt = 0;
      resolve(rd);
    });
  };

  protected serviceErrorHandler = async (req, error) => {
    const { originalUrl, method, ip, api } = req;
    logger.log('warn', `URL:${originalUrl} - METHOD:${method} - IP:${ip || api} - ERROR:${error}`);
    return { statusCode: 500, status: false, message: "Internal server error", data: null }
  }

  // NOTE: checks if the user is active, this method should be called for entry endpoints like login, resetPassword, e.t.c
  protected isEligible = (user: any): boolean => {
    if (user.status === 'ACTIVE') {
      return true;
    }
    return false;
  };

  protected isPostDebit = (wallet: any): boolean => {
    if (!wallet) return false;
    if (wallet.isLocked) return false;
    return true;
  };

  protected onePipeSignature = (requestRef, secretKey) => {
    const sig = md5(`${requestRef};${secretKey}`).toString();
    return sig;
  };

  protected createRef = (prefix?) => {
    return uniqid(prefix)
  }

  // private checkType = async (bill, authCode) => {
  //   if (bill) return bill;
  //   else if (authCode) return "fund-wallet";
  //   else return "transfer";
  // }

  private checkTransaction = async (bill, cardId) => {
    if (bill) return [bill, false, "VTPass"];
    else if (cardId) return ["fund-wallet", true, "PayStack"];
    else return ["transfer", false, "FW"]
  }

  // protected checkEmailTemplate = async (emailTemplate) => {
  //   let templates = ['otp', 'welcome', "reset"]
  //   let isTemplate = templates.some((el) => emailTemplate === el)
  //   return isTemplate
  // }

  protected walletFundTransfer = async (req): Promise<IResponse> => {
    const { customerAmount: amount, creditAccount, narration, channel } = req.body;
    try {
      const transferData = {
        branchCode: "NG0010001", amount, debitCurrency: "NGN", creditAccount, narration, transRef: this.createRef("ref-"),
        charges: 0.00
      };
      const localTransfer = `${ACCION_API_URL}/payment/walletTransfer`;
      const response = await this.apiCall(localTransfer, transferData, await this.setHeader(channel), "POST", req.hostname);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }


  private updateTransactionData = async (req, transactionsData, amount, userId, mobileNumber, transLimit, cummTransLimit, text, transLimitText, cummTransLimitText): Promise<IResponse> => {
    amount = Number(amount);
    try {
      if (amount > transLimit) return this.failureResponse(`Amount exceeds transaction limit (${transLimitText} naira) for your type of account. ${text}`)
      const today = new Date().toDateString();
      let query;
      if (userId) { const _id = Types.ObjectId(userId); query = { _id }; }
      else { query = { mobileNumber }; }
      const { date, cummulativeDailyTransaction } = transactionsData;
      if (today !== date) {
        await User.updateOne(query, { "transactionsData.date": new Date().toDateString(), "transactionsData.cummulativeDailyTransaction": amount })
        return this.successResponse();
      }
      if ((cummulativeDailyTransaction + amount) > cummTransLimit) return this.failureResponse(`Cummulative daily transaction limit (${cummTransLimitText} naira) exceeded. ${text}`);
      await User.updateOne(query, { $inc: { "transactionsData.cummulativeDailyTransaction": amount } })
      return this.successResponse()
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }


  // protected customerDetails = async (accountNumber): Promise<any> => {
  //   try {
  //     const reqBody = { nubanAccountNumber: accountNumber, tranRef: this.createRef() };
  //     const openAccount = `${ACCION_API_URL}/customer/details`;
  //     const response = await this.apiCall(openAccount, reqBody, await this.getHeaders(), "POST")
  //     const responseData = await response.json();
  //     return responseData;
  //   } catch (error) {
  //     return { status: 500, message: "Internal server error", data: null }
  //   }
  // }

  public customerDetails = async (accountNumber, channel, hostname): Promise<any> => {
    try {
      const reqBody = { nubanAccountNumber: accountNumber, tranRef: this.createRef() };
      const openAccount = `${ACCION_API_URL}/customer/details`;
      let response
      response = await this.apiCall(openAccount, reqBody, await this.setHeader(channel), "POST", hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return { status: 500, message: "Internal server error", data: null }
    }
  }


  protected updateTransactionLimit = async (req, userDetails, amount) => {
    const { transactionsData, isAccount, _id, mobileNumber, kycTier } = userDetails;
    let isAllowed: IResponse;
    try {
      if (!isAccount || kycTier === 1) {
        isAllowed = await this.updateTransactionData(req, transactionsData, amount, _id, mobileNumber, 30000000, 50000,
          "Upgrade to a SaveBrigtha account for more benefits", "3,000.00", "50,000.00");
      } else if (isAccount && kycTier === 2) {
        isAllowed = await this.updateTransactionData(req, transactionsData, amount, _id, mobileNumber, 100000000, 200000,
          "Upgrade your account for more benefits", "10,000.00", "200,000.00");
      } else if (isAccount || kycTier === 3) {
        isAllowed = await this.updateTransactionData(req, transactionsData, amount, _id, mobileNumber, 1000000000, 5000000,
          "Visit any AccionMFB branch near you for higher transactions", "100,000.00", "5,000,000.00");
      } else {
        isAllowed = { status: false, message: "Unknown tier", data: null, statusCode: 400 }
      }
      if (isAllowed.status === false) return this.failureResponse(isAllowed.message);
      return this.successResponse();
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  protected processUser = async ({ userId, body, metaData }) => {
    const reference = this.createRef("paybuddy-");
    let { amount, mobileNumber, pin, phone, channel, bill, accountNumber, beneficiaryName, product, narration,
      cardId, creditAccount, debitAccount, debitAccountNumber, customerAmount,
      beneficiaryAccountName, beneficiaryAccountNumber } = body;
    const user = await this.isUser(userId);
    // const {pin, cardId, ...rest}= body;
    // const requestData = {pin, cardId, ...body};
    // delete requestData.pin; delete requestData.channel; delete requestData?.cardId;
    const { message, status, data } = user;
    if (!status) return this.failureResponse(message);
    const { firstName, lastName, email, transactionPin, wallet } = data;
    const account = (accountNumber || beneficiaryAccountNumber || wallet.accountNumber) ? `${beneficiaryName || beneficiaryAccountName}(${accountNumber ||
      beneficiaryAccountNumber})` : null;
    const setData = await this.checkTransaction(bill, cardId)
    try {
      const transData = {
        userId,
        provider: setData[2],
        reference,
        type: setData[0],
        state: "incomplete",
        message: "Pin check failed",
        narration,
        amount: customerAmount || amount,
        product,
        channel,
        debitAccount: `${debitAccount || debitAccountNumber || mobileNumber?.substring("0") || null}`,
        sender: { fullName: `${firstName} ${lastName}`, email, mobileNumber },
        beneficiary: `${account || phone || creditAccount || userId}`,
        requestData: { pin: "", authorizationCode: "", ...body },
        isCredit: setData[1],
        data: [
          {
            note: "Checking transaction pin",
            context: bill,
            actor: mobileNumber
          }
        ]
      }

      await Transaction.create(transData);
      const isValidPin = await bcrypt.compare(pin, transactionPin);
      if (!isValidPin) {
        await this.logFailedWithoutComplete(reference, bill, mobileNumber, "Wrong PIN supplied");
        return this.failureResponse("Wrong PIN supplied");
      }
      // const isAllowed = await this.updateTransactionLimit(req, data, amount);
      // if (isAllowed.status === false) {
      //   await this.logFailedWithoutComplete(reference, bill, mobileNumber, isAllowed.message);
      //   return this.failureResponse(isAllowed.message)
      // };
      data.reference = reference;
      return this.successResponse(null, data);
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }


  protected debitAccount = async (metaData, body, reference): Promise<IResponse> => {
    const { amount, debitAccount, narration, channel, mobileNumber, bill } = body;
    const reqBody = {
      amount, "debitCurrency": "NGN", debitAccount, "debitValueDate": "yyyyMMdd", "creditValueDate": "yyyyMMdd",
      narration, "transRef": this.createRef("ref-"), "branchCode": "NG0010001"
    }
    try {
      const updateAccount = `${ACCION_API_URL}/payment/buyairtime`;
      const response = await this.apiCall(updateAccount, reqBody, await this.setHeader(channel), "POST", metaData.hostname);
      const responseData = await response.json();
      const { responseCode, responseDescription, paymentReference } = responseData;
      if (responseCode === "00") {
        return this.successResponse(null, paymentReference)
      } else {
        await this.logTxnDebitFailed(reference, mobileNumber, responseDescription, bill);
        return await this.failureResponse(`${responseDescription || "Unable to debit account"}`)
      }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  protected processAccountDeductionV2 = async (req, reqBody, serviceId: string, channel: string): Promise<any> => {
    try {
      const { amount } = reqBody

      serviceId = serviceId.trim()
      const billCom: any = await BillCommission.findOne({ serviceId });
      let charges: number = Number(amount)
      if (billCom && billCom.type === "percent") {
        charges = amount - (amount * billCom.commission)
      } else if (billCom && billCom.type === "flat") {
        charges = amount - billCom.commission;
      } else {
        charges = amount;
      }
      reqBody = { ...await this.paymentData(), charges: +(charges.toFixed(2)), ...reqBody };
      const buyAirtime = `${ACCION_API_URL}/payment/paybill`;
      const response = await this.apiCall(buyAirtime, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  protected processAccountDeductionV3 = async (req, reqBody, serviceId: string, channel: string): Promise<any> => {
    try {
      let { amount } = reqBody
      if (reqBody.agentTranType == "airtime") {
        reqBody = { ...await this.paymentData(), charges: 0, ...reqBody };
      } else {
        serviceId = serviceId.trim()
        const billCom: any = await BillCommission.findOne({ serviceId });
        let charges;
        if (billCom && billCom.type === "percent") {
          reqBody.amount = +(amount - (amount * billCom.commission)).toFixed(2);
          charges = amount * billCom.commission;
        } else if (billCom && billCom.type === "flat") {
          reqBody.amount = +(amount - billCom.commission).toFixed(2);
          charges = billCom.commission;
        } else {
          charges = 0;
        }
        reqBody = { ...await this.paymentData(), charges: +(charges.toFixed(2)), ...reqBody };
      }

      const buyAirtime = `${ACCION_API_URL}/payment/paybill`;
      const response = await this.apiCall(buyAirtime, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }




  protected transactViaAccountV2 = async (clientDetails, reference, amount, mobileNumber, debitAccountNumber, narration, bill, product, serviceID, channel): Promise<IResponse> => {
    await this.logTxnPinMatched(reference, `Pin matched. About to debit account (${amount} naira)`, mobileNumber, bill)
    try {
      const paymentRequest = {
        amount: Number(amount), debitAccount: debitAccountNumber, narration: `${narration || bill}`,
        agentTranType: product == "bill" ? "bills" : product, gsmNetwork: product === "airtime" ? serviceID : ""
      };
      const debitAccount: any = await this.processAccountDeductionV3(clientDetails, paymentRequest, serviceID, channel);
      const { paymentReference, responseCode, responseDescription } = debitAccount;
      if (responseCode === "00") {
        return this.successResponse(null, paymentReference)
      } else {
        await this.logTxnDebitFailed(reference, mobileNumber, responseDescription, bill);
        return await this.failureResponse(`${responseDescription || "Unable to debit account"}`)
      }
    } catch (error) {
      return this.serviceErrorHandler(clientDetails, error);
    }
  }


  private logFailedWithoutComplete = async (reference: string, context: string, actor: string, message: string) => {
    await Transaction.updateOne({ reference }, {
      $set: { message },
      $push: { data: { note: message, context, actor } }
    });
  }

  protected isUser = async (userId, mobile?) => {
    const projection = {
      personalInfo: 0, contactInfo: 0, nextOfKinInfo: 0, empolymentInfo: 0, meansOfIdentification: 0,
      proofOfAddress: 0
    }
    const user: any = await User.findById({ _id: userId }, projection);
    if (!user) {
      return { data: null, message: 'User not found', status: false };
    }
    return { message: "Success", data: user, status: true };
  }

  // protected transactViaAccount = async (req, reference, amount, mobileNumber, debitAccountNumber, narration, bill): Promise<IResponse> => {
  //   await this.logTxnPinMatched(reference, `Pin matched. About to debit account (${amount} naira)`, mobileNumber, bill)
  //   try {
  //     const paymentRequest = { amount: Number(amount), debitAccount: debitAccountNumber, narration: `${narration || bill}` };
  //     const debitAccount: any = await this.processAccountDeduction(req, paymentRequest);
  //     if (debitAccount.responseCode === "00") {
  //       return this.successResponse(null, debitAccount.paymentReference)
  //     } else {
  //       await this.logTxnDebitFailed(reference, mobileNumber, debitAccount.responseDescription, bill);
  //       return await this.failureResponse(`${debitAccount.responseDescription || "Unable to debit account"}`)
  //     }
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error);
  //   }
  // }

  protected paymentData = async () => {
    return {
      debitCurrency: "NGN",
      transRef: this.createRef(),
      branchCode: "NG0010001"
    }
  }


  // protected customerDetails = async (accountNumber): Promise<any> => {
  //   try {
  //     const reqBody = { nubanAccountNumber: accountNumber, tranRef: this.createRef() };
  //     const openAccount = `${ACCION_API_URL}/customer/details`;
  //     const response = await this.apiCall(openAccount, reqBody, await this.getHeaders(), "POST")
  //     const responseData = await response.json();
  //     return responseData;
  //   } catch (error) {
  //     return { status: 500, message: "Internal server error", data: null }
  //   }
  // }


  protected transactViaWallet = async (metaData, reference: string, mobileNumber: string, amount: number, wallet, bill): Promise<IResponse> => {
    try {
      this.logTxnPinMatched(reference, `Pin matched. About to debit wallet (${amount} naira)`, mobileNumber, bill);
      if ((wallet.balance) >= Number(amount)) {
        const updateWalletRes: any = await this.updateUserWallet(mobileNumber, amount, 'DEBIT', wallet);
        if (updateWalletRes.status) {
          return this.successResponse()
        } else {
          await this.logTxnDebitFailed(reference, mobileNumber, updateWalletRes.message, bill);
          return new UniversalsService().failureResponse("Failed to debit wallet")
        }
      } else {
        await Transaction.updateOne({ reference }, {
          $set: { message: "Insufficient fund" }, $push: {
            data: { note: "Insufficient fund", context: bill, actor: "wallet" }
          }
        });
        return this.failureResponse("Insufficient fund")
      }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error)
    }
  }

  protected refundAccount = async (paymentReference, reference, amount, mobileNumber, bill, req) => {
    const refundAccount: any = await this.reverseTransfer(paymentReference, req);
    if (refundAccount.responseCode === "00") {
      await this.logTxnFailed(reference, refundAccount, mobileNumber, bill, `Transaction failed, ${amount} naira refunded`);
    }
    else { await this.logTxnFailedRefund(reference, refundAccount, amount, mobileNumber, bill); }
    User.updateOne({ mobileNumber }, { $inc: { "transactionsData.cummulativeDailyTransaction": -amount } })
  }

  protected reverseTransfer = async (t24Reference, req): Promise<any> => {
    try {
      const reqBody = { t24Reference };
      const { channel } = req.body
      const reverseTransaction = `${ACCION_API_URL}/payment/reverseft`;
      const response = await this.apiCall(reverseTransaction, reqBody, await this.setHeader(channel), "POST", req.hostname)
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }
  protected refundWallet = async (mobileNumber, amount, wallet, reference, data, context): Promise<void> => {
    const refundWalletRes: any = await this.updateUserWallet(mobileNumber, amount, 'CREDIT', wallet);
    if (refundWalletRes.status) { await this.logTxnFailed(reference, data, mobileNumber, context, `Transaction failed, ${amount} naira refunded`); }
    else { await this.logTxnFailedRefund(reference, data, amount, mobileNumber, context); }
    User.updateOne({ mobileNumber }, { $inc: { "transactionsData.cummulativeDailyTransaction": -amount } })
  }

  protected checkUserWallet = async (mobileNumber, amount) => {
    const query = { mobileNumber };
    const user: any = await User.findOne(query);
    if (!user) return this.failureResponse("User not found");
    if (user.wallet.ledgerBalance >= amount) return this.successResponse('Sufficient wallet funds');
    return this.failureResponse('Insufficient wallet funds');
  };

  // protected processAccountDeduction = async (req, reqBody): Promise<any> => {
  //   try {
  //     reqBody = { ...this.paymentData(), ...reqBody }
  //     const buyAirtime = `${ACCION_API_URL}/payment/buyairtime`;
  //     const response = await this.apiCall(buyAirtime, reqBody, await this.getHeaders(), "POST")
  //     const responseData = await response.json();
  //     return responseData;
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error)
  //   }
  // }

  protected receiverTransactionHistory = async (receiverId, isAccount, req, sender, type) => {
    const { mobileNumber, amount, product, channel, narration, accountNumber: beneficiary } = req.body;
    const { firstName, lastName, email, reference } = sender;
    try {
      const body = {
        userId: receiverId,
        provider: "Accion",
        reference,
        type,
        state: "complete",
        status: "success",
        message: "success",
        narration,
        source: isAccount ? "account" : "wallet",
        amount,
        product,
        channel,
        debitAccount: mobileNumber.substring(0),
        sender: { fullName: `${firstName} ${lastName}`, email, mobileNumber },
        beneficiary,
        requestData: req.body,
        isCredit: true,
        data: [{}]
      }
      await Transaction.create(body);
    } catch (error) {
      this.serviceErrorHandler(req, error);
    }
  }

  protected updateUserWallet = async (phone, amount, type, wallet?) => {
    if (type == 'DEBIT') {
      wallet.balance = wallet.balance - +amount;
    } else {
      wallet.balance = wallet.balance + +amount;
    }
    console.log(wallet.balance, "ppppppppppppppppppppp");

    const user = await User.updateOne({ phone }, { wallet });
    console.log(user, "user----------------");

    if (!user) return new UniversalsService().failureResponse("User not found");
    return new UniversalsService().successResponse("Success", user)
  };

  private logTxnDebitFailed = async (reference, mobileNumber, note, context) => {
    await Transaction.updateOne({ reference }, {
      $set: { message: `${note || "Unable to debit account"}` }, $push: {
        data: { note, context, actor: mobileNumber }
      }
    })
  }

  protected logTxnFailedRefund = async (reference: string, responseData, amount: number, userIdentifier: string, context) => {
    await Transaction.updateOne({ reference },
      {
        $set: {
          state: "complete",
          message: responseData.message.toLowerCase() === "low wallet balance" ? "Provider is not capable of fulfilling your request" : responseData.message,
          transactionData: responseData
        },
        $push: {
          data: {
            note: `Transaction failed, ${amount} naira refund failed`,
            context,
            actor: userIdentifier,
          }
        }
      }
    )
  }

  protected logTxnFailed = async (reference: string, responseData, mobileNumber: string, context, note) => {
    await Transaction.updateOne({ reference }, {
      $set: { state: "complete", message: responseData.message, transactionData: responseData },
      $push: {
        data: { note, context, actor: mobileNumber, object: responseData }
      }
    })
  }

  // protected logTxnFailed = async (reference: string, responseData, amount: number, mobileNumber: string, context) => {
  //   await Transaction.updateOne({ reference }, {
  //     $set: { state: "complete", message: responseData.message, transactionData: responseData },
  //     $push: {
  //       data: { note: `Transaction failed, ${amount} naira refunded`, context, actor: mobileNumber, object: responseData }
  //     }
  //   })
  // }

  protected logTxnSuccessful = async (reference: string, provider, responseData, UserIdentifier: string, context, isCredit, commission = 0, charge = 0, RP = 0, AMFB = 0, psStatus?) => {
    await Transaction.updateOne({ reference }, {
      $set: {
        provider, state: "complete", message: responseData.message, status: context === "transfer" && responseData?.data?.status == "NEW" ? "pending" : `${psStatus || "success"}`, isCredit,
        transactionData: responseData.data,
        commission,
        charge,
        RP,
        AMFB
      },
      $push: { data: { note: "Operation was successful", context, actor: UserIdentifier } }
    }
    )
  }

  protected logTxnPinMatched = async (reference: string, note: string, mobileNumber: string, context, message?): Promise<void> => {
    await Transaction.updateOne({ reference }, {
      $set: { message: `${message || "Pin matched"}` },
      $push: { data: { note, context, actor: mobileNumber, object: mobileNumber } }
    });
  }

  protected logTxnDebtedCallGateway = async (reference: string, note: string, mobileNumber: string, context, message?): Promise<void> => {
    await Transaction.updateOne({ reference }, {
      $set: { message: ` ${message || "Debit successful"}` }, $push: {
        data: {
          note, context,
          actor: mobileNumber
        }
      }
    });
  }
}
