import { Schema, model } from 'mongoose';

const VerificationSchema = new Schema({
    type: String,
    reference: String,
    isCancelled: Boolean,
    isVerified: Boolean,
    userDetail: Schema.Types.Mixed,
    verifiedDetail: Schema.Types.Mixed,
},
    { timestamps: true }
);

const Verification = model('verification', VerificationSchema);

export default Verification;