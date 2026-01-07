import { Request, Response } from 'express'

import { AuthenticatedRequest } from '../middleware/auth.middleware'
import matchService from '../services/match.service'

export default class MatchController {
  async createMatch(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest
    try {
      const userId = authReq.userId
      const match = await matchService.createMatch(userId, req.body)
      res.status(201).json(match)
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error creating match' })
    }
  }

  async getUserMatches(req: Request, res: Response) {
    const authReq = req as AuthenticatedRequest
    try {
      const userId = authReq.userId
      const matches = await matchService.getUserMatches(userId)
      res.status(200).json(matches)
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error fetching matches' })
    }
  }
  
  async updateMatch(req: Request, res: Response) {
    const { matchId } = req.params
    try {
      const updatedMatch = await matchService.updateMatch(matchId, req.body)
      res.status(200).json({ updatedMatch })
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error updating match' })
    }
  }
  
  async deleteMatch(req: Request, res: Response) {
    const { matchId } = req.params
    try {
      await matchService.deleteMatch(matchId)
      res.status(200).json({ ok: true, deleted: matchId })
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error deleting match' })
    }
  }
}
