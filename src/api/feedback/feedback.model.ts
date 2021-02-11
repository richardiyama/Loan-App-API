import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const FeedbackSchema = new Schema({
  userId: String,
  fullname: String,
  rating: Number,
  comment: String
}, { timestamps: true })

FeedbackSchema.plugin(mongoosePaginate);
const Feedback = model('feedbacks', FeedbackSchema);

export default Feedback;
