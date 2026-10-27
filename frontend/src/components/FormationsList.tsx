import { AnimatePresence } from 'framer-motion';
import { Trash2, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import type { Formation, Player } from '#utils/types.ts';

import { Modal } from '#components/Modal.tsx';
import { PromoteFormationForm } from '#components/PromoteFormationForm.tsx';
import { Skeleton } from '#components/Skeleton.tsx';
import { useNotification } from '#context/notificationContext.tsx';
import { api } from '#utils/api.ts';
import { getErrorMessage } from '#utils/errors.ts';
import { capitalize } from '#utils/string.ts';

type FormationsListProps = {
  formations: Formation[];
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
  loading: boolean;
};

const formatCreatedAt: (createdAt: string) => string = (createdAt: string): string =>
  new Date(createdAt).toLocaleDateString('es-AR');

const FormationsList = ({ formations, setFormations, loading }: FormationsListProps) => {
  const [promoting, setPromoting] = useState<Formation | null>(null);
  const { notify } = useNotification();

  const deleteFormation = async (id: string): Promise<void> => {
    const userChoice: boolean = confirm('¿Seguro que querés eliminar esta formación?');

    if (!userChoice) {
      return;
    }

    try {
      await api.delete<unknown>('/formation', { ids: [id] });

      setFormations((prev: Formation[]) => prev.filter((f: Formation) => f._id !== id));
    } catch (err) {
      notify(getErrorMessage(err, 'No pudimos eliminar la formación.'));
    }
  };

  const teamPlayers = (formation: Formation, team: 1 | 2): Player[] =>
    formation.players.filter((p: Player): boolean => p.team === team);

  return (
    <div className='w-full'>
      <h2 className='text-xl font-semibold mb-4 text-center'>Formaciones guardadas</h2>

      {loading ? (
        <div role='status' aria-busy='true' className='space-y-4'>
          <span className='sr-only'>Cargando formaciones</span>
          <Skeleton className='h-24 w-full rounded-lg' />
          <Skeleton className='h-24 w-full rounded-lg' />
        </div>
      ) : formations.length === 0 ? (
        <p className='text-gray-600 text-center'>
          Todavía no guardaste ninguna formación.{' '}
          <Link to='/armar' className='font-semibold text-blue-900 underline'>
            Armá equipos
          </Link>{' '}
          y guardalos para jugarlos después.
        </p>
      ) : (
        <ul className='grid gap-4 md:grid-cols-2'>
          {formations.map(
            (formation: Formation): React.JSX.Element => (
              <li
                key={formation._id}
                className='flex flex-col gap-3 border border-gray-200 rounded-lg shadow-sm p-4 bg-white'
              >
                <div className='text-center text-gray-600 text-sm'>
                  {formatCreatedAt(formation.createdAt)}
                </div>

                <div className='flex justify-between gap-4'>
                  {([1, 2] as const).map(
                    (team: 1 | 2): React.JSX.Element => (
                      <div key={team} className={team === 1 ? 'flex-1' : 'flex-1 text-right'}>
                        <h3 className='font-semibold black-text mb-2'>Equipo {team}</h3>
                        <ul className='space-y-1'>
                          {teamPlayers(formation, team).map(
                            (p: Player, index: number): React.JSX.Element => (
                              <li key={`${p.name}-${index.toString()}`} className='text-gray-700'>
                                {capitalize(p.name)}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )
                  )}
                </div>

                <div className='flex justify-between items-center'>
                  <button
                    type='button'
                    aria-label='Eliminar formación'
                    className='px-3 py-2 rounded-lg bg-gray-200 text-gray-600 transition-colors duration-200 ease-in-out cursor-pointer hover:bg-gray-300'
                    onClick={() => void deleteFormation(formation._id)}
                  >
                    <Trash2 size={16} aria-hidden='true' />
                  </button>

                  <button
                    type='button'
                    className='flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 white-text transition-colors duration-200 ease-in-out cursor-pointer hover:bg-blue-700'
                    onClick={() => {
                      setPromoting(formation);
                    }}
                  >
                    <Trophy size={16} aria-hidden='true' />
                    Pasar a partido
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      <AnimatePresence>
        {promoting && (
          <Modal
            label='Pasar a partido'
            className='max-w-sm'
            onClose={() => {
              setPromoting(null);
            }}
          >
            <PromoteFormationForm formation={promoting} setFormations={setFormations} />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export { FormationsList };
