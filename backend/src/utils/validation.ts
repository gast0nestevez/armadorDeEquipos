const MATCH_RESULTS: string[] = ['Lose', 'Draw', 'Win', ''];
const DATE_REGEX: RegExp = /^\d{4}-\d{2}-\d{2}$/;

const isValidGoal: (goal: unknown) => boolean = (goal: unknown): boolean =>
  goal === undefined || (Number.isInteger(goal) && (goal as number) >= 0);

const isValidResult: (result: unknown) => boolean = (result: unknown): boolean =>
  result === undefined || (typeof result === 'string' && MATCH_RESULTS.includes(result));

const isValidDate: (date: unknown) => boolean = (date: unknown): boolean =>
  date === undefined || (typeof date === 'string' && (DATE_REGEX.test(date) || date === ''));

export { isValidDate, isValidGoal, isValidResult };
