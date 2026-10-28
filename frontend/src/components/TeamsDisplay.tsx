import { useContext, useState } from 'react';

import type { Player, Team } from '#utils/types.ts';

import { TeamCard } from '#components/TeamCard.tsx';
import { useNotification } from '#context/notificationContext.tsx';
import { UserContext } from '#context/userContext.tsx';
import { useFlashMessage } from '#hooks/useFlashMessage.tsx';
import { api } from '#utils/api.ts';
import { getErrorMessage } from '#utils/errors.ts';
import { playersToText } from '#utils/share.ts';
import { capitalize } from '#utils/string.ts';

type MappedPlayer = {
  name: string;
  skill: number;
  team: number;
};

type TeamsDisplayProps = {
  teams: Team[];
  loading: boolean;
  teamsRef: React.RefObject<HTMLDivElement | null>;
};

const TeamsDisplay = ({ teams, loading, teamsRef }: TeamsDisplayProps) => {
  const { user } = useContext(UserContext);
  const [showScores, setShowScores] = useState<boolean>(false);
  const copyMessage = useFlashMessage();
  const saveMessage = useFlashMessage();
  const { notify } = useNotification();

  const playersNotEmpty: boolean = teams[0].players.length > 0 || teams[1].players.length > 0;

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(
        playersToText(teams.map((team: Team): Player[] => team.players))
      );
      copyMessage.trigger();
    } catch {
      notify('No pudimos copiar los equipos.');
    }
  };

  const mapTeamsToPlayers = (teams: Team[]): MappedPlayer[] =>
    teams.flatMap((team: Team, index: number) =>
      team.players.map(
        (p: Player): MappedPlayer => ({
          name: capitalize(p.name),
          skill: p.skill,
          team: index + 1,
        })
      )
    );

  const saveFormation = async (): Promise<void> => {
    const players: MappedPlayer[] = mapTeamsToPlayers(teams);

    try {
      await api.post<unknown>('/formation', { players });
      saveMessage.trigger();
    } catch (err) {
      notify(getErrorMessage(err, 'No pudimos guardar la formación.'));
    }
  };

  return (
    <div className='teams flex flex-col justify-between p-6 bg-blue-100/60 min-h-full w-full'>
      <h2 className='text-3xl font-bold mb-4 text-center'>Equipos</h2>

      <div className='flex flex-col items-center gap-4'>
        <div className='flex justify-center gap-6 overflow-hidden'>
          {teams.map(
            (team: Team, index: number): React.JSX.Element => (
              <TeamCard
                key={index}
                index={index}
                players={team.players}
                loading={loading}
                showScores={showScores}
              />
            )
          )}
        </div>
        <label className='flex items-center justify-center gap-2 mb-4 cursor-pointer select-none'>
          <input
            type='checkbox'
            role='switch'
            checked={showScores}
            onChange={(e) => {
              setShowScores(e.target.checked);
            }}
            className='sr-only peer'
          />
          <span className='relative w-10 h-6 rounded-full bg-gray-300 transition-colors duration-200 ease-in-out peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-400 after:content-[""] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out peer-checked:after:translate-x-4' />
          <span className='text-sm'>Mostrar puntajes</span>
        </label>
      </div>

      <div className='flex justify-around mt-6 text-center' ref={teamsRef}>
        {playersNotEmpty && (
          <button
            onClick={() => void copyToClipboard()}
            className='bg-blue-900 white-text px-6 py-2 rounded white-text hover:bg-blue-800 transition-colors duration-200 ease-in-out cursor-pointer'
          >
            Copiar
          </button>
        )}

        {copyMessage.visible && <div className='flash-message'>Equipos copiados!</div>}

        {user && playersNotEmpty && (
          <button
            onClick={() => void saveFormation()}
            disabled={saveMessage.visible}
            className='bg-blue-900 white-text px-6 py-2 rounded white-text hover:bg-blue-800 transition-colors duration-200 ease-in-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-900'
          >
            Guardar formación
          </button>
        )}

        {saveMessage.visible && <div className='flash-message'>Formación guardada!</div>}
      </div>
    </div>
  );
};

export { TeamsDisplay };
