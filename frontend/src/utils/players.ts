import type { PlayerInput } from '#utils/types.ts';

const findMissingSkillIndex: (players: PlayerInput[]) => number = (
  players: PlayerInput[]
): number =>
  players.findIndex(
    (player: PlayerInput): boolean => player.name.trim() !== '' && player.skill.trim() === ''
  );

export { findMissingSkillIndex };
