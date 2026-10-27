import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Formation, Match } from '#utils/types.ts';

import { FormationsList } from '#components/FormationsList.tsx';
import { MatchesList } from '#components/MatchesList.tsx';
import { Nav } from '#components/Nav.tsx';
import { UserContext } from '#context/userContext.tsx';
import { useSeo } from '#hooks/useSeo.ts';
import { handleGoogleLogout } from '#utils/auth.ts';
import { Env } from '#utils/env.ts';

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

const Profile = () => {
  useSeo({
    title: 'Mis partidos y formaciones | Armador de Equipos',
    description: 'Historial, estadísticas y formaciones guardadas.',
    path: '/perfil',
    indexable: false,
  });

  const navigate = useNavigate();
  const { user, clearContext } = useContext(UserContext);
  const [matches, setMatches] = useState<Match[]>([]);
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loadingMatches, setLoadingMatches] = useState<boolean>(false);

  useEffect((): void => {
    if (!user) {
      void navigate('/');
      return;
    }

    const fetchData = async (): Promise<void> => {
      setLoadingMatches(true);

      const options: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') ?? ''}`,
        },
      };

      try {
        const [matchesResponse, formationsResponse]: Response[] = await Promise.all([
          fetch(`${API_BASE_URL}/match`, options),
          fetch(`${API_BASE_URL}/formation`, options),
        ]);

        if (!matchesResponse.ok || !formationsResponse.ok) {
          throw new Error('Error fetching profile data');
        }
        const { data: matches }: { data: Match[] } = (await matchesResponse.json()) as {
          data: Match[];
        };
        const { data: formations }: { data: Formation[] } = (await formationsResponse.json()) as {
          data: Formation[];
        };

        setMatches(matches);
        setFormations(formations);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMatches(false);
      }
    };

    void fetchData();
  }, [user, navigate]);

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg animate-pulse'>Cargando perfil.</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />

      <main className='flex flex-col items-center flex-1 w-full px-4 py-8'>
        <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl mb-8'>
          <MatchesList
            matches={matches}
            setMatches={setMatches}
            loadingMatches={loadingMatches}
            setLoadingMatches={setLoadingMatches}
          />
        </div>

        <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-6xl mb-8'>
          <FormationsList
            formations={formations}
            setFormations={setFormations}
            setMatches={setMatches}
            loading={loadingMatches}
          />
        </div>

        <button
          className='bg-gray-300 text-gray-800 py-2.5 px-6 rounded-lg font-bold hover:bg-gray-400 transition-colors duration-200 ease-in-out cursor-pointer'
          onClick={() => {
            handleGoogleLogout(clearContext);
          }}
        >
          Cerrar sesión
        </button>
      </main>
    </div>
  );
};

export { Profile };
