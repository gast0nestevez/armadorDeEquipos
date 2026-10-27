import { Minus, Trophy, X } from 'lucide-react';
import { useState } from 'react';

import type { Formation, Match, Result } from '#utils/types.ts';

import { DateInput } from '#components/DateInput.tsx';
import { Loader } from '#components/Loader.tsx';
import { Env } from '#utils/env.ts';

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

type PromoteFormationFormProps = {
  formation: Formation;
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
  onClose: () => void;
};

const PromoteFormationForm = ({
  formation,
  setMatches,
  setFormations,
  onClose,
}: PromoteFormationFormProps) => {
  const [goals1, setGoals1] = useState<number | null>(null);
  const [goals2, setGoals2] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [date, setDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const canSubmit: boolean =
    goals1 !== null &&
    goals2 !== null &&
    !Number.isNaN(goals1) &&
    !Number.isNaN(goals2) &&
    !!result;

  const resultButtonClasses = (type: Result, currentResult: Result | null): string => {
    const isActive: boolean = currentResult === type;
    const base: string =
      'flex justify-center items-center l-2 px-2 py-1 rounded-md transition-colors duration-200 ease-in-out border cursor-pointer';

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

  const promote = async (): Promise<void> => {
    setIsLoading(true);

    const url: string = `${API_BASE_URL}/formation/${formation._id}/promote`;
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
      },
      body: JSON.stringify({ goals1, goals2, result, date }),
    };

    try {
      const response: Response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Error while promoting formation');
      }

      const { data: match }: { data: Match } = (await response.json()) as { data: Match };
      setMatches((prev: Match[]) => [match, ...prev]);
      setFormations((prev: Formation[]) => prev.filter((f: Formation) => f._id !== formation._id));
      onClose();
    } catch (err) {
      console.error(err);
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
    <div className='flex flex-col gap-4'>
      <h3 className='text-lg font-semibold black-text text-center'>Pasar a partido</h3>

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
          min='0'
          aria-label='Goles equipo 1'
          value={goals1 ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGoals1(Number.parseInt(e.target.value));
          }}
          className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 black-text focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <span>-</span>
        <input
          type='number'
          min='0'
          aria-label='Goles equipo 2'
          value={goals2 ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setGoals2(Number.parseInt(e.target.value));
          }}
          className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 black-text focus:outline-none focus:ring-2 focus:ring-blue-400'
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
          className={resultButtonClasses('Draw', result)}
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
        disabled={!canSubmit}
        className='px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold text-center transition-colors duration-200 ease-in-out cursor-pointer hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500'
        onClick={() => void promote()}
      >
        Guardar partido
      </button>
    </div>
  );
};

export { PromoteFormationForm };
