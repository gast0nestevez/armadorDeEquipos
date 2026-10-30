import type { LoginTicket, TokenPayload } from 'google-auth-library';

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import type { IUser } from '#models/user.model.ts';
import type { AuthenticatedUser } from '#utils/types.ts';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';
import User from '#models/user.model.ts';
import { getEnv } from '#utils/env.ts';

const client: OAuth2Client = new OAuth2Client();

type AuthUserResponse = {
  appToken: string;
  authenticatedUser: AuthenticatedUser;
};

const EXP_DATE: number = 60 * 60 * 24 * 30;
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

const authService = {
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
          provider: GOOGLE_PROVIDER,
        },
        $unset: {
          passwordHash: '',
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
