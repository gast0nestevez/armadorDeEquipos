import matchRepo from '../repositories/match.repo'
import AppError from '../error/app.error'
import { ErrorCode } from '../error/errorCodes'

export default {
  createMatch: async (userId: string, data: any) => {
    const { players, goals1, goals2, result, date } = data

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
    
    const validPlayers = players.filter(
      (player: any) =>
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
      date
    })
  },

  getUserMatches: async (userId: string) => {
    if (!userId) {
      throw new AppError(
        ErrorCode.UNAUTHORIZED,
        401,
        'User not authenticated'
      )
    }

    return matchRepo.findByUser(userId)
  },

  updateMatch: async (matchId: string, body: any) => {
    if (!matchId) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Match id is required'
      )
    }

    const sanitize = (body: Object, allowed: string[]) =>
      Object.fromEntries(
        Object.entries(body).filter(([k]) => allowed.includes(k))
      )

    const allowed = ['players', 'goals1', 'goals2', 'result', 'date']
    const filteredBody = sanitize(body, allowed)
    
    const updated = await matchRepo.update(matchId, filteredBody)

    if (!updated) {
      throw new AppError(
        ErrorCode.MATCH_NOT_FOUND,
        404,
        'Match not found'
      )
    }

    return updated
  },

  deleteMatch: async (matchId: string) => {
    if (!matchId) {
      throw new AppError(
        ErrorCode.VALIDATION_ERROR,
        400,
        'Match id is required'
      )
    }

    const deleted = await matchRepo.delete(matchId)

    if (!deleted) {
      throw new AppError(
        ErrorCode.MATCH_NOT_FOUND,
        404,
        'Match not found'
      )
    }

    return deleted
  },
}
