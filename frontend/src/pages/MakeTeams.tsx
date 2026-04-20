import { useEffect, useRef, useState } from 'react';

import TeamsMaker from '@/utils/teamsMaker';
import usePlayers from '@/hooks/usePlayers';
import Nav from '@/components/Nav';
import Form, { PlayerInput } from '@/components/Form';
import TeamsDisplay from '@/components/TeamsDisplay';

type Team = {
  players: PlayerInput[];
  skill: number;
};

const initialTeams: Team[] = [
  { players: [], skill: 0 },
  { players: [], skill: 0 },
];

const MakeTeams = () => {
  const { players, handleChange, deletePlayer } = usePlayers([{ name: '', skill: '' }]);
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [loading, setLoading] = useState<boolean>(false);
  const teamsRef = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    const teamsSection: HTMLDivElement | null = teamsRef.current;
    if (teamsSection) {
      teamsSection.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [teams]);

  const submitPlayers = (): void => {
    setLoading(true);

    const validPlayers: PlayerInput[] = players
      .filter((player: { name: string, skill: string }): boolean => player.name.trim() !== '' && player.skill.trim() !== '')
      .map((player: { name: string, skill: string }): PlayerInput => ({ name: player.name, skill: Number.parseInt(player.skill) }));

    const teamsMaker: TeamsMaker = new TeamsMaker();

    setTimeout((): void => {
      const result: any = teamsMaker.makeTeams(validPlayers);
      setTeams(result);
      setLoading(false);
    }, 10);
  };

  return (
    <div className='main-container flex flex-col h-full'>
      <Nav />
      <div className='flex flex-col md:flex-row flex-1 h-full overflow-hidden'>
        <Form
          players={players as any}
          handleChange={handleChange}
          deletePlayer={deletePlayer}
          submitPlayers={submitPlayers}
        />
        <TeamsDisplay
          teams={teams as any}
          loading={loading}
          teamsRef={teamsRef as any}
        />
      </div>
    </div>
  );
};

export default MakeTeams;