import type { PeriodFilter, PlayedResult } from '#utils/types.ts';

import { PeriodSelector } from '#components/PeriodSelector.tsx';

type MatchesFilterProps = {
  period: PeriodFilter;
  results: PlayedResult[];
  onPeriodChange: (period: PeriodFilter) => void;
  onResultsChange: (results: PlayedResult[]) => void;
};

const RESULT_OPTIONS: { value: PlayedResult; label: string; active: string }[] = [
  { value: 'Win', label: 'Ganados', active: 'bg-green-500 border-green-500 white-text' },
  { value: 'Draw', label: 'Empatados', active: 'bg-yellow-400 border-yellow-400 black-text' },
  { value: 'Lose', label: 'Perdidos', active: 'bg-red-500 border-red-500 white-text' },
];

const MatchesFilter = ({
  period,
  results,
  onPeriodChange,
  onResultsChange,
}: MatchesFilterProps) => {
  const toggleResult: (value: PlayedResult) => void = (value: PlayedResult): void => {
    if (!results.includes(value)) {
      onResultsChange([...results, value]);
      return;
    }

    if (results.length > 1) {
      onResultsChange(results.filter((result: PlayedResult): boolean => result !== value));
    }
  };

  return (
    <div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 w-full mb-6'>
      <PeriodSelector period={period} onChange={onPeriodChange} />

      <div className='flex gap-2' role='group' aria-label='Resultados'>
        {RESULT_OPTIONS.map(
          ({ value, label, active }: { value: PlayedResult; label: string; active: string }) => {
            const isActive: boolean = results.includes(value);

            return (
              <button
                key={value}
                type='button'
                aria-pressed={isActive}
                className={`px-3 py-1 rounded-full border text-sm transition-colors duration-200 ease-in-out cursor-pointer ${isActive ? active : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100'}`}
                onClick={() => {
                  toggleResult(value);
                }}
              >
                {label}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};

export { MatchesFilter };
