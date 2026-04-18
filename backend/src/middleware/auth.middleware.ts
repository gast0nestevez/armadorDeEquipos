import type { Request, Response, NextFunction } from 'express';
import type { JwtPayload } from 'jsonwebtoken';

import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  userId: string;
  userEmail: string;
};

const authMiddleware: (req: Request, res: Response, next: NextFunction) => void = (req: Request, res: Response, next: NextFunction): void => {
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
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;

    if (!decoded.userId) {
      res.status(403).json({ error: 'Invalid token payload' });
      return;
    }

    const authReq: AuthenticatedRequest = req as AuthenticatedRequest;
    authReq.userId = decoded.userId;
    authReq.userEmail = decoded.email;

    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

export { AuthenticatedRequest, authMiddleware };
