import type { Player } from '@/utils/types';

import { useContext } from 'react';

import TeamCard from '@/components/TeamCard';
import { capitalize } from '@/utils/string';
import { UserContext } from '@/context/userContext';
import useFlashMessage from '@/hooks/useFlashMessage';
import { Env } from '@/utils/env';

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

type Team = {
  players: Player[];
  skill: number;
};

type MappedPlayer = {
  name: string;
  skill: number;
  team: number;
};

type TeamsDisplayProps = {
  teams: Team[];
  loading: boolean;
  teamsRef: React.RefObject<HTMLDivElement>;
};

const TeamsDisplay = ({ teams, loading, teamsRef }: TeamsDisplayProps) => {
  const { user } = useContext(UserContext);
  const copyMessage = useFlashMessage();
  const saveMessage = useFlashMessage();

  const playersNotEmpty: boolean = teams[0].players.length > 0 || teams[1].players.length > 0;

  const teamsToString = (): string => {
    return teams.map((team: Team, index: number): string =>
      `Equipo ${index + 1}:\n` +
      (team.players.length === 0
        ? 'Sin jugadores\n'
        : team.players
            .sort()
            .map((player: Player): string => `  - ${capitalize(player.name)}`)
            .join('\n'))
    ).join('\n\n');
  };

  const copyToClipboard = (): void => {
    copyMessage.trigger();
    navigator.clipboard.writeText(teamsToString());
  };

  const mapTeamsToPlayers = (teams: Team[]): MappedPlayer[] =>
    teams.flatMap((team: Team, index: number) =>
      team.players.map((p: Player): MappedPlayer => ({
        name: capitalize(p.name),
        skill: p.skill,
        team: index + 1,
      }))
    );

  const saveMatch = async (): Promise<void> => {
    saveMessage.trigger();
    const players: MappedPlayer[] = mapTeamsToPlayers(teams);

    const url: string = `${API_BASE_URL}/match`;
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ players }),
    };

    try {
      const response: Response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Something went wrong during posting match');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='teams flex flex-col justify-between p-6 bg-blue-100 min-h-full w-full'>
      <h1 className='text-3xl font-bold mb-4 text-center'>Equipos</h1>
      <div className='flex justify-center gap-6 overflow-hidden'>
        {teams.map((team: Team, index: number): React.JSX.Element => (
          <TeamCard
            key={index}
            index={index}
            players={team.players}
            loading={loading}
          />
        ))}
      </div>

      <div className='flex justify-around mt-6 text-center' ref={teamsRef}>
        {playersNotEmpty && (
          <button
            onClick={copyToClipboard}
            className='bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 cursor-pointer'
          >
            Copiar
          </button>
        )}

        {copyMessage.visible && <div className='flash-message'>Equipos copiados!</div>}

        {user && playersNotEmpty && (
          <button
            onClick={saveMatch}
            className='bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 cursor-pointer'
          >
            Guardar partido
          </button>
        )}

        {saveMessage.visible && <div className='flash-message'>Partido guardado!</div>}
      </div>
    </div>
  );
};

export default TeamsDisplay;
