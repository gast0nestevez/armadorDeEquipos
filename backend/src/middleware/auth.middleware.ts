import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import jwt from 'jsonwebtoken';

import { getEnv } from '../utils/env';

type AuthenticatedRequest = {
  userId: string;
  userEmail: string;
} & Request;

const authMiddleware: (req: Request, res: Response, next: NextFunction) => void = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader: string | undefined = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: 'Authorization header missing' });
    return;
  }

  const [scheme, token]: string[] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    res.status(401).json({ error: 'Invalid authorization format' });
    return;
  }

  try {
    const decoded: JwtPayload = jwt.verify(token, getEnv('JWT_SECRET')) as JwtPayload;

    if (!decoded.userId) {
      res.status(403).json({ error: 'Invalid token payload' });
      return;
    }

    const authReq: AuthenticatedRequest = req as AuthenticatedRequest;
    authReq.userId = decoded.userId as string;
    authReq.userEmail = decoded.email as string;

    next();
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  } catch (e) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export type { AuthenticatedRequest };
export { authMiddleware };
