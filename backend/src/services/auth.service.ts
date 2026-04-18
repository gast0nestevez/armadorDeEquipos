import type { LoginTicket, TokenPayload } from 'google-auth-library';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

import userModel, { IUser } from '../models/user.model';
import { AppError } from '../error/app.error';
import { ErrorCode } from '../error/errorCodes';
import { getEnv } from '../utils/env';

const client: OAuth2Client = new OAuth2Client();

type User = {
  id?: string;
  name?: string;
  email?: string;
};

type AuthUserResponse = {
  appToken: string;
  authenticatedUser: {
    userId: string;
    name: string;
    email: string;
  };
};

const EXP_DATE: number = 60 * 60 * 24 * 365;
const LOCAL_PROVIDER: string = 'local';
const GOOGLE_PROVIDER: string = 'google';

type AuthenticatedUser = {
  userId: string;
  name: string;
  email: string;
};

class AuthService {
  signToken(user: User): string {
    return jwt.sign(
      user,
      getEnv('JWT_SECRET'),
      { expiresIn: EXP_DATE },
    );
  };

  async generateAuthUserResponse(user: IUser): Promise<AuthUserResponse> {
    const plainUser = user.toObject();

    const authenticatedUser = {
      userId: plainUser.id,
      name: plainUser.name,
      email: plainUser.email,
    };
    const appToken: string = this.signToken(authenticatedUser);

    return { appToken, authenticatedUser };
  };

  async checkCredentials(email: string, password: string): Promise<AuthUserResponse> {
    if (!email || !password) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Email and password are required'
      );
    }

    const user: IUser | null = await userModel.findOne({ email });
    if (!user)  {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        401,
        'Invalid credentials',
      );
    }

    const isValidPassword: boolean = await bcrypt.compare(password, user.passwordHash as string);
    if (!isValidPassword) {
      throw new AppError(
        ErrorCode.INVALID_CREDENTIALS,
        401,
        'Invalid credentials',
      );
    }

    return this.generateAuthUserResponse(user);
  };

  async createUser(email: string, password: string): Promise<AuthUserResponse> {
    if (!email || !password) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Email and password are required',
      );
    }

    if (password.length < 8) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Password must have at least 8 characters',
      );
    }

    try {
      const saltRounds: number = 10;
      const passwordHash: string = await bcrypt.hash(password, saltRounds);

      const user: IUser = new userModel({
        email: email.toLowerCase(),
        passwordHash,
        provider: LOCAL_PROVIDER,
      });

      await user.save();

      return this.generateAuthUserResponse(user);
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && err.code === 11000) {
        throw new AppError(
          ErrorCode.EMAIL_ALREADY_EXISTS,
          409,
          'Email already registered',
        );
      }

      throw err;
    }
  };

  async validateGoogleToken(googleToken: string): Promise<AuthUserResponse> {
    if (!googleToken) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Google token is required',
      );
    }

    let payload: TokenPayload | undefined = undefined;

    try {
      const loginTicket: LoginTicket = await client.verifyIdToken({
        idToken: googleToken,
        audience: getEnv('CLIENT_ID'),
      });

      payload = loginTicket.getPayload();
    } catch {
      throw new AppError(
        ErrorCode.INVALID_GOOGLE_TOKEN,
        401,
        'Invalid Google token',
      );
    }

    if (!payload || !payload.email) {
      throw new AppError(
        ErrorCode.INVALID_GOOGLE_TOKEN,
        401,
        'Invalid Google token',
      );
    }

    const user = await userModel.findOneAndUpdate(
      { email: payload.email },
      {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub,
        provider: GOOGLE_PROVIDER,
      },
      { upsert: true, new: true },
    );

    return this.generateAuthUserResponse(user);
  }
}

export { AuthService, AuthenticatedUser };
