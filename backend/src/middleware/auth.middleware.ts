import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' })

  const token = authHeader.split(' ')[1] // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Token missing' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
    next()
  } catch (e) {
    return res.status(403).json({ error: 'Invalid or expired token' })
  }
}
