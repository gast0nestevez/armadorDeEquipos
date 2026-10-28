import type { Request, Response } from 'express';

import type { AuthenticatedRequest } from '#middleware/auth.middleware.ts';
import type { IMatch } from '#models/match.model.ts';
import type { MatchData } from '#utils/types.ts';

import { matchService } from '#services/match.service.ts';

type MatchParams = {
  matchId: string;
};

const matchController = {
  createMatch: async (req: Request, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as AuthenticatedRequest;

    const match: IMatch = await matchService.createMatch(userId, req.body as MatchData);

    res.status(201).json({
      success: true,
      data: match,
    });
  },

  getUserMatches: async (req: Request, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as AuthenticatedRequest;

    const matches: IMatch[] = await matchService.getUserMatches(userId);

    res.status(200).json({
      success: true,
      data: matches,
    });
  },

  updateMatch: async (req: Request<MatchParams>, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as unknown as AuthenticatedRequest;
    const { matchId }: { matchId: string } = req.params;

    const updatedMatch: IMatch | null = await matchService.updateMatch(
      userId,
      matchId,
      req.body as MatchData
    );

    res.status(200).json({
      success: true,
      data: updatedMatch,
    });
  },

  deleteMatch: async (req: Request<MatchParams>, res: Response): Promise<void> => {
    const { userId }: { userId: string } = req as unknown as AuthenticatedRequest;
    const { ids }: { ids: string[] } = req.body as { ids: string[] };

    const result: { deletedCount?: number } = await matchService.deleteMatch(userId, ids);

    res.status(200).json({
      success: true,
      deleted: result.deletedCount,
    });
  },
};

export { matchController };
