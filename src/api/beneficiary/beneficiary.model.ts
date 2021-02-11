import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const BeneficiarySchema = new Schema({
  beneficiaryName: String,
  accountNumber: { type: String, unique: true, dropDups: true },
  userId: String,
  accountBank: String,
  isAccount: Boolean,
  bank: String
}, { timestamps: true });


BeneficiarySchema.plugin(mongoosePaginate);
const Beneficiary = model('beneficiary', BeneficiarySchema);

export default Beneficiary;
