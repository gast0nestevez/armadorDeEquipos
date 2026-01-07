import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

import userModel from '../models/user.model'

const client = new OAuth2Client()

interface User {
  _id?: string | any,
  name?: string,
  email?: string,
}

const EXP_DATE = '365d'
const LOCAL_PROVIDER = 'local'
const GOOGLE_PROVIDER = 'google'

export default class AuthService {
  signToken(user: User) {
    return jwt.sign(
      user,
      process.env.JWT_SECRET as string,
      { expiresIn: EXP_DATE },
    )
  }

  async generateAuthUserResponse(user: any) {
    const plainUser = user.toObject()

    const authenticatedUser = {
      userId: plainUser._id,
      name: plainUser.name,
      email: plainUser.email,
    }
    const appToken = this.signToken(authenticatedUser)

    return { appToken, authenticatedUser }
  }

  async checkCredentials(email: string, password: string) {
    const user = await userModel.findOne({ email })
    if (!user) throw new Error('User not found')
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash as string)
    if (!isValidPassword) throw new Error('Invalid password')
    
    return this.generateAuthUserResponse(user)
  }

  async createUser(email: string, password: string) {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new userModel({
      email: email.toLowerCase(),
      passwordHash,
      provider: LOCAL_PROVIDER,
    })

    await user.save()

    return this.generateAuthUserResponse(user)
  }

  async validateGoogleToken(googleToken: string) {
    const loginTicket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.CLIENT_ID,
    })

    const payload = loginTicket.getPayload()
    if (!payload) throw new Error('Invalid token')

    const user = await userModel.findOneAndUpdate(
      { email: payload.email },
      {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        provider: GOOGLE_PROVIDER,
      },
      { upsert: true, new: true }
    )
    
    return this.generateAuthUserResponse(user)
  }
}
