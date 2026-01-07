import { Request, Response } from 'express'

import AuthService from '../services/auth.service'

const authService = new AuthService()

export default class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body
    
    try {
      const { appToken, authenticatedUser } = await authService.checkCredentials(email, password)

      res.json({ token: appToken, user: authenticatedUser })
    } catch (e) {
      console.error(e)
      res.status(401).json({ ok: false, message: 'Invalid credentials' })
    }
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body
    
    try {
      if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })
      if (password.length < 8) return res.status(400).json({ message: 'Password must have at least 8 characters' }) 

      const { appToken, authenticatedUser } = await authService.createUser(email, password)

      res.status(201).json({ token: appToken, user: authenticatedUser })
    } catch (e) {
      console.error(e)
      // 11000 is what MongoDB returns when a unique constraint is violated
      if ((e as any).code === 11000) return res.status(409).json({ message: 'Email already registered' })
      res.status(500).json({ ok: false, message: 'Error registering user' })
    }
  }

  async googleLogin(req: Request, res: Response) {
    const { googleToken } = req.body
    
    try {
      const { appToken, authenticatedUser } = await authService.validateGoogleToken(googleToken)

      res.json({ token: appToken, user: authenticatedUser })
    } catch (e) {
      console.error(e)
      res.status(401).json({ ok: false, message: 'Invalid Google token' })
    }
  }
}
