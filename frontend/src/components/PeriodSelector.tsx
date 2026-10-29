import type { PeriodFilter, PeriodPreset } from '#utils/types.ts';

type PeriodSelectorProps = {
  period: PeriodFilter;
  onChange: (period: PeriodFilter) => void;
};

const PRESET_LABEL: Record<PeriodPreset, string> = {
  all: 'Todos los partidos',
  last5: 'Últimos 5 partidos',
  last10: 'Últimos 10 partidos',
  custom: 'Personalizado',
};

const PRESETS: PeriodPreset[] = ['all', 'last5', 'last10', 'custom'];

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
      <label className='flex items-center gap-2 text-sm text-gray-500'>
        Últimos
        <input
          type='number'
          min='1'
          inputMode='numeric'
          aria-label='Cantidad de partidos'
          value={period.customCount ?? ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const count: number = Number.parseInt(e.target.value);
            onChange({ ...period, customCount: Number.isNaN(count) ? null : count });
          }}
          className='w-20 bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 text-center focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        partidos
      </label>
    )}
  </div>
);

export { PeriodSelector };
