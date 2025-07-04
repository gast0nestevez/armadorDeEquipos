const STARTING_DIFF = 1000

class Team {
  constructor() {
    this.players = []
    this.skill = 0
  }

  addToTeam(player) {
    this.players.push(player)
    this.skill += player.skill
  }

  removeFromTeam(player) {
    this.players = this.players.filter(p => p !== player)
    this.skill -= player.skill
  }
}

class TeamsMaker {
  constructor() {
    this.resetAttributes()
  }

  makeTeams(playersData) {
    this.resetAttributes(playersData)
    
    // Randomize input to get different teams each run
    this.playersData.sort(() => Math.random() - 0.5)
    
    // Fix first player in team1
    const team1 = new Team()
    const team2 = new Team()
    team1.addToTeam(this.playersData[0])
    this.findMinDiffTeams(team1, team2, 1)
    return [
      { players: this.finalTeam1.players, skill: this.finalTeam1.skill },
      { players: this.finalTeam2.players, skill: this.finalTeam2.skill }
    ]
  }

  getMinDiff() {
    return this.minDiff
  }

  resetAttributes(playersData = []) {
    this.playersData = playersData
    this.finalTeam1 = new Team()
    this.finalTeam2 = new Team()
    this.minDiff = STARTING_DIFF
  }

  allPlayersAssigned(index) {
    return index === this.playersData.length
  }

  processPotentialSolution(team1, team2) {
    if (Math.abs(team1.skill - team2.skill) < this.minDiff) {
      this.minDiff = Math.abs(team1.skill - team2.skill)
      this.finalTeam1 = { players: [...team1.players], skill: team1.skill }
      this.finalTeam2 = { players: [...team2.players], skill: team2.skill }
    }
  }

  tryAddPlayer(targetTeam, otherTeam, index, player) {
    if (this.teamIsNotFull(targetTeam)) {
      targetTeam.addToTeam(player)
      this.findMinDiffTeams(targetTeam, otherTeam, index + 1)
      targetTeam.removeFromTeam(player)
    }
  }

  teamIsNotFull(team) {
    return team.players.length < Math.ceil(this.playersData.length / 2)
  }

  findMinDiffTeams(team1 = new Team(), team2 = new Team(), index = 0) {
    // Found a possible solution
    if (this.allPlayersAssigned(index)) {
      this.processPotentialSolution(team1, team2)
      return
    }

    const currentPlayer = this.playersData[index]
    this.tryAddPlayer(team1, team2, index, currentPlayer)
    this.tryAddPlayer(team2, team1, index, currentPlayer)
  }
}

export default TeamsMaker
