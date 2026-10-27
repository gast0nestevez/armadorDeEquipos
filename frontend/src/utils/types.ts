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

type Formation = {
  _id: string;
  players: Player[];
  createdAt: string;
};

type PlayerInput = {
  name: string;
  skill: string;
};

type Field = keyof PlayerInput;

type UsePlayersReturn = {
  players: PlayerInput[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerInput[]>>;
  handleChange: (index: number, field: Field, value: string) => void;
  deletePlayer: (index: number) => void;
  submitPlayers: () => void;
  submitted: boolean;
  teams: Team[];
  loading: boolean;
};

export type { Field, Formation, Match, Player, PlayerInput, Result, Team, UsePlayersReturn };
