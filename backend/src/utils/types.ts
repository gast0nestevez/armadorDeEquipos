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

type AuthenticatedUser = {
  userId: string;
  name?: string;
  email: string;
};

export type { AuthenticatedUser, FormationData, MatchData, Player };
