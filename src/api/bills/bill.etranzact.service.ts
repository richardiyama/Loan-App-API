import { UniversalsService } from '../../@core/common/universals.service';
import { airtime, purchase, bill, transactionStatus, verifyServiceID } from './xml/requests';
import { config } from 'secreta';
import uniqid from "uniqid";
import { resHandler, verifyResHandler } from './xml/handler';
import logger from '../../util/logger/logger';

const { ETRANZACT_LIVE_URL } = config;


export class EtranzactService extends UniversalsService {
  headers = { "Content-Type": "text/xml" }

  // @params {"provider": "MTN", "phoneNumber": "07061972413", "amount": 300 }
  public airtimePurchase = async (body) => {
    try {
      const airtimeCall = await this.apiCall(ETRANZACT_LIVE_URL, airtime(body, uniqid.time("ru", "ik")), this.headers, "post", true)
      const xmlAirtime = await airtimeCall.text();
      const handler = await resHandler(xmlAirtime);
      return handler;
    } catch (error) {
      logger.log('warn', `URL:${ETRANZACT_LIVE_URL}/airtime - METHOD:POST - ERROR:${error}`)
      return { code: 500, isError: { status: true }, message: error, data: null }
    }
  }

  // @params {"bankCode": "050", "accountNumber": "41157294764", "amount": "100" }
  public transferToAccount = async (body) => {
    try {
      const purchaseCall = await this.apiCall(ETRANZACT_LIVE_URL, purchase(body, uniqid.time("ru", "ik")), this.headers, "post", true)
      const xmlPurchase = await purchaseCall.text();
      const handler = await resHandler(xmlPurchase);
      return handler;
    } catch (error) {
      logger.log('warn', `URL:${ETRANZACT_LIVE_URL}/transfer - METHOD:POST - ERROR:${error}`)
      return { code: 500, isError: { status: true }, message: error, data: null }
    }
  }

  // @params {"billerCode": "DSTV", "serviceID": "10282910859", "amount": "1285" }
  public payBill = async (body) => {
    try {
      const billPayment = await this.apiCall(ETRANZACT_LIVE_URL, bill(body, uniqid.time("ru", "ik")), this.headers, "post", true)
      const xmlBillPayment = await billPayment.text();
      const handler = await resHandler(xmlBillPayment);
      return handler;
    } catch (err) {
      logger.log('warn', `URL:${ETRANZACT_LIVE_URL}/bill - METHOD:POST - ERROR:${err}`)
      return { code: 500, isError: { status: true }, message: err, data: null }
    }
  }

  // @params {"billerCode": "DSTV", "serviceID": "10282910859" }
  public verifyBillServiceID = async (body) => {

    try {
      const verifyBillID = await this.apiCall(ETRANZACT_LIVE_URL, verifyServiceID(body, uniqid.time("ru", "ik")), this.headers, "post", true)
      const xmlVerifyID = await verifyBillID.text();
      const handler = await verifyResHandler(xmlVerifyID);
      return handler;
    } catch (err) {
      logger.log('warn', `URL:${ETRANZACT_LIVE_URL}/verifybillserviceID - METHOD:POST - ERROR:${err}`)
      return { code: 500, isError: { status: true }, message: err, data: null }
    }
  }

  // @params {"referenceID": "etzrukcx65ehtik" }
  public checkTransactionStatus = async (body) => {
    try {
      const tranStatus = await this.apiCall(ETRANZACT_LIVE_URL, transactionStatus(body), this.headers, "post", true)
      const xmlTranStatus = await tranStatus.text();
      const handler = await resHandler(xmlTranStatus);
      return handler;
    } catch (err) {
      logger.log('warn', `URL:${ETRANZACT_LIVE_URL}/checkTransactionStatus - METHOD:POST - ERROR:${err}`)
      return { code: 500, isError: { status: true }, message: err, data: null }
    }
  }
}
