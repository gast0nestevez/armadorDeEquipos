import { Request, Response } from 'express'
import Match from '../models/match.model'

export default class MatchController {
  async createMatch(req: Request, res: Response) {
    const { userId, players } = req.body
    if (!userId || !players) return res.status(400).json({ message: 'userId and players are required' })
    
    try {
      const match = new Match({ userId, players })
      console.log(match)
      await match.save()
  
      res.status(201).json(match)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Error creating match' })
    }
  }
  
  async getUserMatches(req: Request, res: Response) {
    const { userId } = req.params
    
    try {
      const matches = await Match.find({ userId })
      res.status(200).json(matches)
    } catch (e) {
      console.error(e)
      res.status(500).json({ message: 'Error fetching matches' })
    }
  }

  async deleteMatch(req: Request, res: Response) {
    const { matchId } = req.params

    try {
      await Match.findByIdAndDelete(matchId)
      res.status(200).json({ ok: true, deleted: matchId })
    } catch (e) {
      console.log(e)
      res.status(500).json({ ok: false, message: 'Error deleting match' })
    }
  }
}
