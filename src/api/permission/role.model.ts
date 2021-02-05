import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const RoleSchema = new Schema({
  role: String,
  permissions: [{
    action: String,
    isPermitted: {
      type: Boolean,
      default: false,
    },
    label: String
  }],
}, { timestamps: true });

RoleSchema.plugin(mongoosePaginate);

const Role = model('roles', RoleSchema);

export default Role;
