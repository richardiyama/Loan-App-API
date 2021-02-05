import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const FeeSettingSchema = new Schema({
  loan: {
    interestRate: Number,
    insuranceFee: Number,
    adminFee: Number
  },
  agency: Object,

},
  { timestamps: true }
);

FeeSettingSchema.plugin(mongoosePaginate);

const FeeSetting = model('fee-setting', FeeSettingSchema);

export default FeeSetting;
