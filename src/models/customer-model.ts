import * as mongoose from 'mongoose';
import { extendBaseSchema } from './base-model';

const CustomerSchema: mongoose.Schema = extendBaseSchema(new mongoose.Schema({
  deviceIds: { type: [String] },
  conversations: [{type: mongoose.Schema.Types.ObjectId, ref: 'ConversationState'}],
  wishlistProducts: [Object], // ProductInterface array
  wishlistOffers: [Object] // OfferInterface array
}));

export const CustomerModel = mongoose.model('Customer', CustomerSchema);
