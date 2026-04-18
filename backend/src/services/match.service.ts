import type { MatchData, Player } from '../utils/types'

import matchRepo from '../repositories/match.repo'
import AppError from '../error/app.error'
import { ErrorCode } from '../error/errorCodes'
import { IMatch } from '../models/match.model'

const ALLOWED_UPDATE_FIELDS: string[] = ['players', 'goals1', 'goals2', 'result', 'date']

const sanitize = (body: object, allowed: string[]): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(body).filter(([key]: [string, unknown]) => allowed.includes(key))
  )

class MatchService {
  async createMatch(userId: string, data: MatchData): Promise<IMatch> {
    const { players, goals1, goals2, result, date }: {
      players: Player[],
      goals1: number,
      goals2: number,
      result: string,
      date: string
    } = data

    if (!userId) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        401,
        'User not authenticated'
      )
    }

    if (!players || !Array.isArray(players)) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        422,
        'Players array is required'
      )
    }

    const validPlayers: Player[] = players.filter(
      (player: Player) =>
        player &&
        player.name &&
        player.team &&
        player.name.trim() !== ''
    )

    return matchRepo.create({
      userId,
      players: validPlayers,
      goals1,
      goals2,
      result,
      date,
    })
  }

  async getUserMatches(userId: string): Promise<IMatch[]> {
    if (!userId) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        401,
        'User not authenticated'
      )
    }

    return matchRepo.findByUser(userId)
  }

  async updateMatch(matchId: string, body: MatchData): Promise<IMatch | null> {
    if (!matchId) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Match id is required'
      )
    }

    const filteredBody: Record<string, unknown> = sanitize(body, ALLOWED_UPDATE_FIELDS)

    const updated: IMatch | null = await matchRepo.update(matchId, filteredBody)

    if (!updated) {
      throw new AppError(
        ErrorCode.MATCH_NOT_FOUND,
        404,
        'Match not found'
      )
    }

    return updated
  }

  async deleteMatch(matchId: string): Promise<IMatch | null> {
    if (!matchId) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Match id is required'
      )
    }

    const deleted: IMatch | null = await matchRepo.delete(matchId)

    if (!deleted) {
      throw new AppError(
        ErrorCode.MATCH_NOT_FOUND,
        404,
        'Match not found'
      )
    }

    return deleted
  }
}

export { MatchService }
