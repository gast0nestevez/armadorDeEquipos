import type { Match } from '#utils/types.ts';

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

const canBeDraw: (goals1: number | null, goals2: number | null) => boolean = (
  goals1: number | null,
  goals2: number | null
): boolean =>
  goals1 !== null &&
  goals2 !== null &&
  !Number.isNaN(goals1) &&
  !Number.isNaN(goals2) &&
  goals1 === goals2;

export { canBeDraw, lastTenMatches };
