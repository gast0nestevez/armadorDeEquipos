import { AnimatePresence, motion } from 'framer-motion';
import { Minus, PencilLine, Share2, Trophy, X } from 'lucide-react';
import { useState } from 'react';

import type { Match, Player, Result } from '#utils/types.ts';

import { DateInput } from '#components/DateInput.tsx';
import { MatchCardSkeleton } from '#components/MatchesSkeleton.tsx';
import { Modal } from '#components/Modal.tsx';
import { ShareMatch } from '#components/ShareMatch.tsx';
import { useNotification } from '#context/notificationContext.tsx';
import { api } from '#utils/api.ts';
import { isoToDisplay } from '#utils/date.ts';
import { getErrorMessage } from '#utils/errors.ts';
import { canBeDraw } from '#utils/matches.ts';
import { capitalize } from '#utils/string.ts';

type MatchProps = {
  match: Match;
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: (id: string) => void;
};

const MatchCard = ({ match, setMatches, selectMode, selected, onToggleSelect }: MatchProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [goals1, setGoals1] = useState<number>(match.goals1);
  const [goals2, setGoals2] = useState<number>(match.goals2);
  const [result, setResult] = useState<Result>(match.result);
  const [date, setDate] = useState<string>(match.date);
  const [loading, setLoading] = useState<boolean>(false);
  const { notify } = useNotification();

  const changeGoals = (team: 1 | 2, value: number): void => {
    const nextGoals1: number | null = team === 1 ? value : goals1;
    const nextGoals2: number | null = team === 2 ? value : goals2;

    if (team === 1) {
      setGoals1(value);
    } else {
      setGoals2(value);
    }

    if (result === 'Draw' && !canBeDraw(nextGoals1, nextGoals2)) {
      setResult('');
    }
  };

  const resultButtonClasses = (type: Result, currentResult: Result): string => {
    const isActive: boolean = currentResult === type;
    const base: string =
      'flex justify-center items-center px-2 py-1 rounded-md transition-colors duration-200 ease-in-out border cursor-pointer';

    const styles: Record<string, string> = {
      Win: isActive
        ? 'bg-green-500 border-green-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
      Draw: isActive
        ? 'bg-yellow-500 border-yellow-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
      Lose: isActive
        ? 'bg-red-500 border-red-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
    };

    return `${base} ${styles[type]}`;
  };

  const activate = (): void => {
    if (selectMode) {
      onToggleSelect(match._id);
    } else {
      setShowDetails(!showDetails);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      activate();
    }
  };

  const saveChanges = async (): Promise<void> => {
    setLoading(true);

    try {
      const updatedMatch: Match = await api.put<Match>(`/match/${match._id}`, {
        goals1,
        goals2,
        result,
        date,
      });

      setMatches((prevMatches: Match[]) =>
        prevMatches.map((m: Match) => (m._id === match._id ? updatedMatch : m))
      );
      setShowModal(false);
    } catch (err) {
      notify(getErrorMessage(err, 'No pudimos guardar los cambios del partido.'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <MatchCardSkeleton />;
  }

  return (
    <>
      <div
        role='button'
        tabIndex={0}
        aria-expanded={selectMode ? undefined : showDetails}
        aria-pressed={selectMode ? selected : undefined}
        className={`flex flex-col justify-center p-4 cursor-pointer ${showDetails ? 'gap-[15px]' : ''}`}
        onClick={activate}
        onKeyDown={handleKeyDown}
      >
        <div className='flex items-center w-full gap-4'>
          {selectMode && (
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ease-in-out ${selected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}
            >
              {selected && <span className='white-text text-xs'>✓</span>}
            </div>
          )}
          <div className='flex flex-col flex-1'>
            {!showModal && (
              <div className='text-center text-gray-600 text-sm mb-2'>
                {match.date ? isoToDisplay(match.date) : 'Sin fecha'}
              </div>
            )}

            <div className='flex justify-between gap-1'>
              <div className='grow max-w-1/3'>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className='overflow-hidden'
                    >
                      <h3 className='font-semibold black-text mb-2 text-nowrap'>Equipo 1</h3>
                      <ul className='space-y-1'>
                        {match.players
                          .filter((p: Player): boolean => p.team === 1)

                          .map(
                            (p: Player, index: number): React.JSX.Element => (
                              <li
                                key={`${p.name}-${index.toString()}`}
                                className='text-gray-700 truncate'
                              >
                                {capitalize(p.name)}
                              </li>
                            )
                          )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className='flex justify-center items-center font-semibold text-2xl text-nowrap'>
                <span>
                  {match.goals1} - {match.goals2}
                </span>
              </div>

              <div className='grow max-w-1/3'>
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className='overflow-hidden'
                    >
                      <h3 className='font-semibold black-text mb-2 text-right text-nowrap'>
                        Equipo 2
                      </h3>
                      <ul className='space-y-1'>
                        {match.players
                          .filter((p: Player): boolean => p.team === 2)

                          .map(
                            (p: Player, index: number): React.JSX.Element => (
                              <li
                                key={`${p.name}-${index.toString()}`}
                                className='text-gray-700 text-right truncate'
                              >
                                {capitalize(p.name)}
                              </li>
                            )
                          )}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className='flex justify-center gap-2'>
            <button
              type='button'
              aria-label='Compartir partido'
              className='px-3 py-2 rounded-lg bg-gray-200 text-gray-600 transition-colors duration-200 ease-in-out cursor-pointer hover:bg-gray-300'
              onClick={(e) => {
                e.stopPropagation();
                setShowShare(true);
              }}
            >
              <Share2 size={16} aria-hidden='true' />
            </button>
            <button
              type='button'
              aria-label='Editar partido'
              className='px-3 py-2 rounded-lg bg-gray-200 text-gray-600 transition-colors duration-200 ease-in-out cursor-pointer hover:bg-gray-300'
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              <PencilLine size={16} aria-hidden='true' />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showShare && (
          <Modal
            label='Compartir partido'
            className='max-w-sm'
            onClose={() => {
              setShowShare(false);
            }}
          >
            <ShareMatch match={match} />
          </Modal>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <Modal
            label='Editar partido'
            className='max-w-sm flex flex-col gap-4'
            onClose={() => {
              setShowModal(false);
            }}
          >
            <h3 className='text-lg font-semibold black-text text-center'>Editar partido</h3>

            <div className='flex justify-center'>
              <DateInput
                value={date}
                onChange={setDate}
                className='w-40 bg-white shadow-sm border border-gray-200 rounded-lg p-2 black-text focus:outline-none focus:ring-2 focus:ring-blue-400 text-center'
              />
            </div>

            <div className='flex justify-center items-center gap-2 font-semibold text-2xl'>
              <input
                type='number'
                aria-label='Goles equipo 1'
                value={goals1}
                onChange={(e) => {
                  changeGoals(1, Number.parseInt(e.target.value));
                }}
                className='w-10 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 black-text focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <span>-</span>
              <input
                type='number'
                aria-label='Goles equipo 2'
                value={goals2}
                onChange={(e) => {
                  changeGoals(2, Number.parseInt(e.target.value));
                }}
                className='w-10 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 black-text focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>

            <div className='flex justify-center gap-2'>
              <button
                type='button'
                aria-label='Victoria'
                aria-pressed={result === 'Win'}
                className={resultButtonClasses('Win', result)}
                onClick={() => {
                  setResult('Win');
                }}
              >
                <Trophy />
              </button>
              <button
                type='button'
                aria-label='Empate'
                aria-pressed={result === 'Draw'}
                disabled={!canBeDraw(goals1, goals2)}
                title='Solo con goles iguales'
                className={`${resultButtonClasses('Draw', result)} disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => {
                  setResult('Draw');
                }}
              >
                <Minus />
              </button>
              <button
                type='button'
                aria-label='Derrota'
                aria-pressed={result === 'Lose'}
                className={resultButtonClasses('Lose', result)}
                onClick={() => {
                  setResult('Lose');
                }}
              >
                <X />
              </button>
            </div>

            <button
              disabled={!result}
              className='px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold text-center transition-colors duration-200 ease-in-out cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
              onClick={() => void saveChanges()}
            >
              Listo
            </button>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export { MatchCard };
