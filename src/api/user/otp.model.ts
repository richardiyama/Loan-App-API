import { Schema, model } from 'mongoose';

export const OTPSchema = new Schema({
  mobileNumber: String,
  userId: String,
  OTPCode: {
    code: String,
    expiresIn: Date,
  }
},
  { timestamps: true }
);

const OTP = model('otps', OTPSchema);

export default OTP;
