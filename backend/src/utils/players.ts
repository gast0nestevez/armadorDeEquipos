import type { Player } from '#utils/types.ts';

import { AppError } from '#error/app.error.ts';
import { ErrorCode } from '#error/errorCodes.ts';

const isValidPlayer: (player: unknown) => player is Player = (player: unknown): player is Player =>
  typeof player === 'object' &&
  player !== null &&
  'name' in player &&
  typeof player.name === 'string' &&
  player.name.trim() !== '' &&
  'team' in player &&
  typeof player.team === 'number';

const parsePlayers: (players: unknown) => Player[] = (players: unknown): Player[] => {
  if (!Array.isArray(players)) {
    throw new AppError(ErrorCode.VALIDATION_ERROR, 400, 'Players array is required');
  }

  return players.filter(isValidPlayer);
};

export { parsePlayers };
