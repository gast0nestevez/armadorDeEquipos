import { useEffect, useRef, useState } from 'react'

import TeamsMaker from '@/utils/teamsMaker'
import usePlayers from '@/hooks/usePlayers'
import Nav from '@/components/Nav'
import Form from '@/components/Form'
import TeamsDisplay from '@/components/TeamsDisplay'

function ClassicMode() {
  const { players, handleChange, deletePlayer } = usePlayers([{ name: '', skill: '' }])
  const [teams, setTeams] = useState([{ players: [], skill: '' }, { players: [], skill: '' }])
  const [loading, setLoading] = useState(false)
  const teamsRef = useRef(null)

  useEffect(() => {
    // Scroll to teams in mobile when generated
    const teamsSection = teamsRef.current
    if (teamsSection) teamsSection.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [teams])

  const submitPlayers = () => {
    setLoading(true)

    const validPlayers = players
      .filter(player => player.name.trim() !== '' && player.skill.trim() !== '')
      .map(player => ({ name: player.name, skill: Number(player.skill) }))

    const teamsMaker = new TeamsMaker()
    
    setTimeout(() => {
      const result = teamsMaker.makeTeams(validPlayers)
      setTeams(result)
      setLoading(false)
    }, 10)
  }

  return (
    <div className='main-container flex flex-col h-full'>
      <Nav />
      <div className='flex flex-col md:flex-row flex-1 h-full overflow-hidden'>
        <Form 
          players={players} 
          handleChange={handleChange} 
          deletePlayer={deletePlayer} 
          submitPlayers={submitPlayers} 
        />
        <TeamsDisplay
          teams={teams}
          loading={loading}
          teamsRef={teamsRef}
        />
      </div>
    </div>
  )
}

export default ClassicMode
