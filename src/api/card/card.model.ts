import { Schema, model, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface ICard extends Document {
  authorizationCode: string,
  bin: string,
  last4: string,
  expMonth: string,
  expYear: string,
  channel: string,
  cardType: string,
  bank: string,
  countryCode: string,
  brand: string,
  default: boolean,
  userId: string,
  userFullname: string,
  email: string,
  accountName: string
}

export const CardSchema = new Schema({
  authorizationCode: String,
  bin: String,
  last4: String,
  expMonth: String,
  expYear: String,
  channel: String,
  cardType: String,
  bank: String,
  countryCode: String,
  brand: String,
  default: Boolean,
  userId: String,
  userFullname: String,
  email: String,
  accountName: String
},
  { timestamps: true }
)


CardSchema.plugin(mongoosePaginate);

const Card = model<ICard>('cards', CardSchema);

export default Card;
