import type { Request, Response } from 'express';
import type { AuthenticatedUser } from '../services/auth.service';

import { AuthService } from '../services/auth.service';

const authService: AuthService = new AuthService();

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password }: { email: string, password: string } = req.body;

    const { appToken, authenticatedUser }: { appToken: string, authenticatedUser: AuthenticatedUser } = await authService.checkCredentials(email, password);

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    });
  }

  async register(req: Request, res: Response): Promise<void> {
    const { email, password }: { email: string, password: string } = req.body;

    const { appToken, authenticatedUser }: { appToken: string, authenticatedUser: AuthenticatedUser } = await authService.createUser(email, password);

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    });
  }

  async googleLogin(req: Request, res: Response): Promise<void> {
    const { googleToken }: { googleToken: string } = req.body;

    const { appToken, authenticatedUser }: { appToken: string, authenticatedUser: AuthenticatedUser } = await authService.validateGoogleToken(googleToken);

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    });
  }
}

export { AuthController };
