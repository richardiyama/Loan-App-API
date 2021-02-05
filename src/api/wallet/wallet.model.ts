import { model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export const WalletSchema = new Schema({

})
WalletSchema.plugin(mongoosePaginate);
const Wallet = model('wallets', WalletSchema)
export default Wallet
