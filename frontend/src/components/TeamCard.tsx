import type { Player } from '#utils/types.ts';

import { Loader } from '#components/Loader.tsx';
import { capitalize } from '#utils/string.ts';

type TeamCardProps = {
  index: number;
  players: Player[];
  loading: boolean;
  showScores: boolean;
};

const sumSkills: (players: Player[]) => number = (players: Player[]): number =>
  players.reduce((total: number, player: Player): number => total + player.skill, 0);

const TeamCard = ({ index, players, loading, showScores }: TeamCardProps) => (
  <div className='flex flex-col bg-white shadow-md rounded-xl p-6 w-48 text-center'>
    <h3 className='text-xl font-bold mb-2'>Equipo {index + 1}</h3>

    {loading ? (
      <div>
        <Loader />
      </div>
    ) : (
      <ul className='py-1 max-h-full overflow-y-auto'>
        {players.length > 0 ? (
          players
            .sort((a: Player, b: Player): number => a.name.localeCompare(b.name))
            .map(
              (player: Player, i: number): React.JSX.Element => (
                <li
                  key={i}
                  className={`py-1 flex ${showScores ? 'justify-between' : 'justify-center'} gap-2`}
                >
                  <span className='truncate'>{capitalize(player.name)}</span>
                  {showScores && <span className='text-gray-500'>{player.skill}</span>}
                </li>
              )
            )
        ) : (
          <li>Sin jugadores</li>
        )}
      </ul>
    )}

    {!loading && showScores && players.length > 0 && (
      <div className='mt-2 pt-2 border-t border-gray-200 font-semibold'>
        Total: {sumSkills(players)}
      </div>
    )}
  </div>
);

export { TeamCard };
