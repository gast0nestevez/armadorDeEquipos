import mongoose, { Schema, Document } from 'mongoose'

export interface User extends Document {
  email: string
  name?: string
  passwordHash?: string
  provider: 'local' | 'google'
  googleId?: string
}

const userSchema = new Schema<User>({
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
}, {
  timestamps: true
})

export default mongoose.model<User>('User', userSchema)
