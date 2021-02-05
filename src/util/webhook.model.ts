import { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';



export interface IWebhook extends Document {
  event: String,
  type: String,
  data: {
    id: Number,
    account_number: String,
    bank_name: String,
    bank_code: String,
    fullname: String,
    created_at: String,
    currency: String,
    debit_currency: any,
    amount: Number,
    fee: Number,
    status: String,
    reference: String,
    meta: {
      first_name: String,
      last_name: String,
      email: String,
      mobile_number: String
    },
    narration: String,
    approver: any,
    complete_message: String,
    requires_approval: Number,
    is_approved: Number

  }
}

const WebhookSchema = new Schema({
  event: String,
  type: String,
  data: {
    id: Number,
    account_number: String,
    bank_name: String,
    bank_code: String,
    fullname: String,
    created_at: String,
    currency: String,
    debit_currency: null || String,
    amount: Number,
    fee: Number,
    status: String,
    reference: String,
    meta: {
      first_name: String,
      last_name: String,
      email: String,
      mobile_number: String
    },
    narration: String,
    approver: null || String,
    complete_message: String,
    requires_approval: Number,
    is_approved: Number

  }
},
  { timestamps: true }
);

WebhookSchema.plugin(mongoosePaginate);

const Webhook = model<IWebhook>('webhook', WebhookSchema);

export default Webhook;
