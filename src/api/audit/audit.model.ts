import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const AuditSchema = new Schema({
  username: String,
  firstName: String,
  mobileNumber: String,
  action: String,
  ip: String,
  url: String,
  method: String,
  systemUsed: String,
},
  { timestamps: true }
);

AuditSchema.plugin(mongoosePaginate);

const Audit = model('audit', AuditSchema);

export default Audit;
