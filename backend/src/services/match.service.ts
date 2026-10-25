import type { IMatch } from '../models/match.model';
import type { MatchData, Player } from '../utils/types';

import { AppError } from '../error/app.error';
import { ErrorCode } from '../error/errorCodes';
import matchRepo from '../repositories/match.repo';
import { isValidDate, isValidGoal, isValidResult } from '../utils/validation';

const ALLOWED_UPDATE_FIELDS: string[] = ['players', 'goals1', 'goals2', 'result', 'date'];

const assertValidMatchFields = (body: Partial<MatchData>): void => {
  if (!isValidGoal(body.goals1) || !isValidGoal(body.goals2)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 422, 'Goals must be non-negative integers');
  }

  if (!isValidResult(body.result)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 422, 'Result must be Lose, Draw, Win or empty');
  }

  if (!isValidDate(body.date)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 422, 'Date must have YYYY-MM-DD format');
  }
};

const sanitize = (body: object, allowed: string[]): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(body).filter(([key]: [string, unknown]): boolean => allowed.includes(key))
  );

class MatchService {
  async createMatch(userId: string, data: MatchData): Promise<IMatch> {
    const {
      players,
      goals1,
      goals2,
      result,
      date,
    }: {
      players: Player[];
      goals1: number;
      goals2: number;
      result: string;
      date: string;
    } = data;

    if (!userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'User not authenticated');
    }

    if (!players || !Array.isArray(players)) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 422, 'Players array is required');
    }

    assertValidMatchFields(data);

    const validPlayers: Player[] = players.filter(
      (player: Player): boolean =>
        undefined !== player?.name && undefined !== player?.team && player.name.trim() !== ''
    );

    return matchRepo.create({
      userId,
      players: validPlayers,
      goals1,
      goals2,
      result,
      date,
    });
  }

  async getUserMatches(userId: string): Promise<IMatch[]> {
    if (!userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, 401, 'User not authenticated');
    }

    return matchRepo.findByUser(userId);
  }

  async updateMatch(userId: string, matchId: string, body: MatchData): Promise<IMatch | null> {
    if (!matchId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Match id is required');
    }

    assertValidMatchFields(body);

    const filteredBody: Record<string, unknown> = sanitize(body, ALLOWED_UPDATE_FIELDS);

    const updated: IMatch | null = await matchRepo.update(userId, matchId, filteredBody);

    if (!updated) {
      throw new AppError(ErrorCode.MATCH_NOT_FOUND, 404, 'Match not found');
    }

    return updated;
  }

  async deleteMatch(userId: string, ids: string[]): Promise<{ deletedCount?: number }> {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Ids are required');
    }

    const result: { deletedCount: number | undefined } = await matchRepo.delete(userId, ids);

    if (!result.deletedCount) {
      throw new AppError(ErrorCode.MATCH_NOT_FOUND, 404, 'Match not found');
    }

    return result;
  }
}

export { MatchService };
