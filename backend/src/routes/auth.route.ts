import type { Router } from 'express';

import express from 'express';

import { authController } from '#controllers/auth.controller.ts';

const authRouter: Router = express.Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/googleLogin', authController.googleLogin);

export { authRouter };
