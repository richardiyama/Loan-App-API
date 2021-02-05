import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const LoanSettingSchema = new Schema({
  interestRate: Number,
  insertedBy: { type: String, default: "root" },
  insuranceFee: Number,
  adminFee: Number
}, { timestamps: true })

LoanSettingSchema.plugin(mongoosePaginate);
const LoanSetting = model('loanSettings', LoanSettingSchema);

export default LoanSetting;
