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

import type { Match } from '../utils/types';

type PerformanceChartProps = {
  matches: Match[];
};

type ChartMatch = {
  match: string;
  goalsFor: number;
  goalsAgainst: number;
};

const PerformanceChart = ({ matches }: PerformanceChartProps) => {
  const chartData: ChartMatch[] = [...matches]
    .toSorted(({ date: dateA }: Match, { date: dateB }: Match): number => {
      if (!dateA && !dateB) {
        return 0;
      }

      if (!dateA) {
        return 1;
      }
      if (!dateB) {
        return -1;
      }

      return new Date(dateA).getTime() - new Date(dateB).getTime();
    })
    .slice(-10)
    .map(({ goals1, goals2, result }: Match, index: number): ChartMatch | undefined => {
      if (result === 'Win') {
        return {
          match: `Partido ${index.toString()}`,
          goalsFor: Math.max(goals1, goals2),
          goalsAgainst: Math.min(goals1, goals2),
        };
      } else if (result === 'Lose') {
        return {
          match: `Partido ${index.toString()}`,
          goalsFor: Math.min(goals1, goals2),
          goalsAgainst: Math.max(goals1, goals2),
        };
      } else if (result === 'Draw') {
        return {
          match: `Partido ${index.toString()}`,
          goalsFor: goals1,
          goalsAgainst: goals2,
        };
      }

      return undefined;
    })
    .filter((match: ChartMatch | undefined): match is ChartMatch => match !== undefined);

  return (
    <div className='w-full lg:w-[450px]'>
      <h3 className='text-xl font-semibold mb-4 text-center'>Rendimiento reciente</h3>

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
              dataKey='goalsFor'
              name='A favor'
              stroke='#22c55e'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type='monotone'
              dataKey='goalsAgainst'
              name='En contra'
              stroke='#ef4444'
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export { PerformanceChart };
