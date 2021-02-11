import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


const notificationSchema = new Schema({
  url: String,
  statusText: String,
  status: String
},  { timestamps: true })
notificationSchema.plugin(mongoosePaginate)
const Notification = model("notifications", notificationSchema)

export default Notification;
