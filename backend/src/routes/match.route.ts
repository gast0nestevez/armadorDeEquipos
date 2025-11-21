import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware'
import MatchController from '../controllers/match.controller'

const matchRouter = express.Router()
const matchController = new MatchController()

matchRouter.get('/:userId', matchController.getUserMatches)
matchRouter.post('/', authMiddleware, matchController.createMatch)
matchRouter.put('/:matchId', authMiddleware, matchController.updateMatch)
matchRouter.delete('/:matchId', authMiddleware, matchController.deleteMatch)

export default matchRouter
