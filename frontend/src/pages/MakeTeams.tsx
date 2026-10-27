import { useEffect, useRef } from 'react';

import type { UsePlayersReturn } from '#utils/types.ts';

import { Form } from '#components/Form.tsx';
import { Nav } from '#components/Nav.tsx';
import { TeamsDisplay } from '#components/TeamsDisplay.tsx';
import { usePlayers } from '#hooks/usePlayers.tsx';
import { useSeo } from '#hooks/useSeo.ts';

const MakeTeams = () => {
  useSeo({
    title: 'Armar equipos de fútbol balanceados | Armador de Equipos',
    description:
      'Cargá los jugadores con su puntaje y generá dos equipos de fútbol parejos al instante. Gratis y sin registro.',
    path: '/armar',
  });

  const {
    players,
    handleChange,
    deletePlayer,
    submitPlayers,
    submitted,
    teams,
    loading,
  }: UsePlayersReturn = usePlayers([{ name: '', skill: '' }]);
  const teamsRef = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    const teamsSection: HTMLDivElement | null = teamsRef.current;
    if (teamsSection) {
      teamsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [teams]);

  return (
    <div className='main-container flex flex-col h-full'>
      <Nav />
      <h1 className='sr-only'>Armador de equipos de fútbol</h1>
      <div className='flex flex-col md:flex-row flex-1 h-full overflow-hidden'>
        <Form
          players={players}
          handleChange={handleChange}
          deletePlayer={deletePlayer}
          submitPlayers={submitPlayers}
          submitted={submitted}
        />
        <TeamsDisplay teams={teams} loading={loading} teamsRef={teamsRef} />
      </div>
    </div>
  );
};

export { MakeTeams };
