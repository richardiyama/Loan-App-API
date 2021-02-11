import { Schema, model } from 'mongoose';

export const CheckExistingLoanSchema = new Schema({
  userId: String,
  mobileNumber: String,
  existingLoan: Boolean
}, { timestamps: true })

const CheckExistingLoan = model('checkExistingLoan', CheckExistingLoanSchema);

export default CheckExistingLoan;
