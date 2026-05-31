type PlayerInput = {
  name: string;
  skill: string;
};

type Field = keyof PlayerInput;

type UsePlayersReturnType = {
  players: PlayerInput[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerInput[]>>;
  handleChange: (index: number, field: keyof PlayerInput, value: string) => void;
  deletePlayer: (index: number) => void;
};

export type { Field, UsePlayersReturnType, PlayerInput };
