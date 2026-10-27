import type { User } from '#context/userContext.tsx';

const USER_KEY: string = 'user';
const TOKEN_KEY: string = 'token';

const readStoredUser: () => User | null = (): User | null => {
  const saved: string | null = localStorage.getItem(USER_KEY);
  return saved ? (JSON.parse(saved) as User) : null;
};

const getToken: () => string = (): string => localStorage.getItem(TOKEN_KEY) ?? '';

const saveSession: (user: User, token: string) => void = (user: User, token: string): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(TOKEN_KEY, token);
};

const clearSession: () => void = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
};

export { clearSession, getToken, readStoredUser, saveSession };
