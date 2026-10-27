import type { User } from '#context/userContext.tsx';
import type { Match } from '#utils/types.ts';

import { MatchesList } from '#components/MatchesList.tsx';
import { UserPageLayout } from '#components/UserPageLayout.tsx';
import { useSeo } from '#hooks/useSeo.ts';
import { useUserData } from '#hooks/useUserData.ts';

const Matches = () => {
  useSeo({
    title: 'Mis partidos | Armador de Equipos',
    description: 'Historial y estadísticas de tus partidos.',
    path: '/partidos',
    indexable: false,
  });

  const {
    user,
    data: matches,
    setData: setMatches,
    loading,
    setLoading,
  }: {
    user: User | null;
    data: Match[];
    setData: React.Dispatch<React.SetStateAction<Match[]>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  } = useUserData<Match>('/match');

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg animate-pulse'>Cargando partidos.</p>
      </div>
    );
  }

  return (
    <UserPageLayout title='Mis partidos'>
      <MatchesList
        matches={matches}
        setMatches={setMatches}
        loadingMatches={loading}
        setLoadingMatches={setLoading}
      />
    </UserPageLayout>
  );
};

export { Matches };
