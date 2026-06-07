import { useState } from 'react';

import type { Player, Team } from '../utils/types';
import type { Field, PlayerInput } from './types';

import TeamsMaker from '../utils/teamsMaker';

const MAX_INPUTS: number = 40;

const initialDefault: PlayerInput[] = [{ name: '', skill: '' }];

const initialTeams: Team[] = [
  { players: [], skill: 0 },
  { players: [], skill: 0 },
];

function usePlayers(initialPlayers: PlayerInput[] = initialDefault) {
  const [players, setPlayers] = useState<PlayerInput[]>(initialPlayers);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [loading, setLoading] = useState<boolean>(false);

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

  function sanitizeValue(value: string, field: Field): string {
    if (field === 'skill') {
      return limitSkillInputLength(value);
    } else {
      return removeUnsafeCharacters(value);
    }
  }

  const handleChange = (index: number, field: Field, value: string): void => {
    setSubmitted(false);

    const newPlayers: PlayerInput[] = [...players];
    newPlayers[index][field] = sanitizeValue(value, field);
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

  const submitPlayers = (): void => {
    setLoading(true);
    setSubmitted(true);

    const validPlayers: Player[] = players
      .filter(
        (player: { name: string; skill: string }): boolean =>
          player.name.trim() !== '' && player.skill.trim() !== ''
      )
      .map(
        (player: { name: string; skill: string }): Player => ({
          name: player.name,
          skill: Number.parseInt(player.skill),
        })
      );

    const teamsMaker: TeamsMaker = new TeamsMaker();

    setTimeout((): void => {
      const result: Team[] = teamsMaker.makeTeams(validPlayers);
      setTeams(result);
      setLoading(false);
    }, 10);
  };

  return {
    players,
    setPlayers,
    handleChange,
    deletePlayer,
    submitPlayers,
    submitted,
    teams,
    loading,
  };
}

export default usePlayers;
