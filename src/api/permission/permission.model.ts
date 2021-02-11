import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const PermissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [{
    action: String,
    isPermitted: {
      type: Boolean,
      default: false,
    },
    label: String
  }],
});


PermissionSchema.plugin(mongoosePaginate);

const Permission = model('permissions', PermissionSchema);

export default Permission;
