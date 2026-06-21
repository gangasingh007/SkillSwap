import mongoose, { Schema, Document } from 'mongoose';
import { Listing as ListingType } from '@skillswap/types';

export interface IListingModel extends Omit<ListingType, '_id' | 'createdAt'>, Document {
  skillTags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ListingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    category: {
      type: String,
      required: true,
      enum: ['Development', 'Design', 'Marketing', 'Writing', 'Business', 'Education', 'Other'],
    },
    skillTags: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length <= 10, '{PATH} exceeds the limit of 10'],
    },
    cashPrice: { type: Number, required: true, min: 500 }, // USD cents — minimum $5
    creditPrice: { type: Number, required: true, min: 1 },
    deliveryFormat: {
      type: String,
      required: true,
      enum: ['async', 'live_call', 'document'],
    },
    turnaroundDays: { type: Number, required: true, min: 1, max: 90 },
    revisionsIncluded: { type: Number, required: true, min: 0, max: 10 },
    samples: {
      type: [
        {
          type: { type: String, enum: ['image', 'pdf', 'link'], required: true },
          url: { type: String, required: true },
        },
      ],
      default: [],
      validate: [(val: unknown[]) => val.length <= 5, '{PATH} exceeds the limit of 5 portfolio samples'],
    },
    visibility: {
      type: String,
      enum: ['public', 'credits_only', 'cash_only'],
      default: 'public',
    },
    isActive: { type: Boolean, default: true },
    analytics: {
      views: { type: Number, default: 0 },
      requests: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 },
    },
    isPromoted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ListingSchema.index(
  { title: 'text', description: 'text', skillTags: 'text' },
  { weights: { title: 10, skillTags: 5, description: 1 } }
);

ListingSchema.index({ category: 1, isActive: 1, cashPrice: 1 });
ListingSchema.index({ isActive: 1, createdAt: -1 });

export default mongoose.model<IListingModel>('Listing', ListingSchema);
