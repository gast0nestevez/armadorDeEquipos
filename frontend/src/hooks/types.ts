import type { Team } from '../utils/types';

type PlayerInput = {
  name: string;
  skill: string;
};

type Field = keyof PlayerInput;

type UsePlayersReturn = {
  players: PlayerInput[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerInput[]>>;
  handleChange: (index: number, field: keyof PlayerInput, value: string) => void;
  deletePlayer: (index: number) => void;
  submitPlayers: () => void;
  submitted: boolean;
  teams: Team[];
  loading: boolean;
};

export type { Field, UsePlayersReturn, PlayerInput };
