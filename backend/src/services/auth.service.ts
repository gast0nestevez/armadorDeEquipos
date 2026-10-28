import type { LoginTicket, TokenPayload } from 'google-auth-library';

import bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import type { IUser } from '#models/user.model.ts';
import type { AuthenticatedUser } from '#utils/types.ts';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';
import User from '#models/user.model.ts';
import { getEnv } from '#utils/env.ts';
import { isValidEmail, isValidPasswordLength, MAX_PASSWORD_LENGTH } from '#utils/validation.ts';

const client: OAuth2Client = new OAuth2Client();

type AuthUserResponse = {
  appToken: string;
  authenticatedUser: AuthenticatedUser;
};

const EXP_DATE: number = 60 * 60 * 24 * 30;
const LOCAL_PROVIDER: string = 'local';
const GOOGLE_PROVIDER: string = 'google';

const signToken = (user: AuthenticatedUser): string =>
  jwt.sign(user, getEnv('JWT_SECRET'), { expiresIn: EXP_DATE });

const generateAuthUserResponse = (user: IUser): AuthUserResponse => {
  const authenticatedUser: AuthenticatedUser = {
    userId: user.id as string,
    name: user.name,
    email: user.email,
  };
  const appToken: string = signToken(authenticatedUser);
  return { appToken, authenticatedUser };
};

const assertCredentials = (email: string, password: string): void => {
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Email and password are required');
  }
};

const authService = {
  checkCredentials: async (email: string, password: string): Promise<AuthUserResponse> => {
    assertCredentials(email, password);

    const user: IUser | null = await User.findOne({ email: email.toLowerCase() });
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
    assertCredentials(email, password);

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

      const user: IUser = new User({
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

    const user: IUser | null = await User.findOneAndUpdate(
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

    if (!user) {
      throw new AppError(ErrorCode.INTERNAL_SERVER_ERROR, 500, 'User could not be created');
    }

    return generateAuthUserResponse(user);
  },
};

export { authService };
