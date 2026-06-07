import type { Router } from 'express';

import express from 'express';

import { MatchController } from '../controllers/match.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const matchRouter: Router = express.Router();
const matchController: MatchController = new MatchController();

matchRouter.get('/', authMiddleware, matchController.getUserMatches);
matchRouter.post('/', authMiddleware, matchController.createMatch);
matchRouter.put('/:matchId', authMiddleware, matchController.updateMatch);
matchRouter.delete('/', authMiddleware, matchController.deleteMatch);

export default matchRouter;
