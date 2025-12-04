class TeamsMaker {
  resetAttributes(players) {
    // Get different teams each run
    this.players = this.randomizePlayers(players)

    this.playersLength = this.players.length
    this.halfPlayersLength = Math.floor(this.playersLength / 2)
    this.totalSkill = players.reduce((sum, player) => sum + player.skill, 0)
    this.maxSkillPerTeam = Math.floor(this.totalSkill / 2)
  }
  
  randomizePlayers(players) {
    return players.sort(() => Math.random() - 0.5)
  }

  makeTeams(players) {
    this.resetAttributes(players)
    
    // Space for 0 to half of players length
    const memo = Array.from({ length: this.halfPlayersLength + 1 }, () => new Map())
    this.fillMemoTable(memo)

    const bestSum = this.findClosestSumToOptimal(memo)
    const { team1, team2 } = this.buildTeams(memo, bestSum) 

    return [
      { players: team1, skill: team1.reduce((sum, player) => sum + player.skill, 0) },
      { players: team2, skill: team2.reduce((sum, player) => sum + player.skill, 0) }
    ]
  }

  fillMemoTable(memo) {
    // Zero players, zero skill sum
    memo[0].set(0, new Set())

    // memo[count] contains a map where the keys are reachable sums and the values are set of indexes of the players that make up that sum
    // memo[3] = { 6: {0, 2} } means that using exactly 3 players, exists a sum equal to 6 formed by players at indexes 0 and 2
    for (let i = 0; i < this.playersLength; i++) {
      const skill = this.players[i].skill

      // Iterate backwards to avoid using the same player twice
      for (let count = this.halfPlayersLength - 1; count >= 0; count--) {
        for (const [sum, indexes] of memo[count]) {
          const newSum = sum + skill

          // If the new sum is valid and not already added, store it
          if (newSum <= this.maxSkillPerTeam && !memo[count + 1].has(newSum)) {
            memo[count + 1].set(newSum, new Set(indexes).add(i))
          }
        }
      }
    }
  }

  findClosestSumToOptimal(memo) {
    let bestSum = 0
    for (const [sum, _] of memo[this.halfPlayersLength]) {
      if (this.newBestSum(sum, bestSum)) {
        bestSum = sum
      }
    }
    return bestSum
  }

  newBestSum(sum, bestSum) {
    return (this.totalSkill - sum) < (this.totalSkill - bestSum)
  }

  buildTeams(memo, bestSum) {
    const team1Indexes = memo[this.halfPlayersLength].get(bestSum)
    const team1 = []
    const team2 = []

    for (let i = 0; i < this.playersLength; i++) {
      if (team1Indexes.has(i)) {
        team1.push(this.players[i])
      } else {
        team2.push(this.players[i])
      }
    }
    return { team1, team2 }
  }
}

export default TeamsMaker
