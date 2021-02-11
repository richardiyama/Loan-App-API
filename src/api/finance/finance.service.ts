
import { config } from 'secreta';
import User from '../user/user.model';
import { UniversalsService } from '../../@core/common/universals.service';
import { IResponse } from '../account/account.interface';
import Transaction from '../transaction/transaction.model';
const { FLUTTERWAVE_BASE_URL, FLUTTERWAVE_SECRET, PAYSTACK_API, BUDDY_PAYSTACK_SECRET, FWHASH } = config;
const headers = { "Content-Type": "application/json", Authorization: FLUTTERWAVE_SECRET }
const headersPS = { Authorization: BUDDY_PAYSTACK_SECRET, "Content-Type": "application/json" };
import crypto from 'crypto';
import { Types } from 'mongoose';
import Webhook from '../../util/webhook.model';
import mongoose from 'mongoose';

// interface ITransaction {
//   userId: string,
//   amount: number,
//   reference: string,
//   channel: string
// }



// const headers = { "Content-Type": "application/json", Authorization: "Bearer FLWSECK_TEST-SANDBOXDEMOKEY-X" }


export class FinanceService extends UniversalsService {

  public bulkTransfer = async ({ body: { accountBank, accountNumber, amount, narration, currency, beneficiaryName } }) => {
    const reqBody = {
      reference: this.createRef(),
      account_bank: accountBank,
      account_number: accountNumber,
      beneficiary_name: beneficiaryName,
      amount,
      narration,
      currency
    };
    const bulkTransfer = `${FLUTTERWAVE_BASE_URL}/transfers`;
    const response = await this.apiCall(bulkTransfer, reqBody, headers, "POST", "api.accionmfb.com");
    const responseData = response.json();
    console.log(responseData);
  }



  // private requeryTransfer = (id: string) => {
  //   return new Promise(resolve => setTimeout(async () => {
  //     const getTransferURL = `${FLUTTERWAVE_BASE_URL}/transfers/${id}`;
  //     const secondResponse = await this.apiCall(getTransferURL, null, headers, "GET", "api.accionmfb.com");
  //     const secondResponseData = await secondResponse.json();
  //     resolve(secondResponseData)
  //   }, 5000))
  // }


  public processFWWebhook = async (body, metaData): Promise<IResponse> => {
    const session = await mongoose.startSession(); session.startTransaction();

    try {
      await Webhook.create(body);
      const hash = metaData.headers["verif-hash"];
      if (!hash) return this.failureResponse();
      const secret_hash = FWHASH;
      if (hash !== secret_hash) return this.failureResponse();
      const { event, data: _data } = body;
      const getTransfer = await this.processGetSingleTransfer(_data, metaData);
      const { status, data } = getTransfer;
      if (status !== true) return this.failureResponse();
      const { amount, fee, status: _status, complete_message } = data;
      const transaction = await Transaction.findOne({ "transactionData.reference": data.reference });
      if (transaction && _status?.toLowerCase() == "failed" && event.split(".")[0] == "transfer" && transaction.status == "pending") {
        await Transaction.findByIdAndUpdate({ _id: transaction._id }, { status: "failed", message: complete_message, transactionData: data }, { session });
        await User.findByIdAndUpdate({ _id: transaction?.userId }, { $inc: { 'wallet.balance': Number(amount) + Number(fee) } });
      } else if (transaction && _status?.toLowerCase() == "successful" && event.split["."][0] == "transfer" && transaction.status == "pending") {
        await Transaction.findByIdAndUpdate({ _id: transaction._id }, { status: "success", message: complete_message, transactionData: data }, { session });
      } else {
        return this.failureResponse();
      }
      await session.commitTransaction(); session.endSession();

      return this.successResponse();
    } catch (error) {
      await session.abortTransaction(); session.endSession();

      return await this.serviceErrorHandler(metaData, error);
    }
  }

