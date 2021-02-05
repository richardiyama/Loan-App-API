import { Schema, model } from 'mongoose';

export const BillCommissionSchema = new Schema({
  serviceId: String,
  commission: Number,
  type: String
},
  { timestamps: true });

const BillCommission = model('billSchema', BillCommissionSchema);
export default BillCommission;
