type Player = {
  name: string;
  team: string;
};

type MatchData = {
  players: Player[];
  goals1: number;
  goals2: number;
  result: string;
  date: string;
};

export { Player, MatchData };
