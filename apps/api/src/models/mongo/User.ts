import mongoose, { Schema, Document } from 'mongoose';
import { User as UserType } from '@skillswap/types';

export interface IUserModel extends Omit<UserType, '_id' | 'createdAt'>, Document {
  passwordHash: string;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    bio: { type: String, default: '' },
    skillTags: { type: [String], default: [], validate: [(val: string[]) => val.length <= 10, '{PATH} exceeds the limit of 10'] },
    avatarUrl: { type: String, default: '' },
    reputationScore: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    completenessScore: { type: Number, default: 0 },
    timezone: { type: String, default: 'UTC' },
    availabilityToggle: { type: Boolean, default: true },
    refreshToken: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserModel>('User', UserSchema);
