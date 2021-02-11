import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const PermissionV2Schema = new Schema({
  name: {
    type: String,
  },
  permissions: [
    {
      action: String,
      isPermitted: {
        type: Boolean,
        default: false,
      },
      label: String,
    },
  ],
});

// PermissionV2Schema.index(
//   { resource: 'text' },
//   {
//     weights: {
//       role: 2,
//     },
//   },
// );
PermissionV2Schema.plugin(mongoosePaginate);

const PermissionV2 = model('permissions-v2', PermissionV2Schema);

export default PermissionV2;
