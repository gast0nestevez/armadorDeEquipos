import type { Document } from 'mongoose';

import mongoose, { Schema } from 'mongoose';

type Provider = 'local' | 'google';

type IUser = {
  id: string;
  email: string;
  name?: string;
  passwordHash?: string;
  provider: Provider;
  googleId?: string;
} & Document;

const userSchema: Schema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: String,
    passwordHash: String,
    provider: {
      type: String,
      enum: ['local', 'google'],
      required: true,
    },
    googleId: String,
  },
  {
    timestamps: true,
  }
);

export type { IUser };

export default mongoose.model<IUser>('User', userSchema);
