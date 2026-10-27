type Player = {
  name: string;
  skill?: number;
  team: number;
};

type MatchData = {
  players: Player[];
  goals1: number;
  goals2: number;
  result: string;
  date: string;
};

type FormationData = {
  players: Player[];
};

export type { FormationData, MatchData, Player };
