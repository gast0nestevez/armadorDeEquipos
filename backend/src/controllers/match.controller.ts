import { Request, Response } from 'express'
import Match from '../models/match.model'

const sanitize = (body: Object, allowed: String[]) =>
  Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  )

export default class MatchController {
  async createMatch(req: Request, res: Response) {
    const { userId, players, goals1, goals2, result } = req.body
    if (!userId || !players) return res.status(400).json({ message: 'userId and players are required' })
    
    const validPlayers = players.filter(
      (player: any) => player && player.name && player.team && player.name.trim() !== ''
    )

    try {
      const match = new Match({ userId, players: validPlayers, goals1, goals2, result })
      await match.save()
  
      res.status(201).json(match)
    } catch (e) {
      console.error(e)
      res.status(500).json({ ok: false, message: 'Error creating match' })
    }
  }
  
  async getUserMatches(req: Request, res: Response) {
    const { userId } = req.params
    
    try {
      const matches = await Match.find({ userId }).sort({ createdAt: -1 })
      res.status(200).json(matches)
    } catch (e) {
      console.error(e)
      res.status(500).json({ ok: false, message: 'Error fetching matches' })
    }
  }

  async deleteMatch(req: Request, res: Response) {
    const { matchId } = req.params

    try {
      await Match.findByIdAndDelete(matchId)
      res.status(200).json({ ok: true, deleted: matchId })
    } catch (e) {
      console.error(e)
      res.status(500).json({ ok: false, message: 'Error deleting match' })
    }
  }

  async updateMatch(req: Request, res: Response) {
    const { matchId } = req.params
    const filteredBody = sanitize(req.body, [
      'players',
      'goals1',
      'goals2',
      'result'
    ])

    try {
      const updatedMatch = await Match.findByIdAndUpdate(
        matchId,
        filteredBody,
        { new: true, runValidators: true }
      )
      res.status(200).json({ updatedMatch })
    } catch (e) {
      console.error(e)
      res.status(500).json({ ok: false, message: 'Error updating match' })
    }
  }
}
