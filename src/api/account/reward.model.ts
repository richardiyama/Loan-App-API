import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const rewardSchema = new Schema({
  referredFirstName: String,
  referredLastName: String,
  referredMobileNumber: String,
  amount: Number,
  channel: String,
  referrerMobileNumber: String,
  referrerAccountNumber: String,
  referrerUserId: String,
  rewardType: String,
  status: Boolean,
  reason: String
},
  { timestamps: true }
);

rewardSchema.index(
  { referrerMobileNumber: 'text', referrerAccountNumber: 'text', referrerUserId: 'text', channel: 'text' },
  {
    weights: {
      referrerMobileNumber: 3,
      referrerAccountNumber: 3,
      referrerUserId: 2,
      channel: 2,
    },
  },
);
rewardSchema.plugin(mongoosePaginate);

const Reward = model('rewards', rewardSchema);

export default Reward;
