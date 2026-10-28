import type { Router } from 'express';

import express from 'express';

import { matchController } from '#controllers/match.controller.ts';
import { authMiddleware } from '#middleware/auth.middleware.ts';

const matchRouter: Router = express.Router();

matchRouter.get('/', authMiddleware, matchController.getUserMatches);
matchRouter.post('/', authMiddleware, matchController.createMatch);
matchRouter.put('/:matchId', authMiddleware, matchController.updateMatch);
matchRouter.delete('/', authMiddleware, matchController.deleteMatch);

export { matchRouter };
