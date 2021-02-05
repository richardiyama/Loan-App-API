import { config } from 'secreta';
const { ETRANZACT_TERMINAL_ID, ETRANZACT_PIN } = config;

export const airtime = (body, refParam) => {
  const { provider, phoneNumber, amount } = body
  let ref = "VTU_TOP" + refParam;
  let xml = `<soapenv:Envelope
        xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
        xmlns:ws="http://ws.fundgate.etranzact.com/">
        <soapenv:Header/>
        <soapenv:Body>
            <ws:process>
                <request>
                    <direction>request</direction>
                    <action>VT</action>
                    <id/>
                    <terminalId>${ETRANZACT_TERMINAL_ID}</terminalId>
                    <transaction>
                        <id/>
                        <pin>${ETRANZACT_PIN}</pin>
                        <amount>${amount}</amount>
                        <description>Virtual TopUp</description>
                        <provider>${provider}</provider>
                        <lineType>VTU</lineType>
                        <destination>${phoneNumber}</destination>
                        <reference>${ref}</reference>
                        <senderName>Rubic Pay - Test</senderName>
                    </transaction>
                </request>
            </ws:process>
        </soapenv:Body>
    </soapenv:Envelope> `;

  return xml;

};

export const bill = (body, refParam) => {
  const { amount, billersCode, serviceID } = body
  let ref = "PB_TOP" + refParam;
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
      <soapenv:Header/>
      <soapenv:Body>
      <ws:process>
      <request>
      <direction>request</direction>
      <action>PB</action>
      <id/>
      <terminalId>${ETRANZACT_TERMINAL_ID}</terminalId>
      <transaction>
      <id>2</id>
      <pin>${ETRANZACT_PIN}</pin>
      <description>Payment for ${billersCode} for ${serviceID} subscription</description>
      <lineType>${serviceID}</lineType>
      <destination>${billersCode}</destination>
      <reference>${ref}</reference>
      <senderName>Rubik Pay - Test</senderName>
      <amount>${amount}</amount>
      </transaction>
      </request>
      </ws:process>
      </soapenv:Body>
      </soapenv:Envelope>`;
  return xml;
};

export const purchase = (body, refParam) => {
  const { bankCode, accountNumber, amount } = body
  let ref = "etz" + refParam;
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
      <soapenv:Header/>
      <soapenv:Body>
      <ws:process>
      <request>
      <direction>request</direction>
      <action>FT</action>
      <id/>
      <terminalId>${ETRANZACT_TERMINAL_ID}</terminalId>
      <transaction>
      <id/>
      <pin>${ETRANZACT_PIN}</pin>
      <bankCode>${bankCode}</bankCode>
      <amount>${amount}</amount>
      <description>Payment Fund Transfer</description>
      <destination>${accountNumber}</destination>
      <reference>${ref}</reference>
      <senderName>Rubik Pay - Test</senderName>
      <endPoint>A</endPoint>
      </transaction>
      </request>
      </ws:process>
      </soapenv:Body>
      </soapenv:Envelope>`;
  return xml;
};

export const transactionStatus = (body) => {
  const { referenceID } = body;
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
      <soapenv:Header/>
      <soapenv:Body>
      <ws:process>
      <request>
      <direction>request</direction>
  <action>TS</action>
  <id/>
  <terminalId>${ETRANZACT_TERMINAL_ID}</terminalId>
  <transaction>
  <id/>
  <pin>${ETRANZACT_PIN}</pin>
  <description>Rubik Pay - Transaction Status check</description>
  <reference>${referenceID}</reference>
  <amount>0.0</amount>
  <lineType>OTHERS</lineType>
  </transaction>
  </request>
  </ws:process>
  </soapenv:Body>
  </soapenv:Envelope>`;
  return xml;
};

export const verifyServiceID = (body, refParam) => {
  const { billerCode, serviceID } = body
  let ref = "PB_TOP" + refParam;
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.fundgate.etranzact.com/">
    <soapenv:Header/>
    <soapenv:Body>
    <ws:process>
    <request>
    <direction>request</direction>
    <action>PB</action>
    <id/>
    <terminalId>${ETRANZACT_TERMINAL_ID}</terminalId>
    <transaction>
    <id>1</id>
    <pin>${ETRANZACT_PIN}</pin>
    <description>Verify Service ID</description>
    <lineType>${billerCode}</lineType>
    <destination>${serviceID}</destination>
    <reference>${ref}</reference>
    <senderName>Rubik Pay - Test</senderName>
    </transaction>
    </request>
    </ws:process>
    </soapenv:Body>
    </soapenv:Envelope>`
  return xml;

};
