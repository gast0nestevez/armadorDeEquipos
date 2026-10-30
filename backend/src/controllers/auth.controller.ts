import type { Request, Response } from 'express';

import type { AuthenticatedUser } from '#utils/types.ts';

import { authService } from '#services/auth.service.ts';

const authController = {
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
