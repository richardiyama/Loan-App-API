import { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';


export interface ITransaction extends Document {

  userId: string,
  provider: string,
  reference: string,
  type: string,
  amount: Number,
  state: String,
  product: String,
  status?: String,
  narration: String,
  message: String,
  channel: String,
  sender: any,
  beneficiary?: any,
  requestData?: any,
  debitAccount?: String,
  charge?: Number,
  commission?: Number,
  source?: String,
  data?: [
    {
      note?: string,
      actor?: string,
      object?: string,
      context?: string,
      dateCreated?: Date
    }
  ],
  transactionData?: any,
  isCredit: Boolean
};

const TransactionSchema = new Schema({
  userId: String,
  provider: String,
  reference: String,
  type: String,
  amount: Number,
  state: String,
  product: String,
  status: { type: String, default: "failed" },
  narration: String,
  message: String,
  channel: String,
  sender: Schema.Types.Mixed,
  beneficiary: Schema.Types.Mixed,
  requestData: Schema.Types.Mixed,
  debitAccount: String,
  charge: Number,
  commission: Number,
  source: String,
  data: [
    {
      note: String,
      actor: String,
      object: Schema.Types.Mixed,
      context: String,
      dateCreated: {
        type: Date,
        default: Date.now
      }
    }
  ],
  transactionData: Schema.Types.Mixed,
  isCredit: Boolean
},
  { timestamps: true }
);

TransactionSchema.plugin(mongoosePaginate);

const Transaction = model<ITransaction>('transactions', TransactionSchema);

export default Transaction;
