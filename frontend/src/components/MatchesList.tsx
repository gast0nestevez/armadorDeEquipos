import { Plus, SquareCheckBig } from 'lucide-react';
import { useState } from 'react';

import type { Match, Result } from '../utils/types';

import { Env } from '../utils/env';
import Loader from './Loader';
import MatchCard from './Match';
import NewMatchForm from './NewMatchForm';

type MatchesStats = Record<Result, number>;

type MatchesListProps = {
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  loadingMatches: boolean;
  setLoadingMatches: React.Dispatch<React.SetStateAction<boolean>>;
};

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

const MatchesList = ({
  matches,
  setMatches,
  loadingMatches,
  setLoadingMatches,
}: MatchesListProps) => {
  const [newMatchForm, setNewMatchForm] = useState<boolean>(false);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set<string>());

  const toggleSelect = (id: string): void => {
    setSelectedIds((prev: Set<string>) => {
      const next: Set<string> = new Set<string>(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const deleteSelected = async (): Promise<void> => {
    const userChoice: boolean = confirm('¿Seguro que querés eliminar este partido?');
    if (!userChoice) {
      return;
    }

    setLoadingMatches(true);
    const url: string = `${API_BASE_URL}/match/`;
    const options: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ ids: [...selectedIds] }),
    };

    try {
      const response: Response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Something went wrong during delete');
      }
      setMatches((prevMatches: Match[]) =>
        prevMatches.filter((m: Match) => !selectedIds.has(m._id))
      );
      setSelectedIds(new Set<string>());
      setSelectMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMatches(false);
    }
  };

  const matchesStats = (matches: Match[]): MatchesStats => {
    const stats: MatchesStats = { Win: 0, Draw: 0, Lose: 0, '': 0 };
    matches.forEach((m: Match) => {
      if (m.result) {
        stats[m.result] = stats[m.result] + 1;
      }
    });
    return stats;
  };

  const matchBorderColor = (result: Result): string => {
    switch (result) {
      case 'Win':
        return 'border-l-4 border-l-green-400';
      case 'Draw':
        return 'border-l-4 border-l-yellow-400';
      case 'Lose':
        return 'border-l-4 border-l-red-400';
      default:
        return 'bg-white';
    }
  };

  const stats: MatchesStats = matchesStats(matches);

  const formSubmited = (): void => {
    setNewMatchForm(false);
  };

  if (loadingMatches) {
    return (
      <div className='flex justify-center items-center'>
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Tus partidos</h2>
      <div className='flex flex-col sm:flex-row gap-3 justify-between items-center mb-4'>
        <div className='flex justify-center items-center gap-4 text-sm'>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 text-green-800 border border-green-300'>
            G {stats.Win}
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 border border-gray-300'>
            E {stats.Draw}
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 text-red-800 border border-red-300'>
            P {stats.Lose}
          </div>
        </div>

        <div className='flex gap-2'>
          {matches.length > 0 && (
            <div>
              <button
                className='flex items-center gap-1 px-3 py-1 rounded-md bg-gray-300 black-text border border-gray-300 hover:bg-gray-400 transition cursor-pointer'
                onClick={() => {
                  setSelectedIds(new Set<string>());
                  setSelectMode(!selectMode);
                }}
              >
                {!selectMode && <SquareCheckBig size={16} />}
                {selectMode ? 'Cancelar' : 'Seleccionar'}
              </button>
            </div>
          )}
          <div>
            <button
              className='flex items-center gap-1 px-3 py-1 rounded-md bg-blue-600 white-text border border-blue-600 hover:bg-blue-700 transition cursor-pointer'
              onClick={() => setNewMatchForm(!newMatchForm)}
            >
              {!newMatchForm && <Plus size={16} />}
              {newMatchForm ? 'Cancelar' : 'Agregar partido'}
            </button>
          </div>
        </div>
      </div>

      {selectMode && selectedIds.size > 0 && (
        <div className='flex items-center justify-between bg-gray-100 border border-gray-300 rounded-md px-4 py-2 mb-4 text-sm'>
          <span className='text-gray-700'>
            {selectedIds.size}{' '}
            {selectedIds.size === 1 ? 'partido seleccionado' : 'partidos seleccionados'}
          </span>
          <button
            className='flex items-center gap-2 px-3 py-1 rounded-md bg-red-500 white-text hover:bg-red-600 transition cursor-pointer'
            onClick={deleteSelected}
          >
            Eliminar
          </button>
        </div>
      )}

      {newMatchForm && <NewMatchForm setMatches={setMatches} formSubmited={formSubmited} />}
      {matches.length === 0 ? (
        <p className='text-gray-600'>Todavía no guardaste ningún partido</p>
      ) : (
        <ul className='space-y-4'>
          {matches.map(
            (match: Match): React.JSX.Element => (
              <li
                key={match._id}
                className={`flex flex-col gap-[15px] border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition ${matchBorderColor(match.result)}`}
              >
                <MatchCard
                  match={match}
                  setMatches={setMatches}
                  selectMode={selectMode}
                  selected={selectedIds.has(match._id)}
                  onToggleSelect={toggleSelect}
                />
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default MatchesList;
