import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { Match, MatchGoals, PeriodFilter } from '#utils/types.ts';

import { MatchStats } from '#components/MatchesStats.tsx';
import { PeriodSelector } from '#components/PeriodSelector.tsx';
import { chronologicalMatches, filterByPeriod, matchGoals, toIsoDate } from '#utils/matches.ts';

type PerformanceChartProps = {
  matches: Match[];
};

type ChartMatch = {
  match: string;
  goalsFor: number;
  goalsAgainst: number;
};

const PerformanceChart = ({ matches }: PerformanceChartProps) => {
  const [period, setPeriod] = useState<PeriodFilter>({ preset: 'all', from: '', to: '' });

  const periodMatches: Match[] = filterByPeriod(matches, period, toIsoDate(new Date()));

  const chartData: ChartMatch[] = chronologicalMatches(periodMatches)
    .map((match: Match): MatchGoals | null => matchGoals(match))
    .filter((goals: MatchGoals | null): goals is MatchGoals => goals !== null)
    .map(
      (goals: MatchGoals, index: number): ChartMatch => ({
        match: `Partido ${(index + 1).toString()}`,
        ...goals,
      })
    );

  return (
    <div className='w-full lg:w-[450px]'>
      <h3 className='text-xl font-semibold mb-4 text-center'>Rendimiento</h3>

      <PeriodSelector period={period} onChange={setPeriod} />

      <div className='w-full h-72'>
        <ResponsiveContainer width='100%' height='100%'>
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />

            <XAxis dataKey='match' />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Legend />

            <Line
              type='monotone'
              dataKey='goalsAgainst'
              name='Goles en contra'
              stroke='#ef4444'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type='monotone'
              dataKey='goalsFor'
              name='Goles a favor'
              stroke='#22c55e'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <MatchStats matches={periodMatches} />
    </div>
  );
};

export { PerformanceChart };
