import { useMemo } from 'react';

import type { Match, MatchStatsSummary } from '#utils/types.ts';

import { isoToDisplay } from '#utils/date.ts';
import { computeStats } from '#utils/matches.ts';

type MatchStatsProps = {
  matches: Match[];
};

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  accent: 'green' | 'red' | 'blue' | 'yellow';
};

const ACCENT = {
  green: { border: 'border-green-500', text: 'text-green-500' },
  red: { border: 'border-red-500', text: 'text-red-500' },
  blue: { border: 'border-blue-500', text: 'text-blue-500' },
  yellow: { border: 'border-yellow-500', text: 'text-yellow-500' },
} as const;

const StatCard = ({ label, value, sub, accent }: StatCardProps) => (
  <div className={`flex flex-col gap-1 border-l-4 pl-3 py-1 ${ACCENT[accent].border}`}>
    <span className='text-xs text-gray-500 leading-tight'>{label}</span>
    <span className={`text-2xl font-bold leading-none ${ACCENT[accent].text}`}>{value}</span>
    {sub && <span className='text-xs text-gray-400'>{sub}</span>}
  </div>
);

const formatSigned: (value: number) => string = (value: number): string =>
  value > 0 ? `+${value.toString()}` : value.toString();

const MatchStats = ({ matches }: MatchStatsProps) => {
  const stats: MatchStatsSummary | null = useMemo(
    (): MatchStatsSummary | null => computeStats(matches),
    [matches]
  );

  if (!stats) {
    return (
      <p className='mt-5 text-center text-sm text-gray-500'>No hay partidos en este período.</p>
    );
  }

  return (
    <div className='grid grid-cols-2 gap-x-6 gap-y-4 mt-5 px-1'>
      <StatCard
        label='Partidos jugados'
        value={stats.played.toString()}
        sub={`${stats.wins.toString()}G · ${stats.draws.toString()}E · ${stats.losses.toString()}P`}
        accent='blue'
      />
      <StatCard
        label='Victorias'
        value={`${stats.winRate.toFixed(0)}%`}
        sub={`${stats.wins.toString()} de ${stats.played.toString()}`}
        accent='green'
      />
      <StatCard
        label='Goles a favor'
        value={stats.goalsFor.toString()}
        sub={`${stats.avgFor.toFixed(1)} por partido`}
        accent='green'
      />
      <StatCard
        label='Goles en contra'
        value={stats.goalsAgainst.toString()}
        sub={`${stats.avgAgainst.toFixed(1)} por partido`}
        accent='red'
      />
      <StatCard
        label='Diferencia de gol'
        value={formatSigned(stats.goalDifference)}
        sub={`${formatSigned(Number((stats.goalDifference / stats.played).toFixed(1)))} por partido`}
        accent={stats.goalDifference >= 0 ? 'green' : 'red'}
      />
      <StatCard
        label='Vallas invictas'
        value={stats.cleanSheets.toString()}
        sub={`${((stats.cleanSheets / stats.played) * 100).toFixed(0)}% de los partidos`}
        accent='blue'
      />
      <StatCard
        label='Mejor racha ganando'
        value={`${stats.bestWinStreak.toString()} partido${stats.bestWinStreak === 1 ? '' : 's'}`}
        sub='victorias seguidas'
        accent='yellow'
      />
      <StatCard
        label='Mayor victoria'
        value={
          stats.biggestWin
            ? `${stats.biggestWin.goalsFor.toString()} - ${stats.biggestWin.goalsAgainst.toString()}`
            : '—'
        }
        sub={stats.biggestWin?.date ? `el ${isoToDisplay(stats.biggestWin.date)}` : 'Sin fecha'}
        accent='green'
      />
    </div>
  );
};

export { MatchStats };
