import { Schema, model } from 'mongoose';


const ContactSchema = new Schema(
  {
    userId: Schema.Types.ObjectId,
    contacts: {},
  },
  { timestamps: true },
);


const contacts =  model('contacts', ContactSchema);

export default contacts;
