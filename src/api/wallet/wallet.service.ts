import { IResponse } from '../account/account.interface';
import logger from '../../util/logger/logger';
import { config } from "secreta";
const { FLUTTERWAVE_BASE_URL, FLUTTERWAVE_SECRET, MONNIFY_URL, MONNIFY_CONTRACT_CODE, BUDDY_PAYSTACK_SECRET,
  PAYSTACK_API, RUBIKPAY_VAS_API_LIVE, RUBIKPAY_VAS_URL } = config;
// const { FLUTTERWAVE_BASE_URL, FLUTTERWAVE_SECRET, BUDDY_PAYSTACK_SECRET, PAYSTACK_API } = config;
import User from '../user/user.model';
// import UserTransaction from '../transaction/transaction.model';
import mongoose, { Types } from 'mongoose';
const headers = { "Content-Type": "application/json", Authorization: FLUTTERWAVE_SECRET }
import mongo from "mongodb";
import { baseWalletService } from './baseWallet.service';
import crypto from 'crypto';
import Card, { ICard } from '../card/card.model';
import Transaction from '../transaction/transaction.model';


// AUTH_ggj9keyp76
// AUTH_q90ibftafa
// AUTH_oij3pzrynnSUCOCK1


export class WalletService extends baseWalletService {

  public blockWallet = async (req) => {
    const _id = Types.ObjectId(req.query.userId)
    try {
      const user = await User.findOneAndUpdate({ _id, wallet: { $exists: true } }, { $set: { "wallet.isLocked": true } });
      if (!user) return this.failureResponse("User does not exist/ not a wallet account");
      return this.successResponse("Wallet blocked");
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public unblockWallet = async (req) => {
    const _id = Types.ObjectId(req.query.userId)
    try {
      const user = await User.findOneAndUpdate({ _id, wallet: { $exists: true } }, { $set: { "wallet.isLocked": false } });
      if (!user) return this.failureResponse("User does not exist/ not a wallet account");
      return this.successResponse("Wallet unblocked");
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public getWallet = async (req) => {
    const _id = Types.ObjectId(req.query.userId)
    try {
      const user = await User.findOne({ _id }, { wallet: 1 });
      if (!user) return this.failureResponse("User does not exist/Not a wallet account");
      return this.successResponse(null, user);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public processFundWalletByCard = async (user, body, metaData) => {
    const userId = user._id;
    const { amount, cardId } = body;
    const query = { _id: userId };
    try {
      const isAllowed = await this.processUser({ userId, body, metaData });
      console.log(isAllowed, "isAllowedisAllowed");

      const { status: isAllowedStatus, message: isAllowedMessage, data: isAllowedData } = isAllowed;
      if (!isAllowedStatus) return this.failureResponse(isAllowedMessage);
      const { wallet, reference } = isAllowedData;
      console.log(userId, cardId, "_id_id_id_id_id");

      const card: ICard | null = await Card.findOne({ userId, _id: new mongo.ObjectID(cardId) });
      console.log(card, "cardcardcard");

      if (!card) return this.failureResponse("Specified card Id does not exist for this user");
      const { email, authorizationCode } = card;
      await this.logTxnDebtedCallGateway(reference, `Pin matched. About to call paysatck`, userId, "Fund-wallet", "Pin matched");
      const chargeCard = `${PAYSTACK_API}/transaction/charge_authorization`;
      const headers = { Authorization: BUDDY_PAYSTACK_SECRET, "Content-Type": "application/json" };
      const reqBody = { authorization_code: authorizationCode, email, amount: amount * 100 };
      const response = await this.apiCall(chargeCard, reqBody, headers, "POST", metaData.hostname);
      const responseData = await response.json();
      console.log(responseData, "responseData responseData responseData ");

      const { status, data, message } = responseData;
      if (status !== false) {
        if (data.status == 'success') {
          await this.logTxnPinMatched(reference, `Fund was deducted from bank account. About to credit wallet with
          (${amount} naira)`, userId, "Wallet funding", "Bank was debited");
          const newWallet = this.creditWallet(wallet, amount);
          const isUpdated = await User.updateOne(query, { $inc: { "wallet.balance": +amount } });
          console.log(isUpdated, "isUpdated");

          await this.logTxnSuccessful(reference, "Paystack", responseData, userId, "Fund-wallet", true)
          return this.successResponse(`${amount} was added to your wallet`, newWallet)
        } else {
          await this.logTxnFailedRefund(reference, { ...responseData, message: data.gateway_response }, amount, userId,
            "Fund-wallet");
          return this.failureResponse(
            data.gateway_response || 'Your card could not be charged, please use another card or check back later');
        }
      } else {
        await this.logTxnFailed(reference, responseData, userId, "Fund-wallet", `Transaction failed`);
        return this.failureResponse(message)
      }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error)
    }
  }

  public fundWalletByAccount = async ({ body, originalUrl, method, ip, hostname }) => {
    const { accountNumber, accountBank, amount, email, dob } = body;
    const reqBody = {
      account_bank: accountBank, account_number: accountNumber, amount, email, passcode: dob,
      currency: "NGN", tx_ref: this.createRef()
    }
    console.log(reqBody, "body");
    try {
      const chargeAccount = `${FLUTTERWAVE_BASE_URL}/charges?type=debit_ng_account`;
      console.log(FLUTTERWAVE_BASE_URL, FLUTTERWAVE_SECRET, "key");
      // const response =
      await this.apiCall(chargeAccount, reqBody, headers, "POST", hostname).then(data => {
        console.log(data, "data");
        // return { statusCode: 200, status:false, data:null, message:"here" };

      });
      return null
      // const responseData = await response.json();
      // console.log(responseData, "res");
      // return responseData.status === "success" ? { statusCode: 200, ...responseData } : { statusCode: 400, ...responseData }
    } catch (error) {
      logger.log('warn', `URL:${originalUrl} METHOD:${method} IP:${ip} ERROR:${error}`);
      return { statusCode: 500, status: false, message: "Internal server error", data: null };
    }
  }

  // public validateCharge = async ({ body: { otp, flwRef, userId, channel }, originalUrl, method, ip, hostname }): Promise<IResponse> => {
  //   const reqBody = { otp, flw_ref: flwRef, type: "account" };
  //   console.log(reqBody, 'body');

  //   try {
  //     const _id = Types.ObjectId(userId);
  //     const user: any = await User.findOne({ _id })
  //     console.log(user, _id);
  //     if (!user) return { statusCode: 400, status: false, message: "User was not found", data: null };
  //     if (user.isAccount) return { statusCode: 400, status: false, message: "Not a wallet", data: null };
  //     // return { statusCode: 200, status: false, message: 'User active', data: user.wallet };
  //     const validateCharge = `${FLUTTERWAVE_BASE_URL}/validate-charge`;
  //     const response = await this.apiCall(validateCharge, reqBody, headers, "POST", hostname)
  //     const responseData = await response.json();

  //     if (responseData.status === "success") {
  //       const { firstName, lastName, mobileNumber, qrCode, photoImage } = user;
  //       const transactionDetails = {
  //         amount: responseData.data.amount,
  //         type: "Fund-wallet",
  //         provider: "paystack",
  //         channel,
  //         source: "Card",
  //         destination: "Wallet",
  //         narration: `wallet top up for: ${firstName} ${lastName}`,
  //         state: "complete",
  //         isCredit: true,
  //         sender: {
  //           _id: userId,
  //           fullname: `${firstName} ${lastName}`,
  //           mobileNumber,
  //           qrCode,
  //           photoImage
  //         }
  //       };

  //       const trans = await UserTransaction.create(transactionDetails);
  //       if (!trans) {
  //         //log that transaction was created
  //       }

  //       const newWallet = this.creditWallet(user.wallet, 100 * 100);
  //       console.log(newWallet, 'new');

  //       const userUpdate = await User.updateOne({ _id }, { $set: { "wallet": newWallet } });
  //       const { n, nModified } = userUpdate;
  //       console.log(userUpdate.ok, userUpdate.nModified, userUpdate.n, userUpdate, 'updated');
  //       if (n === 0 || nModified === 0) return { statusCode: 400, status: true, message: `Transaction was successful but wallet was not updated`, data: newWallet }
  //       return { statusCode: 200, status: true, message: `${100} was added to your wallet`, data: newWallet }
  //     } else {
  //       // log into trnsaction the message from FLW
  //       return { statusCode: 400, status: true, message: `Charge validation failed`, data: responseData }
  //     }

  //   } catch (error) {
  //     logger.log('warn', `URL:${originalUrl} METHOD:${method} IP:${ip} ERROR:${error}`);
  //     return { statusCode: 500, status: false, message: "Internal server error", data: null };
  //   }
  // }

  public walletAccountDetails = async (query, metaData) => {
    const { accountReference } = query;
    try {
      let authRes = await this.auth();
      const responseData = await authRes.json();
      const token = responseData.responseBody.accessToken;
      const accountDetails = `${MONNIFY_URL}/bank-transfer/reserved-accounts/${accountReference}`;
      const detailsRes = await this.apiCall(accountDetails, null, { Authorization: `Bearer ${token}` }, "GET")
      const data = await detailsRes.json();
      const { requestSuccessful, responseMessage, responseBody } = data
      if (requestSuccessful) return { statusCode: 200, status: true, message: "Fetched details", data: responseBody }
      return { statusCode: 400, status: false, message: responseMessage || "Account details was not fetched", data }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public deleteWalletAccount = async (query, metaData) => {
    const { accountNumber } = query;
    try {
      let authRes = await this.auth();
      const responseData = await authRes.json();
      const token = responseData.responseBody.accessToken;
      const deleteAccount = `${MONNIFY_URL}/bank-transfer/reserved-accounts/${accountNumber}`;
      const deleteRes = await this.apiCall(deleteAccount, null, { Authorization: `Bearer ${token}` }, "DELETE")
      const data = await deleteRes.json();
      const { requestSuccessful, responseMessage } = data
      console.log(data, 'res');
      if (requestSuccessful) return { statusCode: 200, status: true, message: "Reserved account deleted", data: null }
      return { statusCode: 400, status: false, message: responseMessage || "Could not delete account, try again", data }
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

  public transactionStatus = async ({ originalUrl, method, ip, query, hostname }): Promise<IResponse> => {
    const { transactionReference } = query;
    try {
      let authRes = await this.auth();
      const responseData = await authRes.json();
      const token = responseData.responseBody.accessToken;
      const deleteAccount = `${MONNIFY_URL}/merchant/transactions/query?transactionReference=${transactionReference}`;
      const deleteRes = await this.apiCall(deleteAccount, null, { Authorization: `Bearer ${token}` }, "GET", hostname)
      const data = await deleteRes.json();
      const { requestSuccessful, responseMessage, responseBody } = data;
      console.log(data, 'res');
      if (requestSuccessful) return { statusCode: 200, status: true, message: responseMessage, data: responseBody }
      return {
        statusCode: 400, status: false,
        message: responseMessage || "Could not fetch transaction status, try again later", data: responseBody
      };
    } catch (error) {
      logger.log('warn', `URL:${originalUrl} - METHOD:${method} - IP:${ip} - ERROR:${error}`)
      return { statusCode: 500, status: true, message: "An error occurred", data: null }
    }
  }


  public processReserveWalletAccount = async (body, metaData?) => {
    const { firstName, lastName, customerEmail } = body;
    const customerName = `${firstName} ${lastName}`
    const reqBody = {
      accountName: customerName,
      accountReference: this.createRef(`${firstName}-`),
      currencyCode: "NGN",
      contractCode: MONNIFY_CONTRACT_CODE,
      customerName,
      customerEmail
    }
    try {
      const authRes = await this.auth();
      const responseData = await authRes.json();
      const token = await responseData.responseBody.accessToken;
      const createAccount = `${MONNIFY_URL}/bank-transfer/reserved-accounts`;
      const createAccountRes = await this.apiCall(createAccount, reqBody, { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, "POST")
      const data = await createAccountRes.json();
      const { requestSuccessful, responseMessage, responseBody } = data
      if (requestSuccessful) return this.successResponse(null, responseBody)
      return this.failureResponse(null, responseMessage);
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }


  private createHash = async (body, key) => {
    const { transactionReference, paymentReference, amountPaid, paidOn } = body;
    const text = `${key}|${paymentReference}|${amountPaid}|${paidOn}|${transactionReference}`;
    const hash = crypto.createHash('sha512', key).update(text).digest('hex');
    return hash;
  }


  public processNotification = async (body, metaData): Promise<IResponse> => {
    const { transactionReference: reference, transactionHash } = body;
    const session = await (await mongoose.startSession()); session.startTransaction();
    try {
      const hash = await this.createHash(body, RUBIKPAY_VAS_API_LIVE);
      if (hash === transactionHash) {
        const response = await this.apiCall(`${RUBIKPAY_VAS_URL}/wallets/transaction-status/${reference}`, null, { "Content-Type": "application/json", Authorization: RUBIKPAY_VAS_API_LIVE }, "GET");
        const responseData = await response.json()
        const { status, data } = responseData;
        if (status !== true) return this.failureResponse();
        const { product, paymentStatus, amountPaid: amount, paymentDescription: narration, accountDetails } = data;
        const { accountName, accountNumber } = accountDetails;
        if (status === true && paymentStatus?.toLowerCase() === "paid") {
          const user = await User.findOneAndUpdate({ "wallet.accountReference": product.reference }, { $inc: { "wallet.balance": +amount } }, { session, new: true });
          if (!user) return this.failureResponse();
          const { _id: userId, wallet } = user;
          const transData = {
            userId,
            provider: "monnify",
            reference,
            type: "fund-wallet",
            state: "complete",
            message: "TRANSACTION SUCCESSFUL",
            status: "success",
            narration,
            amount,
            product: "transfer",
            channel: "web-hook",
            debitAccount: accountDetails.accountNumber,
            sender: { fullName: accountName, accountNumber },
            beneficiary: wallet?.accountNumber,
            transactionData: data,
            isCredit: true,
            source: `${accountDetails ? "account trnsfer" : "card transfer"}`
          }
          const transaction = await Transaction.create([transData], { session });
          if (!transaction) return this.failureResponse();
          await session.commitTransaction(); session.endSession();

          return this.successResponse();
        }
      } else {
        await session.abortTransaction(); session.endSession();
        return this.failureResponse()
      }
      return this.successResponse(null, { hash, transactionHash })
    } catch (error) {
      return this.serviceErrorHandler(metaData, error);
    }
  }

}
