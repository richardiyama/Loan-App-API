// import { UniversalsService } from '../../@core/common/universals. service';
import { config } from 'secreta';
import { IResponse } from '../account/account.interface';
import { BaseBillService } from './baseservice.service';
import BillCommission from './billCommission.model';

const { RUBIKPAY_VAS_URL } = config;

export class BillService extends BaseBillService {

  public payBill = async (req): Promise<IResponse> => {
    try {
      const { body, hostname } = req;
      delete body.prod
      const { bill } = body;
      let billPaymentUrl = "";
      if (bill === "insurance") {
        billPaymentUrl = `${RUBIKPAY_VAS_URL}billsPayment/pay/insurance`
      } else if (bill === "airtime") {
        billPaymentUrl = `${RUBIKPAY_VAS_URL}billsPayment/pay/airtime`
      } else {
        billPaymentUrl = `${RUBIKPAY_VAS_URL}billsPayment/pay/products`
      }
      let billHeaders = await this.assignHeader(hostname);
      const response = await this.apiCall(billPaymentUrl, body, billHeaders, "POST", hostname)
      const responseData = await response.json();
      const { status, data, message } = responseData;
      if (status === true) {
        return this.successResponse(message, data)
      } else {
        return this.failureResponse(message == "LOW WALLET BALANCE" ? "Provider was not able to fulfill your request" : message, data);
      }
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public getTransactionStatus = async (req) => {
    try {
      const { query: body, hostname } = req;
      let billHeaders = await this.assignHeader(hostname);
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}billsPayment/query`, body, billHeaders, "post", hostname)
      const responseData = await response.json();

      const { status, data, message } = responseData;
      if (status === true) {
        return await this.successResponse(message, data);
      } else {
        return await this.failureResponse(message, data);
      }
    } catch (error) {
      return await this.serviceErrorHandler(req, error);
    }
  }

  public getVariations = async (req): Promise<IResponse> => {
    try {
      const { query, hostname } = req;
      let billHeaders = await this.assignHeader(hostname);
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}billsPayment/variations`, query, billHeaders, "post", hostname)
      const responseData = await response.json();

      const { status, data, message } = responseData;
      if (status == true) {
        return this.successResponse(message, data);
      }
      return await this.failureResponse(message);
    } catch (error) {
      return await this.serviceErrorHandler(req, error)
    }
  }

