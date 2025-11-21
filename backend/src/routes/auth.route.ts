import express, { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

const authRouter = express.Router()

const client = new OAuth2Client()

authRouter.post('/', async (req: Request, res: Response) => {
  const { googleToken } = req.body
  
  try {
    // Verify Google's token
    const loginTicket = await client.verifyIdToken({
      idToken: googleToken,
      audience: process.env.CLIENT_ID,
    })

    const payload = loginTicket.getPayload()
    if (!payload) return res.status(400).json({ message: 'Invalid token' })
    
    const user = {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
    }

    // Create own jwt
    const appToken = jwt.sign(
      user,
      process.env.JWT_SECRET as string,
      { expiresIn: '365d' },
    )

    res.json({ token: appToken, user })
  } catch (e) {
    console.error(e)
    res.status(401).json({ message: 'Invalid Google token' })
  }
})

export default authRouter
