import { AnimatePresence } from 'framer-motion';
import { Plus, SquareCheckBig } from 'lucide-react';
import { useState } from 'react';

import type { Match, PeriodFilter, PlayedResult, Result } from '#utils/types.ts';

import { MatchCard } from '#components/Match.tsx';
import { MatchesFilter } from '#components/MatchesFilter.tsx';
import { MatchesSkeleton } from '#components/MatchesSkeleton.tsx';
import { Modal } from '#components/Modal.tsx';
import { NewMatchForm } from '#components/NewMatchForm.tsx';
import { PerformanceChart } from '#components/PerformanceChart.tsx';
import { useNotification } from '#context/notificationContext.tsx';
import { api } from '#utils/api.ts';
import { getErrorMessage } from '#utils/errors.ts';
import { filterMatches } from '#utils/matches.ts';

const ALL_RESULTS: PlayedResult[] = ['Win', 'Draw', 'Lose'];

type MobileTab = 'history' | 'performance';

const MOBILE_TABS: { id: MobileTab; label: string }[] = [
  { id: 'history', label: 'Historial' },
  { id: 'performance', label: 'Rendimiento' },
];

type MatchesListProps = {
  matches: Match[];
  setMatches: React.Dispatch<React.SetStateAction<Match[]>>;
  loadingMatches: boolean;
  setLoadingMatches: React.Dispatch<React.SetStateAction<boolean>>;
};

const MatchesList = ({
  matches,
  setMatches,
  loadingMatches,
  setLoadingMatches,
}: MatchesListProps) => {
  const [newMatchModal, setNewMatchModal] = useState<boolean>(false);
  const [selectMode, setSelectMode] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set<string>());
  const [period, setPeriod] = useState<PeriodFilter>({ preset: 'all', customCount: null });
  const [results, setResults] = useState<PlayedResult[]>(ALL_RESULTS);
  const [mobileTab, setMobileTab] = useState<MobileTab>('history');
  const { notify } = useNotification();

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
    const userChoice: boolean = confirm(
      selectedIds.size === 1
        ? '¿Seguro que querés eliminar este partido?'
        : `¿Seguro que querés eliminar estos ${selectedIds.size.toString()} partidos?`
    );

    if (!userChoice) {
      return;
    }

    setLoadingMatches(true);

    try {
      await api.delete<unknown>('/match', { ids: [...selectedIds] });

      setMatches((prevMatches: Match[]) =>
        prevMatches.filter((m: Match) => !selectedIds.has(m._id))
      );

      setSelectedIds(new Set<string>());
      setSelectMode(false);
    } catch (err) {
      notify(getErrorMessage(err, 'No pudimos eliminar los partidos.'));
    } finally {
      setLoadingMatches(false);
    }
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

  const visibleMatches: Match[] = filterMatches(matches, period, results);

  if (loadingMatches) {
    return <MatchesSkeleton />;
  }

  return (
    <div>
      {matches.length > 0 && (
        <MatchesFilter
          period={period}
          results={results}
          onPeriodChange={(newPeriod: PeriodFilter): void => {
            setPeriod(newPeriod);
            setSelectedIds(new Set<string>());
          }}
          onResultsChange={(newResults: PlayedResult[]): void => {
            setResults(newResults);
            setSelectedIds(new Set<string>());
          }}
        />
      )}

      <div className='flex flex-col lg:flex-row gap-6 lg:gap-10 items-start'>
        <div className='flex w-full lg:hidden border-b border-gray-200' role='tablist'>
          {MOBILE_TABS.map(
            ({ id, label }: { id: MobileTab; label: string }): React.JSX.Element => (
              <button
                key={id}
                role='tab'
                aria-selected={mobileTab === id}
                className={`flex-1 py-2 text-center font-semibold border-b-2 -mb-px transition-colors duration-200 ease-in-out cursor-pointer ${mobileTab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                onClick={() => {
                  setMobileTab(id);
                }}
              >
                {label}
              </button>
            )
          )}
        </div>

        <div className={`w-full lg:w-[600px] ${mobileTab === 'history' ? '' : 'hidden lg:block'}`}>
          <h2 className='hidden lg:block text-xl font-semibold mb-4 text-center'>Historial</h2>

          <div className='flex gap-2 justify-around mb-4'>
            <div className='flex gap-2'>
              {matches.length > 0 && (
                <div>
                  <button
                    className='flex items-center gap-1 px-3 py-1 rounded-md bg-gray-300 black-text border border-gray-300 hover:bg-gray-400 transition-colors duration-200 ease-in-out cursor-pointer'
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
                  className='flex items-center gap-1 px-3 py-1 rounded-md bg-gray-300 black-text border border-gray-300 hover:bg-gray-400 transition-colors duration-200 ease-in-out cursor-pointer'
                  onClick={() => {
                    setNewMatchModal(true);
                  }}
                >
                  <Plus size={16} />
                  Agregar partido
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
                className='flex items-center gap-2 px-3 py-1 rounded-md bg-red-500 white-text hover:bg-red-600 transition-colors duration-200 ease-in-out cursor-pointer'
                onClick={() => void deleteSelected()}
              >
                Eliminar
              </button>
            </div>
          )}

          <AnimatePresence>
            {newMatchModal && (
              <Modal
                label='Agregar partido'
                className='max-w-2xl overflow-y-auto max-h-[90vh]'
                onClose={() => {
                  setNewMatchModal(false);
                }}
              >
                <h3 className='text-lg font-semibold text-gray-800 text-center mb-2'>
                  Agregar partido
                </h3>

                <NewMatchForm setMatches={setMatches} setNewMatchModal={setNewMatchModal} />
              </Modal>
            )}
          </AnimatePresence>

          {matches.length === 0 ? (
            <p className='text-gray-600'>Todavía no guardaste ningún partido</p>
          ) : visibleMatches.length === 0 ? (
            <p className='text-gray-600'>No hay partidos con ese filtro</p>
          ) : (
            <ul className='space-y-4'>
              {[...visibleMatches]
                .toSorted(({ date: dateA }: Match, { date: dateB }: Match): number => {
                  if (!dateA && !dateB) {
                    return 0;
                  }
                  if (!dateA) {
                    return -1;
                  }
                  if (!dateB) {
                    return 1;
                  }
                  return new Date(dateB).getTime() - new Date(dateA).getTime();
                })
                .map(
                  (match: Match): React.JSX.Element => (
                    <li
                      key={match._id}
                      className={`flex flex-col gap-[15px] border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out ${matchBorderColor(match.result)}`}
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

        <PerformanceChart
          matches={visibleMatches}
          className={mobileTab === 'performance' ? '' : 'hidden lg:block'}
        />
      </div>
    </div>
  );
};

export { MatchesList };
