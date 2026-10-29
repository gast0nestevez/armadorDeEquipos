import type { PeriodFilter, PeriodPreset } from '#utils/types.ts';

import { DateInput } from '#components/DateInput.tsx';

type PeriodSelectorProps = {
  period: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
};

const PRESET_LABEL: Record<PeriodPreset, string> = {
  all: 'Todos los partidos',
  last10: 'Últimos 10 partidos',
  last30: 'Últimos 30 días',
  last90: 'Últimos 90 días',
  year: 'Este año',
  custom: 'Personalizado',
};

const PRESETS: PeriodPreset[] = ['all', 'last10', 'last30', 'last90', 'year', 'custom'];

const DATE_CLASS: string =
  'w-28 bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-400';

const PeriodSelector = ({ period, onChange }: PeriodSelectorProps) => (
  <div className='flex flex-col items-center gap-2 mb-4'>
    <select
      aria-label='Período de las estadísticas'
      className='bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
      value={period.preset}
      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...period, preset: e.target.value as PeriodPreset });
      }}
    >
      {PRESETS.map((preset: PeriodPreset) => (
        <option key={preset} value={preset}>
          {PRESET_LABEL[preset]}
        </option>
      ))}
    </select>

    {period.preset === 'custom' && (
      <div className='flex items-center gap-2 text-sm text-gray-500'>
        <DateInput
          ariaLabel='Desde'
          value={period.from}
          onChange={(from: string) => {
            onChange({ ...period, from });
          }}
          className={DATE_CLASS}
        />
        <span>a</span>
        <DateInput
          ariaLabel='Hasta'
          value={period.to}
          onChange={(to: string) => {
            onChange({ ...period, to });
          }}
          className={DATE_CLASS}
        />
      </div>
    )}
  </div>
);

export { PeriodSelector };
