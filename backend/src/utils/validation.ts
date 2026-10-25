const EMAIL_REGEX: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH: number = 254;
const MAX_PASSWORD_LENGTH: number = 72;
const MATCH_RESULTS: string[] = ['Lose', 'Draw', 'Win', ''];
const DATE_REGEX: RegExp = /^\d{4}-\d{2}-\d{2}$/;

const isValidEmail: (email: unknown) => email is string = (email: unknown): email is string =>
  typeof email === 'string' && email.length <= MAX_EMAIL_LENGTH && EMAIL_REGEX.test(email);

const isValidPasswordLength: (password: string) => boolean = (password: string): boolean =>
  password.length >= 8 && password.length <= MAX_PASSWORD_LENGTH;

const isValidGoal: (goal: unknown) => boolean = (goal: unknown): boolean =>
  goal === undefined || (Number.isInteger(goal) && (goal as number) >= 0);

const isValidResult: (result: unknown) => boolean = (result: unknown): boolean =>
  result === undefined || (typeof result === 'string' && MATCH_RESULTS.includes(result));

const isValidDate: (date: unknown) => boolean = (date: unknown): boolean =>
  date === undefined || (typeof date === 'string' && DATE_REGEX.test(date));

export {
  isValidDate,
  isValidEmail,
  isValidGoal,
  isValidPasswordLength,
  isValidResult,
  MAX_PASSWORD_LENGTH,
};
