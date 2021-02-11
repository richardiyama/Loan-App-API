import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const deletedCardSchema = new Schema({
  bankCode: String,
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
  default: String,
  userCode: String,
  userId: String,
  userMobile: String,
  userFullname: String,
  email: String
}, { timestamps: true })

deletedCardSchema.plugin(mongoosePaginate);

const deletedCard = model('deletedCards', deletedCardSchema);

export default deletedCard;
