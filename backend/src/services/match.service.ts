import matchRepo from '../repositories/match.repo'

export default {
  createMatch: async (userId: string, data: any) => {
    const { players, goals1, goals2, result, date } = data

    if (!userId || !players)
      throw new Error('userId and players are required')

    const validPlayers = players.filter(
      (player: any) => player && player.name && player.team && player.name.trim() !== ''
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
    return matchRepo.findByUser(userId)
  },

  updateMatch: async (matchId: string, body: any) => {
    const sanitize = (body: Object, allowed: string[]) =>
      Object.fromEntries(
        Object.entries(body).filter(([k]) => allowed.includes(k))
      )

    const allowed = ['players', 'goals1', 'goals2', 'result', 'date']
    const filteredBody = sanitize(body, allowed)
    
    return matchRepo.update(matchId, filteredBody)
  },

  deleteMatch: async (matchId: string) => {
    return matchRepo.delete(matchId)
  }
}
