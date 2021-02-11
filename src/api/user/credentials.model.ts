import { Schema, model } from 'mongoose';

export const CredentialSchema = new Schema({
  mobileNumber: String,
  userId: String,
  credentialHistory: [
    {
      password: String,
      pin: String,
      dateCreated: {
        type: Date,
        default: Date.now
      }
    }
  ]
},
  { timestamps: true }
);

const credentialHistory = model('credentialHistory', CredentialSchema);

export default credentialHistory;
