import { Request, Response } from 'express'
import Match from '../models/match.model'

export default class MatchController {
  async createMatch(req: Request, res: Response) {
    const { userId, players } = req.body
    if (!userId || !players) return res.status(400).json({ message: 'userId and players are required' })
    
    try {
      const match = new Match({ userId, players })
      await match.save()
  
      res.status(201).json(match)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error creating match' })
    }
  }
  
  async getUserMatches(req: Request, res: Response) {
    const { userId } = req.params
    
    try {
      const matches = await Match.find({ userId })
      res.status(200).json(matches)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error fetching matches' })
    }
  }
}
