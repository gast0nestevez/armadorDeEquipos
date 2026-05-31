type Player = {
  _id?: string;
  name: string;
  skill: number;
  team?: 1 | 2;
};

type Team = {
  players: Player[];
  skill: number;
};

type Result = 'Win' | 'Draw' | 'Lose' | '';

type Match = {
  _id: string;
  players: Player[];
  goals1: number;
  goals2: number;
  result: Result;
  date: string;
};

export type { Player, Result, Match, Team };
