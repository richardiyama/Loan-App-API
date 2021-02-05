import { Schema, model } from 'mongoose';

const InterestRateTemplateSchema = new Schema(
  {
    tenor: Number,
    interestRate: Number,
    processingFee: Number,
    type: String
  },
  { timestamps: true },
);

const InterestRate = model('interestRates', InterestRateTemplateSchema);

export default InterestRate;
