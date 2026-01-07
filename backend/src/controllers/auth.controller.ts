import { Request, Response } from 'express'

import AuthService from '../services/auth.service'

const authService = new AuthService()

export default class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body
    
    const { appToken, authenticatedUser } = await authService.checkCredentials(email, password)

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    })
  }

  async register(req: Request, res: Response) {
    const { email, password } = req.body
    
    const { appToken, authenticatedUser } = await authService.createUser(email, password)

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    })
  }

  async googleLogin(req: Request, res: Response) {
    const { googleToken } = req.body
    
    const { appToken, authenticatedUser } = await authService.validateGoogleToken(googleToken)

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    })
  }
}
