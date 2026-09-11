import type { Match } from './types';

const lastTenMatches: (matches: Match[]) => Match[] = (matches: Match[]): Match[] =>
  [...matches]
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
    .toReversed()
    .slice(-10);

export { lastTenMatches };
