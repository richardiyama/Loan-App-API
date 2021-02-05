/* eslint-disable @typescript-eslint/no-var-requires */
import { config } from 'secreta';

const credentials: any = {
  apiKey: config.AFRICAS_TALKING_API_KEY,
  username: config.AFRICAS_TALKING_USERNAME,
};
const AfricasTalking = require('africastalking')(credentials);

const sms = AfricasTalking.SMS;

export class SmsService {
  public sendMessage = (to: string, message: string, from: string) => {
    const options = {
      // Set the numbers you want to send to in international format
      to,
      // Set your message
      message,
      // Set your shortCode or senderId
      from
    };

    return sms.send(options);
  };
}


