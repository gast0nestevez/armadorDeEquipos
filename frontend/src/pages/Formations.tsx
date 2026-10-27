import type { User } from '#context/userContext.tsx';
import type { Formation } from '#utils/types.ts';

import { FormationsList } from '#components/FormationsList.tsx';
import { UserPageLayout } from '#components/UserPageLayout.tsx';
import { useSeo } from '#hooks/useSeo.ts';
import { useUserData } from '#hooks/useUserData.ts';

const Formations = () => {
  useSeo({
    title: 'Formaciones guardadas | Armador de Equipos',
    description: 'Formaciones guardadas listas para pasar a partido.',
    path: '/formaciones',
    indexable: false,
  });

  const {
    user,
    data: formations,
    setData: setFormations,
    loading,
  }: {
    user: User | null;
    data: Formation[];
    setData: React.Dispatch<React.SetStateAction<Formation[]>>;
    loading: boolean;
  } = useUserData<Formation>('/formation');

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <p className='text-gray-600 text-lg animate-pulse'>Cargando formaciones.</p>
      </div>
    );
  }

  return (
    <UserPageLayout title='Formaciones guardadas'>
      <FormationsList formations={formations} setFormations={setFormations} loading={loading} />
    </UserPageLayout>
  );
};

export { Formations };
