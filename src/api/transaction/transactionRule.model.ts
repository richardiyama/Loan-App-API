import { Schema, model } from 'mongoose';

const TxnRuleSchema = new Schema({
  insertedBy: { type: String, default: "root" },
  tier: Number,
  dailyComulativeLimit: Number,
  maxCumulativeBalance: Number,
  maxTransactionLimit: Number,
  maxDailyLimit: Number
},
  { timestamps: true }
);

const TxnRule = model('txnsRules', TxnRuleSchema);

export default TxnRule;
