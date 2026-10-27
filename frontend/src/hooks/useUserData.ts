import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { User } from '#context/userContext.tsx';

import { UserContext } from '#context/userContext.tsx';
import { Env } from '#utils/env.ts';

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

type UserData<T> = {
  user: User | null;
  data: T[];
  setData: React.Dispatch<React.SetStateAction<T[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const useUserData: <T>(path: string) => UserData<T> = <T>(path: string): UserData<T> => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): void => {
    if (!user) {
      void navigate('/');
      return;
    }

    const fetchData = async (): Promise<void> => {
      setLoading(true);

      const options: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
      };

      try {
        const response: Response = await fetch(`${API_BASE_URL}${path}`, options);

        if (!response.ok) {
          throw new Error(`Error fetching ${path}`);
        }
        const { data: fetched }: { data: T[] } = (await response.json()) as { data: T[] };

        setData(fetched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [user, navigate, path]);

  return { user, data, setData, loading, setLoading };
};

export { useUserData };
