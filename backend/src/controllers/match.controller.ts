import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { RequestWithUserInfo } from '../middleware/auth.middleware'
import matchService from '../services/match.service'

interface JwtUserPayload extends JwtPayload {
  userId: string
}

export default class MatchController {
  async createMatch(req: RequestWithUserInfo, res: Response) {
    try {
      const { userId } = req.user as JwtUserPayload
      const match = await matchService.createMatch(userId, req.body)
      res.status(201).json(match)
    } catch (e) {
      res.status(500).json({ ok: false, message: 'Error creating match' })
    }
  }

  async getUserMatches(req: RequestWithUserInfo, res: Response) {
    try {
      const { userId } = req.user as JwtUserPayload
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
