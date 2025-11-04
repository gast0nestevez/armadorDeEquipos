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

export default authRouter
