import type { IFormation } from '#models/formation.model.ts';
import type { IMatch } from '#models/match.model.ts';
import type { FormationData, MatchData, Player } from '#utils/types.ts';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';
import formationRepo from '#repositories/formation.repo.ts';
import { MatchService } from '#services/match.service.ts';

type PromoteData = Omit<MatchData, 'players'>;

const matchService: MatchService = new MatchService();

class FormationService {
  async createFormation(userId: string, data: FormationData): Promise<IFormation> {
    const { players }: { players: Player[] } = data;

    if (!userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'User not authenticated');
    }

    if (!players || !Array.isArray(players)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 422, 'Players array is required');
    }

    const validPlayers: Player[] = players.filter(
      (player: Player): boolean =>
        undefined !== player?.name && undefined !== player?.team && player.name.trim() !== ''
    );

    if (validPlayers.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 422, 'At least one player is required');
    }

    return formationRepo.create({ userId, players: validPlayers });
  }

  async getUserFormations(userId: string): Promise<IFormation[]> {
    if (!userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'User not authenticated');
    }

    return formationRepo.findByUser(userId);
  }

  async deleteFormation(userId: string, ids: string[]): Promise<{ deletedCount?: number }> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Ids are required');
    }

    const result: { deletedCount: number | undefined } = await formationRepo.delete(userId, ids);

    if (!result.deletedCount) {
      throw new AppError(ErrorCode.FORMATION_NOT_FOUND, 404, 'Formation not found');
    }

    return result;
  }

  async promoteToMatch(userId: string, formationId: string, body: PromoteData): Promise<IMatch> {
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
  }
}

export { FormationService };
