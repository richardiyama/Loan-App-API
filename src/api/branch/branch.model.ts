import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const BranchSchema = new Schema({
  state: String,
  branchName: String,
  address: String,
  branchCode: String,
  coordinate: {
    lattitude: String,
    longitude: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

BranchSchema.index(
  { accountNumber: 'text', mobileNumber: 'text', firstName: 'text', lastName: 'text' },
  {
    weights: {
      state: 3,
      coordinate: 3,
    },
  },
);
BranchSchema.plugin(mongoosePaginate);

const Branch = model('branches', BranchSchema);

export default Branch;
