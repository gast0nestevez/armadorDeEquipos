import { useMemo } from 'react';

import type { Match } from '../utils/types';
import type { ChartMatch } from './PerformanceChart';

import { lastTenMatches } from '../utils/matches';

type MatchStatsProps = {
  chartData: ChartMatch[];
  matches: Match[];
};

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  accent: 'green' | 'red' | 'blue' | 'yellow';
};

type Stats = {
  avgFor: number;
  avgAgainst: number;
  cleanSheets: number;
  streak: number;
  streakResult: string;
};

const ACCENT = {
  green: { border: 'border-green-500', text: 'text-green-500' },
  red: { border: 'border-red-500', text: 'text-red-500' },
  blue: { border: 'border-blue-500', text: 'text-blue-500' },
  yellow: { border: 'border-yellow-500', text: 'text-yellow-500' },
} as const;

const STREAK_LABEL: Record<string, string> = {
  Win: 'ganando',
  Lose: 'perdiendo',
  Draw: 'empatando',
};

const StatCard = ({ label, value, sub, accent }: StatCardProps) => (
  <div className={`flex flex-col gap-1 border-l-4 pl-3 py-1 ${ACCENT[accent].border}`}>
    <span className='text-xs text-gray-500 leading-tight'>{label}</span>
    <span className={`text-2xl font-bold leading-none ${ACCENT[accent].text}`}>{value}</span>
    {sub && <span className='text-xs text-gray-400'>{sub}</span>}
  </div>
);

const MatchStats = ({ chartData, matches }: MatchStatsProps) => {
  const stats: Stats | null = useMemo((): Stats | null => {
    const total: number = chartData.length;
    if (total === 0) {
      return null;
    }

    const averageFor: number =
      chartData.reduce((sum: number, match: ChartMatch): number => sum + match.goalsFor, 0) / total;
    const averageAgainst: number =
      chartData.reduce<number>(
        (sum: number, match: ChartMatch): number => sum + match.goalsAgainst,
        0
      ) / total;
    const cleanSheets: number = chartData.filter(
      (match: ChartMatch): boolean => match.goalsAgainst === 0
    ).length;

    const lastResults: string[] = lastTenMatches(matches).map((match: Match) => match.result);

    const streakResult: string = lastResults[lastResults.length - 1];
    let streak: number = 0;
    for (let i = lastResults.length - 1; i >= 0; i--) {
      if (lastResults[i] === streakResult) {
        streak++;
      } else {
        break;
      }
    }

    return { avgFor: averageFor, avgAgainst: averageAgainst, cleanSheets, streak, streakResult };
  }, [chartData, matches]);

  if (!stats) {
    return null;
  }

  return (
    <div className='grid grid-cols-2 gap-x-6 gap-y-4 mt-5 px-1'>
      <StatCard
        label='Promedio goles a favor'
        value={stats.avgFor.toFixed(1)}
        sub='por partido'
        accent='green'
      />
      <StatCard
        label='Promedio goles en contra'
        value={stats.avgAgainst.toFixed(1)}
        sub='por partido'
        accent='red'
      />
      <StatCard
        label='Racha actual'
        value={`${stats.streak.toString()} partido${stats.streak > 1 ? 's' : ''}`}
        sub={STREAK_LABEL[stats.streakResult] ?? '—'}
        accent='yellow'
      />
    </div>
  );
};

export { MatchStats };
