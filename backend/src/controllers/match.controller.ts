import type { Request, Response } from 'express';

import type { AuthenticatedRequest } from '../middleware/auth.middleware';
import type { IMatch } from '../models/match.model';
import type { MatchData } from '../utils/types';

import { MatchService } from '../services/match.service';

type MatchParams = {
  matchId: string;
};

const matchService: MatchService = new MatchService();

class MatchController {
  async createMatch(req: Request, res: Response): Promise<void> {
    const { userId }: { userId: string } = req as AuthenticatedRequest;

    const match: IMatch = await matchService.createMatch(userId, req.body as MatchData);

    res.status(201).json({
      success: true,
      data: match,
    });
  }

  async getUserMatches(req: Request, res: Response): Promise<void> {
    const { userId }: { userId: string } = req as AuthenticatedRequest;

    const matches: IMatch[] = await matchService.getUserMatches(userId);

    res.status(200).json({
      success: true,
      data: matches,
    });
  }

  async updateMatch(req: Request<MatchParams>, res: Response): Promise<void> {
    const { matchId }: { matchId: string } = req.params;

    const updatedMatch: IMatch | null = await matchService.updateMatch(
      matchId,
      req.body as MatchData
    );

    res.status(200).json({
      success: true,
      data: updatedMatch,
    });
  }

  async deleteMatch(req: Request<MatchParams>, res: Response): Promise<void> {
    const { matchId }: { matchId: string } = req.params;

    const deletedMatch: IMatch | null = await matchService.deleteMatch(matchId);

    res.status(200).json({
      success: true,
      deleted: deletedMatch,
    });
  }
}

export { MatchController };
