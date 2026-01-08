import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

import userModel from '../models/user.model'
import AppError from '../error/app.error'
import { ErrorCode } from '../error/errorCodes'

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
    if (!email || !password) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Email and password are required'
      )
    }

    const user = await userModel.findOne({ email })
    if (!user) throw new AppError(
      ErrorCode.INVALID_CREDENTIALS,
      401,
      'Invalid credentials'
    )
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash as string)
    if (!isValidPassword) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        401,
        'Invalid credentials'
      )
    }
    
    return this.generateAuthUserResponse(user)
  }

  async createUser(email: string, password: string) {
    if (!email || !password) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Email and password are required'
      )
    }

    if (password.length < 8) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Password must have at least 8 characters'
      )
    }

    try {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new userModel({
        email: email.toLowerCase(),
        passwordHash,
        provider: LOCAL_PROVIDER,
      })

      await user.save()

      return this.generateAuthUserResponse(user)
    } catch (e: any) {
      if (e.code === 11000) {
        throw new AppError(
          ErrorCode.EMAIL_ALREADY_EXISTS,
          409,
          'Email already registered'
        )
      }

      throw e // Unexpected error -> 500
    }
  }

  async validateGoogleToken(googleToken: string) {
    if (!googleToken) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Google token is required'
      )
    }

    let payload

    try {
      const loginTicket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.CLIENT_ID,
      })
      
      payload = loginTicket.getPayload()
    } catch {
      throw new AppError(
        ErrorCode.INVALID_GOOGLE_TOKEN,
        401,
        'Invalid Google token'
      )
    }

    if (!payload || !payload.email) {
      throw new AppError(
        ErrorCode.INVALID_GOOGLE_TOKEN,
        401,
        'Invalid Google token'
      )
    }

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
