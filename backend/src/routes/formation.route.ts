import type { Router } from 'express';

import express from 'express';

import { formationController } from '#controllers/formation.controller.ts';
import { authMiddleware } from '#middleware/auth.middleware.ts';

const formationRouter: Router = express.Router();

formationRouter.get('/', authMiddleware, formationController.getUserFormations);
formationRouter.post('/', authMiddleware, formationController.createFormation);
formationRouter.post('/:formationId/promote', authMiddleware, formationController.promoteToMatch);
formationRouter.delete('/', authMiddleware, formationController.deleteFormation);

export { formationRouter };
