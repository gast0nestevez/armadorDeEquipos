import { Request, Response } from 'express'

import { AuthenticatedRequest } from '../middleware/auth.middleware'
import matchService from '../services/match.service'

export default class MatchController {
  async createMatch(req: Request, res: Response) {
    const { userId } = req as AuthenticatedRequest

    const match = await matchService.createMatch(userId, req.body)
    
    res.status(201).json({
      success: true,
      data: match,
    })
  }

  async getUserMatches(req: Request, res: Response) {
    const { userId } = req as AuthenticatedRequest
    
    const matches = await matchService.getUserMatches(userId)
      
    res.status(200).json({
      success: true,
      data: matches,
    })
  }
  
  async updateMatch(req: Request, res: Response) {
    const { matchId } = req.params

    const updatedMatch = await matchService.updateMatch(matchId, req.body)
      
    res.status(200).json({
      success: true,
      data: updatedMatch,
    })
  }
  
  async deleteMatch(req: Request, res: Response) {
    const { matchId } = req.params
    
    await matchService.deleteMatch(matchId) //const deletedMatch y devolverlo
    
    res.status(200).json({
      success: true,
      deleted: matchId,
    })
  }
}
