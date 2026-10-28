import type { IFormation } from '#models/formation.model.ts';
import type { IMatch } from '#models/match.model.ts';
import type { FormationData, MatchData, Player } from '#utils/types.ts';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';
import { formationRepo } from '#repositories/formation.repo.ts';
import { matchService } from '#services/match.service.ts';
import { parsePlayers } from '#utils/players.ts';

type PromoteData = Omit<MatchData, 'players'>;

const formationService = {
  createFormation: async (userId: string, data: FormationData): Promise<IFormation> => {
    const players: Player[] = parsePlayers(data.players);

    if (players.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'At least one player is required');
    }

    return formationRepo.create({ userId, players });
  },

  getUserFormations: async (userId: string): Promise<IFormation[]> => {
    return formationRepo.findByUser(userId);
  },

  deleteFormation: async (userId: string, ids: string[]): Promise<{ deletedCount?: number }> => {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Ids are required');
    }

    const result: { deletedCount: number | undefined } = await formationRepo.delete(userId, ids);

    if (!result.deletedCount) {
      throw new AppError(ErrorCode.FORMATION_NOT_FOUND, 404, 'Formation not found');
    }

    return result;
  },

  promoteToMatch: async (
    userId: string,
    formationId: string,
    body: PromoteData
  ): Promise<IMatch> => {
    if (!formationId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Formation id is required');
    }

    const formation: IFormation | null = await formationRepo.findById(userId, formationId);

    if (!formation) {
      throw new AppError(ErrorCode.FORMATION_NOT_FOUND, 404, 'Formation not found');
    }

    const match: IMatch = await matchService.createMatch(userId, {
      players: formation.players,
      goals1: body.goals1,
      goals2: body.goals2,
      result: body.result,
      date: body.date,
    });

    await formationRepo.delete(userId, [formationId]);

    return match;
  },
};

export { formationService };
