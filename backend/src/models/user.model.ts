import mongoose, { Schema, Document } from 'mongoose'

type Provider = 'local' | 'google'

interface IUser extends Document {
  email: string
  name?: string
  passwordHash?: string
  provider: Provider
  googleId?: string
}

const userSchema: Schema = new Schema<IUser>({
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
  timestamps: true,
})

export { IUser }

export default mongoose.model<IUser>('User', userSchema)
