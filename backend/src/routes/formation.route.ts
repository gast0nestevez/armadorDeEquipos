import type { Router } from 'express';

import express from 'express';

import { FormationController } from '#controllers/formation.controller.ts';
import { authMiddleware } from '#middleware/auth.middleware.ts';

const formationRouter: Router = express.Router();
const formationController: FormationController = new FormationController();

formationRouter.get('/', authMiddleware, formationController.getUserFormations);
formationRouter.post('/', authMiddleware, formationController.createFormation);
formationRouter.post('/:formationId/promote', authMiddleware, formationController.promoteToMatch);
formationRouter.delete('/', authMiddleware, formationController.deleteFormation);

export { formationRouter };
