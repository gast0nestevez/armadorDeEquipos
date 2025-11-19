import express from 'express'
import MatchController from '../controllers/match.controller'

const matchRouter = express.Router()
const matchController = new MatchController()

matchRouter.post('/', matchController.createMatch)
matchRouter.get('/:userId', matchController.getUserMatches)
matchRouter.delete('/:matchId', matchController.deleteMatch)

export default matchRouter
