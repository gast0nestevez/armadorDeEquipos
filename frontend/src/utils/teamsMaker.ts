type Player = {
  skill: number;
  [key: string]: unknown;
}

type Team = {
  players: Player[];
  skill: number;
}

type Memo = Map<number, Set<number>>[];

class TeamsMaker {
  private players: Player[] = [];
  private playersLength: number = 0;
  private halfPlayersLength: number = 0;
  private totalSkill: number = 0;
  private maxSkillPerTeam: number = 0;

  resetAttributes(players: Player[]): void {
    this.players = this.randomizePlayers(players);
    this.playersLength = this.players.length;
    this.halfPlayersLength = Math.floor(this.playersLength / 2);
    this.totalSkill = players.reduce((sum, player) => sum + player.skill, 0);
    this.maxSkillPerTeam = Math.floor(this.totalSkill / 2);
  }

  randomizePlayers(players: Player[]): Player[] {
    return players.sort((): number => Math.random() - 0.5);
  }

  makeTeams(players: Player[]): Team[] {
    this.resetAttributes(players);

    const memo: Memo = Array.from({ length: this.halfPlayersLength + 1 }, () => new Map());
    this.fillMemoTable(memo);

    const bestSum: number = this.findClosestSumToOptimal(memo);
    const { team1, team2 }: { team1: Player[], team2: Player[]} = this.buildTeams(memo, bestSum);

    return [
      { players: team1, skill: team1.reduce((sum, player) => sum + player.skill, 0) },
      { players: team2, skill: team2.reduce((sum, player) => sum + player.skill, 0) },
    ];
  }

  fillMemoTable(memo: Memo): void {
    memo[0].set(0, new Set<number>());

    for (let i = 0; i < this.playersLength; i++) {
      const skill: number = this.players[i].skill;

      for (let count = this.halfPlayersLength - 1; count >= 0; count--) {
        for (const [sum, indexes] of memo[count]) {
          const newSum: number = sum + skill;

          if (newSum <= this.maxSkillPerTeam && !memo[count + 1].has(newSum)) {
            memo[count + 1].set(newSum, new Set<number>(indexes).add(i));
          }
        }
      }
    }
  }

  findClosestSumToOptimal(memo: Memo): number {
    let bestSum: number = 0;
    for (const [sum] of memo[this.halfPlayersLength]) {
      if (this.newBestSum(sum, bestSum)) {
        bestSum = sum;
      }
    }
    return bestSum;
  }

  newBestSum(sum: number, bestSum: number): boolean {
    return (this.totalSkill - sum) < (this.totalSkill - bestSum);
  }

  buildTeams(memo: Memo, bestSum: number): { team1: Player[]; team2: Player[] } {
    const team1Indexes = memo[this.halfPlayersLength].get(bestSum);
    const team1: Player[] = [];
    const team2: Player[] = [];

    for (let i = 0; i < this.playersLength; i++) {
      if (team1Indexes?.has(i)) {
        team1.push(this.players[i]);
      } else {
        team2.push(this.players[i]);
      }
    }
    return { team1, team2 };
  }
}

export default TeamsMaker;
