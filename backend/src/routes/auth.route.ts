import type { Router } from 'express';

import express from 'express';

import { authController } from '#controllers/auth.controller.ts';

const authRouter: Router = express.Router();

authRouter.post('/google', authController.googleLogin);

export { authRouter };
