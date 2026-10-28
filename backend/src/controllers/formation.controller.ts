import type { Request, Response } from 'express';

import type { AuthenticatedRequest } from '#middleware/auth.middleware.ts';
import type { IFormation } from '#models/formation.model.ts';
import type { IMatch } from '#models/match.model.ts';
import type { FormationData, MatchData } from '#utils/types.ts';

import { formationService } from '#services/formation.service.ts';

type FormationParams = {
  formationId: string;
};

const formationController = {
  createFormation: async (req: Request, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as AuthenticatedRequest;

    const formation: IFormation = await formationService.createFormation(
      userId,
      req.body as FormationData
    );

    res.status(201).json({
      success: true,
      data: formation,
    });
  },

  getUserFormations: async (req: Request, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as AuthenticatedRequest;

    const formations: IFormation[] = await formationService.getUserFormations(userId);

    res.status(200).json({
      success: true,
      data: formations,
    });
  },

  promoteToMatch: async (req: Request<FormationParams>, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as unknown as AuthenticatedRequest;
    const { formationId }: { formationId: string } = req.params;

    const match: IMatch = await formationService.promoteToMatch(
      userId,
      formationId,
      req.body as Omit<MatchData, 'players'>
    );

    res.status(201).json({
      success: true,
      data: match,
    });
  },

  deleteFormation: async (req: Request, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as AuthenticatedRequest;
    const { ids }: { ids: string[] } = req.body as { ids: string[] };

    const result: { deletedCount?: number } = await formationService.deleteFormation(userId, ids);

    res.status(200).json({
      success: true,
      deleted: result.deletedCount,
    });
  },
};

export { formationController };
