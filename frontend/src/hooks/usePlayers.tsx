import { useState } from 'react';

const MAX_INPUTS: number = 40;

type PlayerInput = {
  name: string;
  skill: string;
};

type Field = keyof PlayerInput;

const initialDefault: PlayerInput[] = [{ name: '', skill: '' }];

function usePlayers(initialPlayers: PlayerInput[] = initialDefault) {
  const [players, setPlayers] = useState<PlayerInput[]>(initialPlayers);

  function limitSkillInputLength(value: string): string {
    return value.replace(/[^0-9]/g, '').slice(0, 3);
  }

  function removeUnsafeCharacters(input: string): string {
    const lowercase: string = 'a-z';
    const uppercase: string = 'A-Z';
    const digits: string = '0-9';
    const special: string = 'ñÑáÁéÉíÍóÓúÚ';
    const allowedCharacters: string = `[^${lowercase}${uppercase}${digits}${special} ]`;
    const regex: RegExp = new RegExp(allowedCharacters, 'g');
    return input.replace(regex, '');
  }

  function validateValue(value: string, field: Field): string {
    if (field === 'skill') {
      value = limitSkillInputLength(value);
    } else {
      value = removeUnsafeCharacters(value);
    }
    return value;
  }

  const handleChange = (index: number, field: Field, value: string): void => {
    value = validateValue(value, field);

    const newPlayers: PlayerInput[] = [...players];
    newPlayers[index][field] = value;
    setPlayers(newPlayers);

    if (
      index === players.length - 1 &&
      newPlayers[index].name.trim() !== '' &&
      index < MAX_INPUTS - 1
    ) {
      setPlayers([...newPlayers, { name: '', skill: '' }]);
    }
  };

  const deletePlayer = (index: number): void => {
    setPlayers(players.filter((_: PlayerInput, i: number) => i !== index));
  };

  return { players, setPlayers, handleChange, deletePlayer };
}

export default usePlayers;
