import type { LoginTicket, TokenPayload } from 'google-auth-library';

import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import type { IUser } from '#models/user.model.ts';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';
import userModel from '#models/user.model.ts';
import { getEnv } from '#utils/env.ts';
import { isValidEmail, isValidPasswordLength, MAX_PASSWORD_LENGTH } from '#utils/validation.ts';

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

const EXP_DATE: number = 60 * 60 * 24 * 30;
const LOCAL_PROVIDER: string = 'local';
const GOOGLE_PROVIDER: string = 'google';

type AuthenticatedUser = {
  userId: string;
  name: string;
  email: string;
};

const signToken = (user: User): string =>
  jwt.sign(user, getEnv('JWT_SECRET'), { expiresIn: EXP_DATE });

const generateAuthUserResponse = (user: IUser): AuthUserResponse => {
  const authenticatedUser: AuthenticatedUser = {
    userId: user.id as string,
    name: user.name as string,
    email: user.email,
  };
  const appToken: string = signToken(authenticatedUser);
  return { appToken, authenticatedUser };
};

const authService = {
  checkCredentials: async (email: string, password: string): Promise<AuthUserResponse> => {
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Email and password are required');
    }

    const user: IUser | null = await userModel.findOne({ email: email.toLowerCase() });
    if (!user?.passwordHash) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401, 'Invalid credentials');
    }

    const isValidPassword: boolean = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401, 'Invalid credentials');
    }

    return generateAuthUserResponse(user);
  },

  createUser: async (email: string, password: string): Promise<AuthUserResponse> => {
    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Email and password are required');
    }

    if (!isValidEmail(email)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Email format is invalid');
    }

    if (!isValidPasswordLength(password)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        `Password must have between 8 and ${MAX_PASSWORD_LENGTH} characters`
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

      return generateAuthUserResponse(user);
    } catch (err: unknown) {
      if (err instanceof Error && 'code' in err && err.code === 11000) {
        throw new AppError(ErrorCode.EMAIL_ALREADY_EXISTS, 409, 'Email already registered');
      }

      throw err;
    }
  },

  validateGoogleToken: async (googleToken: string): Promise<AuthUserResponse> => {
    if (!googleToken) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Google token is required');
    }

    let payload: TokenPayload | undefined = undefined;

    try {
      const loginTicket: LoginTicket = await client.verifyIdToken({
        idToken: googleToken,
        audience: getEnv('CLIENT_ID'),
      });

      payload = loginTicket.getPayload();
    } catch {
      throw new AppError(ErrorCode.INVALID_GOOGLE_TOKEN, 401, 'Invalid Google token');
    }

    if (!payload?.email || !payload.email_verified) {
      throw new AppError(ErrorCode.INVALID_GOOGLE_TOKEN, 401, 'Invalid Google token');
    }

    const user = await userModel.findOneAndUpdate(
      { email: payload.email.toLowerCase() },
      {
        $set: {
          name: payload.name,
          googleId: payload.sub,
        },
        $setOnInsert: {
          provider: GOOGLE_PROVIDER,
        },
      },
      { upsert: true, new: true }
    );

    return generateAuthUserResponse(user);
  },
};

export type { AuthenticatedUser };
export { authService };
