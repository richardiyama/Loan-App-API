import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const EconomicActivitySchema = new Schema({
  economicActivity: String,
  rankOfSales: String,
  limitsType: { type: String, default: "percent(%)" },
  grossMarginLimits: {
    limit1: Number,
    limit2: Number,
    limit3: Number,
    limit4: Number
  },
  netMarginLimits: {
    limit1: Number,
    limit2: Number,
    limit3: Number,
    limit4: Number
  },
  householdExpenseRatioLimits: {
    limit1: Number,
    limit2: Number,
    limit3: Number,
    limit4: Number
  }
}, { timestamps: true });


EconomicActivitySchema.plugin(mongoosePaginate);
const EconomicActivity = model('economicActivity', EconomicActivitySchema);

export default EconomicActivity;
