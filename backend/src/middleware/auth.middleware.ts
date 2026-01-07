import { Request, Response, NextFunction, RequestHandler } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  userId: string
  userEmail: string
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' })

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Invalid authorization format' })

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload

    if (!decoded.userId) return res.status(403).json({ error: 'Invalid token payload' })

    const authReq = req as AuthenticatedRequest
    authReq.userId = decoded.userId
    authReq.userEmail = decoded.email

    next()
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
