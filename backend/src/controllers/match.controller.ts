import type { Request, Response } from 'express'

import { AuthenticatedRequest } from '../middleware/auth.middleware'
import { MatchService } from '../services/match.service'
import { IMatch } from '../models/match.model'

type MatchParams = {
  matchId: string
}

const matchService: MatchService = new MatchService()

export default class MatchController {
  async createMatch(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { userId }: { userId: string } = req

    const match: IMatch = await matchService.createMatch(userId, req.body)

    res.status(201).json({
      success: true,
      data: match,
    })
  }

  async getUserMatches(req: AuthenticatedRequest, res: Response): Promise<void> {
    const { userId }: { userId: string } = req

    const matches: IMatch[] = await matchService.getUserMatches(userId)

    res.status(200).json({
      success: true,
      data: matches,
    })
  }

  async updateMatch(req: Request<MatchParams>, res: Response): Promise<void> {
    const { matchId }: { matchId: string } = req.params

    const updatedMatch: IMatch | null = await matchService.updateMatch(matchId, req.body)

    res.status(200).json({
      success: true,
      data: updatedMatch,
    })
  }

  async deleteMatch(req: Request<MatchParams>, res: Response): Promise<void> {
    const { matchId }: { matchId: string } = req.params

    const deletedMatch: IMatch | null = await matchService.deleteMatch(matchId)

    res.status(200).json({
      success: true,
      deleted: deletedMatch,
    })
  }
}
