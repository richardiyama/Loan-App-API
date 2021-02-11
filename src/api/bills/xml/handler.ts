import crypto from 'crypto';
import xml2js from 'xml2js';
const algorithm = "aes-128-cbc";
const str = "KEd4gDNSDdMBxCGliZaC8w==";
const ENCRYPTION_KEY = str.substring(0, 18);
const IV_LENGTH = 16;

const parser = new xml2js.Parser();

export const encryptPin = (text) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export const resHandler = async (response) => {
  let output: Object;
  try {
    const parsedData = await parser.parseStringPromise(response);
    const result = parsedData["S:Envelope"]["S:Body"][0]["ns2:processResponse"][0].response[0];
    const { message, otherReference, error } = result;

    if (error[0] !== '0' && error[0] !== '-1') {
      output = { isError: { status: true }, code: 403, message: message[0], transactionRef: otherReference[0] }
    } else if (error[0] === '-1') {
      output = { isError: { status: true }, code: 400, message: message[0], transactionRef: otherReference[0] }
    } else {
      output = { isError: { status: false }, code: 20 + error[0], message: message[0], transactionRef: otherReference[0] }
    }
  } catch (error) {
    console.log('error', error)
    output = { status: false, message: "Internal server error", data: null }
  }
  return output;
}

export const verifyResHandler = async (response) => {
  let output: Object;
  try {
    const parsedData = await parser.parseStringPromise(response);
    const result = parsedData["S:Envelope"]["S:Body"][0]["ns2:processResponse"][0].response[0]
    const { message, otherReference, error } = result;

    const parseMessage = await parser.parseStringPromise(message);

    const { Bill, BillStatus, BillAccountId, BillVerifiedOnline, BillAccountIdDetails, BillProductLists, } = parseMessage['BillVerification'];

    let productPriceRange: any[] = []

    BillProductLists[0]['Product'].forEach(item => {
      let product = { name: item['ProductName'][0], amount: item['ProductAmount'][0] }
      productPriceRange.push(product)
    })

    const userInfo = {
      service: Bill[0],
      status: BillStatus[0],
      accountId: BillAccountId[0],
      verifiedOnline: BillVerifiedOnline[0],
      accountIdDetails: BillAccountIdDetails[0],
      productPriceRange,
    }

    if (error[0] !== '0' && error[0] !== '-1') {
      output = { isError: { status: true }, code: 403, message: message[0], transactionRef: otherReference[0] }
    } else if (error[0] === '-1') {
      output = { isError: { status: true }, code: 400, message: message[0], transactionRef: otherReference[0] }
    } else {
      output = { isError: { status: false }, code: 20 + error[0], message: userInfo, transactionRef: otherReference[0] }
    }
  } catch (error) {
    console.log('error', error)
    output = { status: false, message: "Internal server error", data: null }
  }

  return output;

}
