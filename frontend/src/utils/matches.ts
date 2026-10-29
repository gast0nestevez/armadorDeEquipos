import type { Match, MatchGoals, MatchStatsSummary, PeriodFilter, Result } from '#utils/types.ts';

const chronologicalMatches: (matches: Match[]) => Match[] = (matches: Match[]): Match[] =>
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
    .toReversed();

const lastTenMatches: (matches: Match[]) => Match[] = (matches: Match[]): Match[] =>
  chronologicalMatches(matches).slice(-10);

const canBeDraw: (goals1: number | null, goals2: number | null) => boolean = (
  goals1: number | null,
  goals2: number | null
): boolean =>
  goals1 !== null &&
  goals2 !== null &&
  !Number.isNaN(goals1) &&
  !Number.isNaN(goals2) &&
  goals1 === goals2;

const matchGoals: (match: Match) => MatchGoals | null = ({
  goals1,
  goals2,
  result,
}: Match): MatchGoals | null => {
  if (result === 'Win') {
    return { goalsFor: Math.max(goals1, goals2), goalsAgainst: Math.min(goals1, goals2) };
  }
  if (result === 'Lose') {
    return { goalsFor: Math.min(goals1, goals2), goalsAgainst: Math.max(goals1, goals2) };
  }
  if (result === 'Draw') {
    return { goalsFor: goals1, goalsAgainst: goals2 };
  }

  return null;
};

const toIsoDate: (date: Date) => string = (date: Date): string =>
  `${date.getFullYear().toString()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

const shiftIsoDate: (isoDate: string, days: number) => string = (
  isoDate: string,
  days: number
): string => {
  const [year, month, day]: number[] = isoDate.split('-').map(Number);
  const shifted: Date = new Date(Date.UTC(year, month - 1, day + days));
  return shifted.toISOString().slice(0, 10);
};

const filterByDateRange: (matches: Match[], from: string, to: string) => Match[] = (
  matches: Match[],
  from: string,
  to: string
): Match[] =>
  matches.filter(
    ({ date }: Match): boolean => date !== '' && (!from || date >= from) && (!to || date <= to)
  );

const filterByPeriod: (matches: Match[], period: PeriodFilter, today: string) => Match[] = (
  matches: Match[],
  period: PeriodFilter,
  today: string
): Match[] => {
  switch (period.preset) {
    case 'all': {
      return matches;
    }
    case 'custom': {
      return period.from || period.to
        ? filterByDateRange(matches, period.from, period.to)
        : matches;
    }
    case 'last10': {
      return lastTenMatches(matches);
    }
    case 'last30': {
      return filterByDateRange(matches, shiftIsoDate(today, -30), '');
    }
    case 'last90': {
      return filterByDateRange(matches, shiftIsoDate(today, -90), '');
    }
    case 'year': {
      return filterByDateRange(matches, `${today.slice(0, 4)}-01-01`, '');
    }
  }
};

const computeStats: (matches: Match[]) => MatchStatsSummary | null = (
  matches: Match[]
): MatchStatsSummary | null => {
  const played: Match[] = chronologicalMatches(matches).filter(
    (match: Match): boolean => matchGoals(match) !== null
  );

  if (played.length === 0) {
    return null;
  }

  const count: (result: Result) => number = (result: Result): number =>
    played.filter((match: Match): boolean => match.result === result).length;

  let goalsFor: number = 0;
  let goalsAgainst: number = 0;
  let cleanSheets: number = 0;
  let biggestWin: MatchGoals | null = null;
  let bestWinStreak: number = 0;
  let runningWins: number = 0;

  played.forEach((match: Match): void => {
    const goals: MatchGoals | null = matchGoals(match);
    if (!goals) {
      return;
    }

    goalsFor += goals.goalsFor;
    goalsAgainst += goals.goalsAgainst;
    if (goals.goalsAgainst === 0) {
      cleanSheets++;
    }

    if (match.result === 'Win') {
      runningWins++;
      bestWinStreak = Math.max(bestWinStreak, runningWins);
      if (
        !biggestWin ||
        goals.goalsFor - goals.goalsAgainst > biggestWin.goalsFor - biggestWin.goalsAgainst
      ) {
        biggestWin = goals;
      }
    } else {
      runningWins = 0;
    }
  });

  const streakResult: Result = played[played.length - 1].result;
  let streak: number = 0;
  for (let i: number = played.length - 1; i >= 0 && played[i].result === streakResult; i--) {
    streak++;
  }

  return {
    played: played.length,
    wins: count('Win'),
    draws: count('Draw'),
    losses: count('Lose'),
    winRate: (count('Win') / played.length) * 100,
    goalsFor,
    goalsAgainst,
    avgFor: goalsFor / played.length,
    avgAgainst: goalsAgainst / played.length,
    goalDifference: goalsFor - goalsAgainst,
    cleanSheets,
    streak,
    streakResult,
    bestWinStreak,
    biggestWin,
  };
};

export {
  canBeDraw,
  chronologicalMatches,
  computeStats,
  filterByPeriod,
  lastTenMatches,
  matchGoals,
  toIsoDate,
};
