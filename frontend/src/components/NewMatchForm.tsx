import { Minus, Trophy, X } from 'lucide-react';
import { useState } from 'react';

import type { Match, Result } from '#utils/types.ts';

import { DateInput } from '#components/DateInput.tsx';
import { Loader } from '#components/Loader.tsx';
import { useNotification } from '#context/notificationContext.tsx';
import { api } from '#utils/api.ts';
import { getErrorMessage } from '#utils/errors.ts';
import { canBeDraw } from '#utils/matches.ts';

type MatchPlayer = {
  name: string;
  team: 1 | 2;
};

type NewMatchProps = {
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  setNewMatchModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NewMatchForm = ({ setMatches, setNewMatchModal }: NewMatchProps) => {
  const [playerCount, setPlayerCount] = useState<number>(10);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [goals1, setGoals1] = useState<number | null>(null);
  const [goals2, setGoals2] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [date, setDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { notify } = useNotification();

  const changeGoals = (team: 1 | 2, value: number): void => {
    const nextGoals1: number | null = team === 1 ? value : goals1;
    const nextGoals2: number | null = team === 2 ? value : goals2;

    if (team === 1) {
      setGoals1(value);
    } else {
      setGoals2(value);
    }

    const tied: boolean = canBeDraw(nextGoals1, nextGoals2);
    if ((result === 'Draw' && !tied) || ((result === 'Win' || result === 'Lose') && tied)) {
      setResult(null);
    }
  };

  const resultButtonClasses = (type: Result, currentResult: Result | null): string => {
    const isActive: boolean = currentResult === type;
    const base: string =
      'px-2 py-1 rounded-md transition-colors duration-200 ease-in-out flex items-center justify-center border cursor-pointer';

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

  const handleChange = (index: number, name: string, team: 1 | 2): void => {
    const newPlayers: MatchPlayer[] = [...players];
    newPlayers[index] = { name, team };
    setPlayers(newPlayers);
  };

  const addMatch = async (): Promise<void> => {
    setIsLoading(true);

    try {
      const match: Match = await api.post<Match>('/match', {
        players,
        goals1,
        goals2,
        result,
        date,
      });
      setMatches((prev: Match[]) => [match, ...prev]);

      setPlayers([]);
      setGoals1(null);
      setGoals2(null);
      setResult(null);
      setNewMatchModal(false);
    } catch (err) {
      notify(getErrorMessage(err, 'No pudimos guardar el partido.'));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='flex flex-col justify-center p-4 max-w-4xl mx-auto'>
      <div className='flex flex-col items-center gap-2 py-2'>
        <label htmlFor='player-count' className='font-semibold text-gray-800'>
          Cantidad de jugadores
        </label>
        <select
          id='player-count'
          className='w-16 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={playerCount}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setPlayerCount(Number.parseInt(e.target.value));
          }}
        >
          {[...(Array(15) as undefined[])].map(
            (_: undefined, i: number): React.JSX.Element => (
              <option key={i} value={2 * i + 2}>
                {2 * i + 2}
              </option>
            )
          )}
        </select>
      </div>

      <div className='flex flex-col md:flex-row justify-between gap-4 md:gap-6'>
        <div className='flex-1'>
          <h3 className='font-semibold mb-3 text-gray-800 text-center md:text-left'>Equipo 1</h3>
          <div className='space-y-2'>
            {[...(Array(playerCount / 2) as undefined[])].map(
              (_: undefined, index: number): React.JSX.Element => (
                <input
                  type='text'
                  key={index}
                  placeholder='Nombre'
                  aria-label={`Jugador ${(index + 1).toString(10)} del equipo 1`}
                  maxLength={25}
                  className='w-full text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(index, e.target.value, 1);
                  }}
                />
              )
            )}
          </div>
        </div>

        <div className='flex md:flex-col justify-center items-center gap-3 md:gap-4 py-4 md:py-0'>
          <div className='flex items-center gap-2 text-3xl'>
            <input
              type='number'
              min='0'
              aria-label='Goles equipo 1'
              value={goals1 ?? ''}
              className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeGoals(1, Number.parseInt(e.target.value));
              }}
            />
            <span className='font-bold text-gray-600'>-</span>
            <input
              type='number'
              min='0'
              aria-label='Goles equipo 2'
              value={goals2 ?? ''}
              className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                changeGoals(2, Number.parseInt(e.target.value));
              }}
            />
          </div>
        </div>

        <div className='flex-1'>
          <h3 className='font-semibold mb-3 text-gray-800 text-center md:text-right'>Equipo 2</h3>
          <div className='space-y-2'>
            {[...(Array(playerCount / 2) as undefined[])].map(
              (_: undefined, index: number): React.JSX.Element => (
                <input
                  type='text'
                  key={index}
                  placeholder='Nombre'
                  aria-label={`Jugador ${(index + 1).toString(10)} del equipo 2`}
                  maxLength={25}
                  className='w-full text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    handleChange(index + playerCount / 2, e.target.value, 2);
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-4 mt-4'>
        <div className='flex justify-center items-center gap-3'>
          <button
            type='button'
            aria-label='Victoria'
            aria-pressed={result === 'Win'}
            disabled={canBeDraw(goals1, goals2)}
            title='Solo con goles distintos'
            className={`${resultButtonClasses('Win', result)} disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => {
              setResult('Win');
            }}
          >
            <Trophy size={24} />
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
            <Minus size={24} />
          </button>
          <button
            type='button'
            aria-label='Derrota'
            aria-pressed={result === 'Lose'}
            disabled={canBeDraw(goals1, goals2)}
            title='Solo con goles distintos'
            className={`${resultButtonClasses('Lose', result)} disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => {
              setResult('Lose');
            }}
          >
            <X size={24} />
          </button>
        </div>

        <div className='flex justify-center items-center'>
          <DateInput
            value={date}
            onChange={setDate}
            className='w-40 bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center'
          />
        </div>

        <button
          disabled={!result}
          className='w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 white-text font-semibold transition-colors duration-200 ease-in-out cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
          onClick={() => void addMatch()}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export { NewMatchForm };
