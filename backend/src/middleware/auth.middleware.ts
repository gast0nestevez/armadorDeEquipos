import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import jwt from 'jsonwebtoken';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';
import { getEnv } from '#utils/env.ts';

type AuthenticatedRequest = {
  userId?: string;
} & Request;

const authMiddleware: (req: Request, _res: Response, next: NextFunction) => void = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'Authorization header missing');
  }

  const [scheme, token]: string[] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'Invalid authorization format');
  }

  const secret: string = getEnv('JWT_SECRET');
  let decoded: string | JwtPayload;

  try {
    decoded = jwt.verify(token, secret);
  } catch (err: unknown) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(ErrorCode.TOKEN_EXPIRED, 401, 'Token expired');
    }

    throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'Invalid token');
  }

  if (typeof decoded === 'string' || typeof decoded.userId !== 'string') {
    throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'Invalid token payload');
  }

  (req as AuthenticatedRequest).userId = decoded.userId;

  next();
};

const getUserId: (req: Request) => string = (req: Request): string => {
  const { userId }: AuthenticatedRequest = req;

  if (!userId) {
    throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'User not authenticated');
  }

  return userId;
};

export { authMiddleware, getUserId };
