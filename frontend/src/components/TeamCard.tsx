import { AnimatePresence, motion } from 'framer-motion';

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
                <li key={i} className='py-1 flex items-center'>
                  <span className='flex-1 min-w-0 truncate'>{capitalize(player.name)}</span>
                  <AnimatePresence initial={false}>
                    {showScores && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 'auto', opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className='overflow-hidden text-gray-500 pl-2'
                      >
                        {player.skill}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </li>
              )
            )
        ) : (
          <li>Sin jugadores</li>
        )}
      </ul>
    )}

    <AnimatePresence initial={false}>
      {!loading && showScores && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='mt-auto overflow-hidden'
        >
          <div className='mt-2 pt-2 border-t border-gray-200 font-semibold'>
            Total: {sumSkills(players)}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export { TeamCard };
