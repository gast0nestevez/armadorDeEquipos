import { useEffect, useRef } from 'react';

import type { UsePlayersReturn } from '../hooks/types';

import Form from '../components/Form';
import Nav from '../components/Nav';
import TeamsDisplay from '../components/TeamsDisplay';
import usePlayers from '../hooks/usePlayers';

const MakeTeams = () => {
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

export default MakeTeams;
