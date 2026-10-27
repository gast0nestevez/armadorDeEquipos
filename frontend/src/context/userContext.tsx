import { createContext, useEffect, useState } from 'react';

import { SESSION_EXPIRED_EVENT } from '#utils/api.ts';
import { clearSession, readStoredUser } from '#utils/session.ts';

type User = Record<string, unknown>;

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearContext: () => void;
};

const UserContext: React.Context<UserContextType> = createContext<UserContextType>(
  {} as UserContextType
);

type UserProviderProps = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const clearContext = (): void => {
    clearSession();
    setUser(null);
  };

  useEffect((): (() => void) => {
    const handleSessionExpired = (): void => {
      setUser(null);
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return (): void => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, clearContext }}>{children}</UserContext.Provider>
  );
};

export type { User };

export { UserContext, UserProvider };
