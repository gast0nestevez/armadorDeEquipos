import { useState } from 'react';
import { Trophy, Minus, X } from 'lucide-react';

import { Env } from '@/utils/env';
import Loader from '@/components/Loader';
import type { Match, Result } from '@/utils/types';

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

type MatchPlayer = {
  name: string;
  team: 1 | 2;
};

type NewMatchProps = {
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  formSubmited: () => void;
};

const NewMatchForm = ({ setMatches, formSubmited }: NewMatchProps) => {
  const [playerCount, setPlayerCount] = useState<number>(10);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [goals1, setGoals1] = useState<number | null>(null);
  const [goals2, setGoals2] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [date, setDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const resultButtonClasses = (type: Result, currentResult: Result | null): string => {
    const isActive: boolean = currentResult === type;
    const base: string = 'l-2 px-2 py-1 rounded-md transition flex items-center justify-center border cursor-pointer';

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

    const url: string = `${API_BASE_URL}/match`;
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ players, goals1, goals2, result, date }),
    };

    try {
      const response: Response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Error while saving match');
      }

      const { data: match }: { data: Match } = await response.json();
      setMatches((prev: Match[]) => [match, ...prev]);

      setPlayers([]);
      setGoals1(null);
      setGoals2(null);
      setResult(null);
      formSubmited();
    } catch (err) {
      console.error(err);
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
        <label className='font-semibold text-gray-800'>Cantidad de jugadores</label>
        <select
          className='w-16 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={playerCount}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlayerCount(Number.parseInt(e.target.value))}
        >
          {[...Array(15)].map((_: undefined, i: number): React.JSX.Element => (
            <option key={i} value={2 * i + 2}>
              {2 * i + 2}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col md:flex-row justify-between gap-4 md:gap-6'>
        <div className='flex-1'>
          <h3 className='font-semibold mb-3 text-gray-800 text-center md:text-left'>Equipo 1</h3>
          <ul className='space-y-2'>
            {[...Array(playerCount / 2)].map((_: undefined, index: number): React.JSX.Element => (
              <input
                type='text'
                key={index}
                placeholder='Nombre'
                maxLength={25}
                className='w-full text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index, e.target.value, 1)}
              />
            ))}
          </ul>
        </div>

        <div className='flex md:flex-col justify-center items-center gap-3 md:gap-4 py-4 md:py-0'>
          <div className='flex items-center gap-2 text-3xl'>
            <input
              type='number'
              min='0'
              value={goals1 ?? ''}
              className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoals1(Number.parseInt(e.target.value))}
            />
            <span className='font-bold text-gray-600'>-</span>
            <input
              type='number'
              min='0'
              value={goals2 ?? ''}
              className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGoals2(Number.parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className='flex-1'>
          <h3 className='font-semibold mb-3 text-gray-800 text-center md:text-right'>Equipo 2</h3>
          <ul className='space-y-2'>
            {[...Array(playerCount / 2)].map((_: undefined, index: number): React.JSX.Element => (
              <input
                type='text'
                key={index}
                placeholder='Nombre'
                maxLength={25}
                className='w-full text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(index + playerCount / 2, e.target.value, 2)}
              />
            ))}
          </ul>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-4 mt-4'>
        <div className='flex justify-center items-center gap-3'>
          <button className={resultButtonClasses('Win', result)} onClick={() => setResult('Win')}>
            <Trophy size={24} />
          </button>
          <button className={resultButtonClasses('Draw', result)} onClick={() => setResult('Draw')}>
            <Minus size={24} />
          </button>
          <button className={resultButtonClasses('Lose', result)} onClick={() => setResult('Lose')}>
            <X size={24} />
          </button>
        </div>

        <div className='flex justify-center items-center'>
          <input
            type='date'
            value={date}
            placeholder='Fecha'
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            className='bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center'
          />
        </div>

        <button
          className='w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold transition cursor-pointer hover:bg-blue-600'
          onClick={addMatch}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default NewMatchForm;
