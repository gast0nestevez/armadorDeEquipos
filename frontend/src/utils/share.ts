import type { Match, Player, Result } from '#utils/types.ts';

import { isoToDisplay } from '#utils/date.ts';
import { capitalize } from '#utils/string.ts';

const RESULT_LABELS: Record<Exclude<Result, ''>, string> = {
  Win: 'Victoria',
  Draw: 'Empate',
  Lose: 'Derrota',
};

const teamPlayers: (players: Player[], team: 1 | 2) => Player[] = (
  players: Player[],
  team: 1 | 2
): Player[] => players.filter((player: Player): boolean => player.team === team);

const playersToText: (teams: Player[][]) => string = (teams: Player[][]): string =>
  teams
    .map(
      (players: Player[], index: number): string =>
        `Equipo ${(index + 1).toString()}:\n` +
        (players.length === 0
          ? 'Sin jugadores'
          : players.map((player: Player): string => `  - ${capitalize(player.name)}`).join('\n'))
    )
    .join('\n\n');

const formationToText: (players: Player[]) => string = (players: Player[]): string =>
  playersToText([teamPlayers(players, 1), teamPlayers(players, 2)]);

const matchToText: (match: Match) => string = (match: Match): string => {
  const header: string[] = [
    match.date ? `Partido del ${isoToDisplay(match.date)}` : 'Partido',
    `Equipo 1 ${match.goals1.toString()} - ${match.goals2.toString()} Equipo 2`,
  ];

  if (match.result) {
    header.push(`Resultado: ${RESULT_LABELS[match.result]}`);
  }

  return `${header.join('\n')}\n\n${formationToText(match.players)}`;
};

export { formationToText, matchToText, playersToText, RESULT_LABELS, teamPlayers };