  public getBanks = async (req): Promise<IResponse> => {
    try {
      const fetchBanksURL = `${FLUTTERWAVE_BASE_URL}/banks/NG`;
      const response = await this.apiCall(fetchBanksURL, null, headers, "GET", req.hostname);
      const responseData = await response.json();
      const { status, message, data } = responseData;
      if (status !== "success") return await this.failureResponse(`${message}|| Banks was not fetched`);
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public getBanksPS = async (req): Promise<IResponse> => {
    try {
      const fetchBanksURL = `${PAYSTACK_API}/bank?perPage=100&country=Nigeria&currency=NGN`;
      const response = await this.apiCall(fetchBanksURL, null, headersPS, "GET", req.hostname);
      const responseData = await response.json();
      const { status, message, data } = responseData;
      if (status !== true) return await this.failureResponse(`${message}|| Banks was not fetched`);
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }


  public fetchPSTransactionHistory = async (req): Promise<IResponse> => {

    const { perPage, page, from, to, state } = req.query

    try {
      const fetchRecord = `${PAYSTACK_API}/transaction?perPage=${perPage}&page=${page}&from=${from}&to=${to}&status=${state}`;
      const response = await this.apiCall(fetchRecord, null, headersPS, "GET", req.hostname);
      const responseData = await response.json();
      const { status, message, data, meta } = responseData;
      if (status !== true) return await this.failureResponse(message || "Record not fetched");
      return this.successResponse(message, { data, meta });
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }


  public processWalletToAccionTransfer = async (req): Promise<IResponse> => {
    const { mobileNumber, amount, fee } = req.body;
    try {
      const isAllowed = await this.processUser(req);
      const { status, message, data } = isAllowed;
      if (!status) return this.failureResponse(message);
      const checkWallet = await this.transactViaWallet(req, data.reference, mobileNumber, amount,
        data.wallet, "transfer");
      if (!checkWallet.status) return this.failureResponse(checkWallet.message);
      this.logTxnDebtedCallGateway(data.reference, "Transfer failed", mobileNumber, "transfer");
      const { reference } = data;
      const transferRes = await this.walletFundTransfer(req);
      const { responseCode, responseDescription } = transferRes;
      if (responseCode !== "00") {
        this.refundWallet(mobileNumber, amount, data.wallet, data.reference, transferRes,
          "transfer")
        return this.failureResponse(null, transferRes);
      };
      await this.logTxnSuccessful(reference, "Accion", { message: responseDescription, data: transferRes }, mobileNumber,
        "Wallet2Accion transfer", false, fee, fee, +(fee * 0.2).toFixed(2), +(fee * 0.8).toFixed(2));
      return this.successResponse("Transfer was successful", transferRes);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public processGetSingleTransfer = async (params, metaData) => {
    console.log(params, "paramsparamsparams");

    try {
      const transferURL = `${FLUTTERWAVE_BASE_URL}/transfers/${params.id}`;
      const response = await this.apiCall(transferURL, null, headers, "GET");
      const responseData = await response.json();

      const { message, data, status } = responseData;
      if (status !== "success") {
        return this.failureResponse(message, data);
      }
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(metaData, error);
    }
  }



  public processWalletToBankTransfer = async (body, metaData, user): Promise<IResponse> => {
    const { amount } = body;
    try {
      const isAllowed = await this.processUser({ userId: user._id, body, metaData });
      const { status, message, data } = isAllowed;
      if (!status) return this.failureResponse(message);
      const { phone, reference } = data;
      const getFee = await this.processGetTransferFee({ amount }, metaData);
      const { status: _status, data: _data } = getFee;
      if (_status === false) return this.failureResponse();

      const fee = _data[0].fee;
      const total = Number(amount) + Number(fee)
      const checkWallet = await this.transactViaWallet(metaData, reference, phone, total, data.wallet, "transfer");
      if (!checkWallet.status) return this.failureResponse(checkWallet.message);
      await this.logTxnDebtedCallGateway(data.reference, `${amount} naira debted. Calling FlutterWave`,
        phone, "transfer");
      const makeTransferRes = await this.walletToBankTransfer(body, data, metaData);
      if (!makeTransferRes.status) {
        await this.refundWallet(phone, amount, data.wallet, data.reference, makeTransferRes,
          "transfer")
        return makeTransferRes;
      }
      console.log(makeTransferRes, "makeTransferResmakeTransferRes");

      await this.logTxnSuccessful(data.reference, "FW", makeTransferRes, phone, "transfer", false, 0, fee);
      return makeTransferRes;
    } catch (error) {
      return await this.serviceErrorHandler(metaData, error);
    }
  }


  public walletToBankTransfer = async (body, { firstName, lastName, email, phone }, metaData) => {
    const { accountBank, accountNumber, amount, narration, beneficiaryName } = body;
    const reqBody: any = {
      account_bank: accountBank, account_number: accountNumber, amount, narration, currency: "NGN",
      beneficiary_name: beneficiaryName, meta: { first_name: firstName, last_name: lastName, email, mobile_number: phone }
    }
    try {
      const transferURL = `${FLUTTERWAVE_BASE_URL}/transfers`;
      const response = await this.apiCall(transferURL, reqBody, headers, "POST", metaData.hostname);
      const responseData = await response.json();
      const { message, data } = responseData;
      if (responseData && data.status !== "NEW") {
        return this.failureResponse(`${responseData.data.complete_message}`, responseData.data);
      }
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(metaData, error);
    }
  }


  public processCreateRecipient = async (req): Promise<IResponse> => {
    try {
      const fetchBanksURL = `${PAYSTACK_API}/transferrecipient`;
      const { accountNumber: account_number, bankCode: bank_code, beneficiaryName: name } = req.body;
      const reqBody = { type: "nuban", account_number, bank_code, currency: "NGN", name }
      const response = await this.apiCall(fetchBanksURL, reqBody, headersPS, "POST", req.hostname);
      const responseData = await response.json();
      console.log(responseData, "responseData");

      const { status, message, data } = responseData;
      if (status !== true) return await this.failureResponse(`${message}|| Banks was not fetched`);
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  private paystackTransfer = async (req): Promise<IResponse> => {
    const { customerAmount, recipient, narration: reason } = req.body;
    const reqBody = { source: "balance", amount: customerAmount * 100, recipient, reason };
    try {
      const fetchBanksURL = `${PAYSTACK_API}/transfer`;
      const response = await this.apiCall(fetchBanksURL, reqBody, headersPS, "POST", req.hostname);
      const responseData = await response.json();
      console.log(responseData, "responseData");

      const { status, message, data } = responseData;
      // if (status !== true) return await this.failureResponse(message);

      if (status === false) {
        console.log(message, "message");

        if (-(message.indexOf("balance is not enough"))) return this.failureResponse("Service down");
        return this.failureResponse(message);
      };
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public processInitiateTransfer = async (req): Promise<IResponse> => {
    const { amount, fee } = req.body;
    try {
      const isAllowed = await this.processUser(req);
      const { status: userStatus, message: userMessage, data: userData } = isAllowed;
      if (!userStatus) return this.failureResponse(userMessage);
      const { reference, mobileNumber, wallet } = userData;
      const checkWallet = await this.transactViaWallet(req, reference, mobileNumber, amount, wallet, "transfer");
      if (!checkWallet.status) return this.failureResponse(checkWallet.message);
      this.logTxnDebtedCallGateway(userData.reference, `${amount} naira debted. Calling Paystack`,
        mobileNumber, "transfer");
      const createRecipient = await this.processCreateRecipient(req);
      const { status, message, data } = createRecipient;
      if (status !== true) return this.failureResponse(message);
      req.body.recipient = data.recipient_code;
      const makeTransferRes = await this.paystackTransfer(req);
      console.log(makeTransferRes, "makeTransferRes");
      if (!makeTransferRes.status) {
        this.refundWallet(mobileNumber, amount, data.wallet, data.reference, makeTransferRes,
          "transfer")
        return makeTransferRes;
      }
      this.logTxnSuccessful(reference, "PS", makeTransferRes, mobileNumber, "transfer", false, 0, fee, 0, 0, makeTransferRes.data.status);
      return makeTransferRes;
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }



  public processWebhookPS = async (req): Promise<IResponse> => {
    try {

      const hash = crypto.createHmac('sha512', BUDDY_PAYSTACK_SECRET).update(JSON.stringify(req.body)).digest('hex');
      console.log(hash, "hash");
      console.log(req.headers['x-paystack-signature'], "PS-sign")
      console.log(req.body, "req.body");

      // if (hash == req.headers['x-paystack-signature']) {
      const { data, event } = req.body;
      console.log(data, event, "data, event")

      const { transfer_code } = data;

      if (event === "transfer.success") {
        console.log(event, "event")
        await Transaction.updateOne({ "transactionData.transfer_code": transfer_code },
          { status: "success", "transactionData.status": "success", message: "Transfer was successful" });
      } else if (event === "transfer.failed") {
        await Transaction.updateOne({ "transactionData.transfer_code": transfer_code }, { status: "failed", "transactionData.status": "failed" });
      } else if (event === "transfer.reversed") {
        const transaction: any = await Transaction.findOneAndUpdate({ "transactionData.transfer_code": transfer_code }, { status: "reversed", "transactionData.status": "reversed" });
        const { userId, amount, reference, channel } = transaction;
        const _id = Types.ObjectId(userId);
        const user: any = await User.findOneAndUpdate({ _id }, {
          $inc: {
            "wallet.balance": +amount * 100,
            "wallet.ledgerBalance": +amount * 100, "transactionsData.cummulativeDailyTransaction": -amount
          }
        });
        const accountNumber = user.mobileNumber; const mobileNumber = "08000222466"; const product = "transfer";
        const narration = "transfer reversal"; const firstName = "Accion MFB"; const lastName = "Accio nMFB";
        const email = "pmo@accionMFB.com";
        req = { body: { mobileNumber, amount, product, channel, narration, accountNumber } }
        this.receiverTransactionHistory(userId, false, req, { firstName, lastName, email, reference }, "reversal");
      }
      return this.successResponse(null);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }


  public processGetTransferFeePS = async (req) => {
    const { amount } = req.query;
    try {
      let fee: number = amount * 0.015;
      if (amount > 2500) {
        fee += 100;
      }
      return fee <= 2000 ? this.successResponse(null, { fee }) : this.successResponse(null, { fee: 2000 });
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public processGetTransferFee = async (query, metaData): Promise<IResponse> => {
    const amount: number = query.amount;
    try {
      const fetchBanksURL = `${FLUTTERWAVE_BASE_URL}/transfers/fee?amount=${amount}&currency=NGN&type=account`;
      const response = await this.apiCall(fetchBanksURL, null, headers, "GET");
      const responseData = await response.json();
      let { status, message, data } = responseData;
      if (status !== "success") return await this.failureResponse(`${message || "Fee was not fetched"}`);
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(metaData, error);
    }
  }

  public processVerifyAccount = async (body, metaData): Promise<IResponse> => {
    const { accountNumber: account_number, accountBank: account_bank } = body;
    try {
      const fetchBanksURL = `${FLUTTERWAVE_BASE_URL}/accounts/resolve`;
      const response = await this.apiCall(fetchBanksURL, { account_number, account_bank }, headers, "POST");
      const responseData = await response.json();
      const { status, message, data } = responseData;
      if (status !== "success") return await this.failureResponse(`${message || "Account was not fetched"}`);
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(metaData, error);
    }
  }

  public processVerifyAccountPS = async (req): Promise<IResponse> => {
    try {
      const { accountNumber, accountBank } = req.body;
      const fetchBanksURL = `${PAYSTACK_API}/bank/resolve?account_number=${accountNumber}&bank_code=${accountBank}`;
      const response = await this.apiCall(fetchBanksURL, null, headersPS, "GET", req.hostname);
      const responseData = await response.json();
      console.log(responseData, "responseData");
      const { status, message, data } = responseData;
      if (status !== true) return await this.failureResponse(`${message || "Account was not fetched"}`);
      return this.successResponse(message, data);
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }


  public processWalletToWalletTransfer = async (req): Promise<IResponse> => {
    const { mobileNumber, amount } = req.body;
    try {
      const isAllowed = await this.processUser(req);
      const { status, message, data } = isAllowed;
      if (!status) return this.failureResponse(message);
      const checkWallet = await this.transactViaWallet(req, data.reference, mobileNumber, amount,
        data.wallet, "transfer");
      if (!checkWallet.status) return this.failureResponse(checkWallet.message);
      this.logTxnDebtedCallGateway(data.reference, `${amount} naira debted`, mobileNumber, "bank transfer");
      const makeTransferRes = await this.updateCustomerWallet(req);
      return this.walletTransferResponse(req, makeTransferRes, mobileNumber, amount, data)
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  };


  private walletTransferResponse = async (req, transferRes, mobileNumber, amount, senderData) => {
    const { wallet, reference } = senderData;
    const { message, data } = transferRes;
    try {
      if (!transferRes.status) {
        this.refundWallet(mobileNumber, amount, wallet, reference, data, "transfer");
        return transferRes;
      }
      this.receiverTransactionHistory(data._id, false, req, senderData, "transfer");
      this.logTxnSuccessful(reference, "Accion MFB", transferRes, mobileNumber, "transfer", false);
      return this.successResponse(message);
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public updateCustomerWallet = async (req) => {
    req.body.accountNumber = `0${req.body.accountNumber}`;
    const { accountNumber, amount } = req.body;
    try {
      const beneficiary: any = await User.findOneAndUpdate({ mobileNumber: accountNumber },
        { $inc: { 'wallet.balance': amount * 100, 'wallet.ledgerBalance': amount * 100 } });
      if (!beneficiary) return this.failureResponse("Beneficiary not found")
      return this.successResponse(null, beneficiary)
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }
}