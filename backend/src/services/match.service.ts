import type { IMatch } from '#models/match.model.ts';
import type { MatchData, Player } from '#utils/types.ts';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';
import { matchRepo } from '#repositories/match.repo.ts';
import { parsePlayers } from '#utils/players.ts';
import { isValidDate, isValidGoal, isValidResult } from '#utils/validation.ts';

const ALLOWED_UPDATE_FIELDS: string[] = ['players', 'goals1', 'goals2', 'result', 'date'];

const assertValidMatchFields = (body: Partial<MatchData>): void => {
  if (!isValidGoal(body.goals1) || !isValidGoal(body.goals2)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Goals must be non-negative integers');
  }

  if (!isValidResult(body.result)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Result must be Lose, Draw, Win or empty');
  }

  if (!isValidDate(body.date)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Date must have YYYY-MM-DD format');
  }
};

const sanitize = (body: object, allowed: string[]): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(body).filter(([key]: [string, unknown]): boolean => allowed.includes(key))
  );

const buildUpdate = (body: Partial<MatchData>): Record<string, unknown> => {
  const update: Record<string, unknown> = sanitize(body, ALLOWED_UPDATE_FIELDS);

  if (update.players !== undefined) {
    update.players = parsePlayers(update.players);
  }

  return update;
};

const matchService = {
  createMatch: async (userId: string, data: MatchData): Promise<IMatch> => {
    const players: Player[] = parsePlayers(data.players);

    assertValidMatchFields(data);

    return matchRepo.create({
      userId,
      players,
      goals1: data.goals1,
      goals2: data.goals2,
      result: data.result,
      date: data.date,
    });
  },

  getUserMatches: async (userId: string): Promise<IMatch[]> => {
    return matchRepo.findByUser(userId);
  },

  updateMatch: async (
    userId: string,
    matchId: string,
    body: Partial<MatchData>
  ): Promise<IMatch | null> => {
    if (!matchId) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Match id is required');
    }

    assertValidMatchFields(body);

    const filteredBody: Record<string, unknown> = buildUpdate(body);

    const updated: IMatch | null = await matchRepo.update(userId, matchId, filteredBody);

    if (!updated) {
      throw new AppError(ErrorCode.MATCH_NOT_FOUND, 404, 'Match not found');
    }

    return updated;
  },

  deleteMatch: async (userId: string, ids: string[]): Promise<{ deletedCount?: number }> => {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Ids are required');
    }

    const result: { deletedCount: number | undefined } = await matchRepo.delete(userId, ids);

    if (!result.deletedCount) {
      throw new AppError(ErrorCode.MATCH_NOT_FOUND, 404, 'Match not found');
    }

    return result;
  },
};

export { matchService };
