import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { User } from '#context/userContext.tsx';

import { useNotification } from '#context/notificationContext.tsx';
import { UserContext } from '#context/userContext.tsx';
import { api } from '#utils/api.ts';
import { getErrorMessage } from '#utils/errors.ts';

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
  const { notify } = useNotification();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): void => {
    if (!user) {
      void navigate('/');
      return;
    }

    const fetchData = async (): Promise<void> => {
      setLoading(true);

      try {
        setData(await api.get<T[]>(path));
      } catch (err) {
        notify(getErrorMessage(err, 'No pudimos cargar tus datos.'));
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [user, navigate, path, notify]);

  return { user, data, setData, loading, setLoading };
};

export { useUserData };
