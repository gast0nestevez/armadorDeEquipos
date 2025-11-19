import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

const authRouter = express.Router()

const client = new OAuth2Client()

authRouter.post('/', async (req: Request, res: Response) => {
  const { token } = req.body
  
  try {
    // Verify Google's token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) return res.status(400).json({ message: 'Invalid token' })
    
    // Create own jwt
    const appToken = jwt.sign(
      { userId: payload.sub, name: payload.name, email: payload.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' },
    )

    res.json({ token: appToken })
  } catch (err) {
    console.error(err)
    res.status(401).json({ message: 'Invalid Google token' })
  }
})

authRouter.get('/validate', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' })
  console.log('authHeader: ', authHeader)

  const token = authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Invalid Authorization header format' })

  const secret = process.env.JWT_SECRET as string 
  if (!secret) {
    console.error('JWT_SECRET not set')
    return res.status(500).json({ message: 'Server configuration error' })
  }

  try {
    const decoded = jwt.verify(token, secret)
    if (typeof decoded !== 'object' || decoded === null) return res.status(401).json({ message: 'Invalid token payload' })

    console.log('decoded: ', decoded)
    const user = {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
    }

    return res.json({ user })
  } catch (err) {
    console.error('Token validation error:', err)
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
})

export default authRouter
