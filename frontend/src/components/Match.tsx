import { AnimatePresence, motion } from 'framer-motion';
import { Minus, PencilLine, Trophy, X } from 'lucide-react';
import { useState } from 'react';

import type { Match, Player, Result } from '../utils/types';

import { Env } from '../utils/env';
import { capitalize } from '../utils/string';
import Loader from './Loader';

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

type MatchProps = {
  match: Match;
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  selectMode: boolean;
  selected: boolean;
  onToggleSelect: (id: string) => void;
};

const MatchCard = ({ match, setMatches, selectMode, selected, onToggleSelect }: MatchProps) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [goals1, setGoals1] = useState<number>(match.goals1 ?? 0);
  const [goals2, setGoals2] = useState<number>(match.goals2 ?? 0);
  const [result, setResult] = useState<Result>(match.result ?? '');
  const [date, setDate] = useState<string>(match.date ?? '');
  const [loading, setLoading] = useState<boolean>(false);

  const resultButtonClasses = (type: Result, currentResult: Result): string => {
    const isActive: boolean = currentResult === type;
    const base: string =
      'flex justify-center items-center l-2 px-2 py-1 rounded-md transition border cursor-pointer';

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

  const formatDate = (isoDate: string): string => {
    if (!isoDate) {
      return '';
    }
    const [year, month, day]: string[] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  };

  const expandMatch = (e: React.MouseEvent<HTMLDivElement>): void => {
    const tag: string = (e.target as HTMLElement).tagName;
    if (['DIV', 'H3', 'SPAN', 'UL', 'LI'].includes(tag)) {
      setShowDetails(!showDetails);
      setShowModal(false);
    }
  };

  const saveChanges = async (): Promise<void> => {
    setLoading(true);
    const url: string = `${API_BASE_URL}/match/${match._id}`;
    const body = { goals1, goals2, result, date };
    const options: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(body),
    };

    try {
      const response: Response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Something went wrong during update');
      }
      const { data: updatedMatch }: { data: Match } = (await response.json()) as { data: Match };

      setMatches((prevMatches: Match[]) =>
        prevMatches.map((m: Match) => (m._id === match._id ? updatedMatch : m))
      );
      setShowModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col justify-center p-4 cursor-pointer ${showDetails ? 'gap-[15px]' : ''}`}
      onClick={selectMode ? () => onToggleSelect(match._id) : expandMatch}
    >
      <div className='flex items-center w-full gap-4'>
        {selectMode && (
          <div
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? 'bg-blue-600 border-blue-600' : 'border-gray-400'}`}
          >
            {selected && <span className='white-text text-xs'>✓</span>}
          </div>
        )}
        <div className='flex flex-col flex-1'>
          {!showModal && (
            <div className='text-center text-gray-600 text-sm mb-2'>
              {match.date ? formatDate(match.date) : 'Sin fecha'}
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
                    transition={{ duration: 0.3 }}
                    className='overflow-hidden'
                  >
                    <h3 className='font-semibold black-text mb-2 text-nowrap'>Equipo 1</h3>
                    <ul className='space-y-1'>
                      {match.players
                        .filter((p: Player): boolean => p.team === 1)
                        .map(
                          (p: Player): React.JSX.Element => (
                            <li key={p._id} className='text-gray-700 truncate'>
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
                    transition={{ duration: 0.3 }}
                    className='overflow-hidden'
                  >
                    <h3 className='font-semibold black-text mb-2 text-right text-nowrap'>
                      Equipo 2
                    </h3>
                    <ul className='space-y-1'>
                      {match.players
                        .filter((p: Player): boolean => p.team === 2)
                        .map(
                          (p: Player): React.JSX.Element => (
                            <li key={p._id} className='text-gray-700 text-right truncate'>
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

        <div className='flex justify-center'>
          <button
            className='px-3 py-2 rounded-lg bg-gray-200 text-gray-600 transition cursor-pointer hover:bg-gray-300'
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            <PencilLine size={16} />
          </button>
        </div>
      </div>

      {showModal && (
        <div
          className='fixed inset-0 flex items-center justify-center z-50'
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          onClick={() => setShowModal(false)}
        >
          <div
            className='bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4'
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className='text-lg font-semibold black-text text-center'>Editar partido</h3>

            <div className='flex justify-center'>
              <input
                type='date'
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className='bg-white shadow-sm border border-gray-200 rounded-lg p-2 black-text focus:outline-none focus:ring-2 focus:ring-blue-400 text-center'
              />
            </div>

            <div className='flex justify-center items-center gap-2 font-semibold text-2xl'>
              <input
                type='number'
                value={goals1}
                onChange={(e) => setGoals1(Number.parseInt(e.target.value))}
                className='w-10 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 black-text focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <span>-</span>
              <input
                type='number'
                value={goals2}
                onChange={(e) => setGoals2(Number.parseInt(e.target.value))}
                className='w-10 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 black-text focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>

            <div className='flex justify-center gap-2'>
              <button
                className={resultButtonClasses('Win', result)}
                onClick={() => setResult('Win')}
              >
                <Trophy />
              </button>
              <button
                className={resultButtonClasses('Draw', result)}
                onClick={() => setResult('Draw')}
              >
                <Minus />
              </button>
              <button
                className={resultButtonClasses('Lose', result)}
                onClick={() => setResult('Lose')}
              >
                <X />
              </button>
            </div>

            <button
              className='px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold text-center transition cursor-pointer hover:bg-blue-600'
              onClick={saveChanges}
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchCard;
