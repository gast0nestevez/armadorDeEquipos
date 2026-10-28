import type { Request, Response } from 'express';

import type { AuthenticatedUser } from '#services/auth.service.ts';

import { authService } from '#services/auth.service.ts';

const authController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body as {
      email: string;
      password: string;
    };

    const {
      appToken,
      authenticatedUser,
    }: { appToken: string; authenticatedUser: AuthenticatedUser } =
      await authService.checkCredentials(email, password);

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    });
  },

  register: async (req: Request, res: Response): Promise<void> => {
    const { email, password }: { email: string; password: string } = req.body as {
      email: string;
      password: string;
    };

    const {
      appToken,
      authenticatedUser,
    }: { appToken: string; authenticatedUser: AuthenticatedUser } = await authService.createUser(
      email,
      password
    );

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    });
  },

  googleLogin: async (req: Request, res: Response): Promise<void> => {
    const { googleToken }: { googleToken: string } = req.body as { googleToken: string };

    const {
      appToken,
      authenticatedUser,
    }: { appToken: string; authenticatedUser: AuthenticatedUser } =
      await authService.validateGoogleToken(googleToken);

    res.json({
      success: true,
      data: {
        token: appToken,
        user: authenticatedUser,
      },
    });
  },
};

export { authController };