  public verifyCableTV = async (req) => {
    try {
      const { body, hostname } = req;
      let billHeaders = await this.assignHeader(hostname);
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}billsPayment/cabletv/verify`, body, billHeaders, "post", hostname)
      const responseData = await response.json();

      const { status, message, data } = responseData;

      if (status === true) {
        return this.successResponse(message, data);
      }
      return this.failureResponse(message, data);
    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  public processCommission = async (body) => {
    // try {
    const bill = await BillCommission.create(body);
    if (bill) return this.successResponse();
    return this.failureResponse()
    // } catch (error) {
    //   return this.serviceErrorHandler(req, error)
    // }
  }

  public verifyMeter = async (req) => {
    try {
      const { body, hostname } = req;

      let billHeaders = await this.assignHeader(hostname);
      const response = await this.apiCall(`${RUBIKPAY_VAS_URL}billsPayment/meter/verify`, body, billHeaders, "post", hostname)
      const responseData = await response.json();

      const { status, message, data } = responseData;

      if (status === true) {
        return this.successResponse(message, data);
      }
      return this.failureResponse(message, data);

    } catch (error) {
      return this.serviceErrorHandler(req, error)
    }
  }

  // public processPayments = async (req): Promise<IResponse> => {
  //   const { mobileNumber, amount, debitAccountNumber, bill, narration } = req.body;
  //   try {
  //     const isAllowed = await this.processUser(req);
  //     const { status, message, data } = isAllowed;
  //     if (!status) return this.failureResponse(message);
  //     let deductBalance;
  //     if (debitAccountNumber === "") {
  //       deductBalance = await this.transactViaWallet(req, data.reference, mobileNumber, amount,
  //         data.wallet, bill);
  //     } else {
  //       deductBalance = await this.transactViaAccount(req, data.reference, amount, mobileNumber,
  //         debitAccountNumber, narration, bill);
  //     }
  //     if (!deductBalance.status) return this.failureResponse(deductBalance.message);
  //     this.logTxnDebtedCallGateway(data.reference, `${amount} naira debted. Calling VTPass`,
  //       mobileNumber, bill);
  //     const payBillsRes = await this.payBill(req);
  //     return await this.billPaymentResponse(payBillsRes, mobileNumber, amount, data, bill, debitAccountNumber,
  //       deductBalance, req);
  //   } catch (error) {
  //     return this.serviceErrorHandler(req, error);
  //   }
  // }

  public processPayments = async (req): Promise<IResponse> => {
    const { ip, method, originalUrl, hostname } = req;
    const clientDetails = { ip, method, originalUrl };
    const { mobileNumber, amount, debitAccountNumber, bill, narration, product, serviceID, channel } = req.body;
    try {
      const isAllowed = await this.processUser(req);
      const { status, message, data } = isAllowed;
      if (!status) return this.failureResponse(message);
      let deductBalance;
      if ((hostname != "52.160.106.88") && (hostname != "api.accionmfb.com") && (hostname != "localhost")) {
        return this.testProcessPayment(req, data.reference, mobileNumber, bill, amount);
      }
      if (debitAccountNumber === "") {
        deductBalance = await this.transactViaWallet(req, data.reference, mobileNumber, amount,
          data.wallet, bill);
      } else {
        deductBalance = await this.transactViaAccountV2(clientDetails, data.reference, amount, mobileNumber,
          debitAccountNumber, narration, bill, product, serviceID, channel);
      }
      if (!deductBalance?.status) return this.failureResponse(deductBalance.message);

      this.logTxnDebtedCallGateway(data.reference, `${amount} naira debted. Calling VTPass`,
        mobileNumber, bill);
      const payBillsRes = await this.payBill(req);
      return await this.billPaymentResponse(payBillsRes, mobileNumber, amount, data, bill, debitAccountNumber,
        deductBalance, req);
    } catch (error) {
      return this.serviceErrorHandler(clientDetails, error);
    }
  }

  protected testProcessPayment = async (req, reference, mobileNumber, bill, amount) => {
    try {
      const payBillsRes = await this.payBill(req);
      if (!payBillsRes.status) {
        await this.logTxnFailed(reference, payBillsRes, mobileNumber, bill, `Transaction failed, ${amount} naira refunded`);
        return payBillsRes
      }
      const { unit_price: unitPrice, total_amount: totalAmount } = payBillsRes.data.responseData.content.transactions;
      const commission = +(Number(unitPrice) - Number(totalAmount)).toFixed(2);
      await this.logTxnSuccessful(reference, payBillsRes.data.vendor, payBillsRes, mobileNumber, bill, false,
        commission, 0, commission * 0.2, commission * 0.8);
      if (payBillsRes.data.responseData) delete payBillsRes.data.responseData.content;
      return payBillsRes;
    } catch (error) {
      return this.serviceErrorHandler(req, error);
    }
  }

  public billPaymentResponse = async (payBillsRes, mobileNumber, amount, { wallet, reference }, bill,
    accountNumber, deductBalance, req) => {
    if (!payBillsRes.status && accountNumber === "") {
      await this.refundWallet(mobileNumber, amount, wallet, reference, payBillsRes, bill);
      return payBillsRes;
    } else if (!payBillsRes.status && accountNumber !== "") {
      await this.refundAccount(deductBalance.data, reference, amount, mobileNumber, bill, req);
      return payBillsRes;
    }
    const { unit_price: unitPrice, total_amount: totalAmount } = payBillsRes.data.responseData.content.transactions;
    // payBillsRes.data.transactionId = payBillsRes.data.responseData.content.transactions.trnasactionId;
    const commission = +(Number(unitPrice) - Number(totalAmount)).toFixed(2);
    await this.logTxnSuccessful(reference, payBillsRes.data.vendor, payBillsRes, mobileNumber, bill, false,
      commission, 0, commission * 0.2, commission * 0.8);
    if (payBillsRes.data.responseData) delete payBillsRes.data.responseData.content;
    return payBillsRes;
  }
}
