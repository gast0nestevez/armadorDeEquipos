import { createContext, useState } from 'react';

type User = {
  [key: string]: unknown;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearContext: () => void;
};

const UserContext: React.Context<UserContextType> = createContext<UserContextType>({} as UserContextType);

type UserProviderProps = {
  children: React.ReactNode;
};

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>((): User | null => {
    const saved: string | null = localStorage.getItem('user');
    return saved ? (JSON.parse(saved) as User) : null;
  });

  const clearContext = (): void => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, clearContext }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
