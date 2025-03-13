import { useState } from 'react'
import '../css/classic.css'
import TeamsMaker from '../algorithm'
import usePlayers from '../hooks/usePlayers'
import Form from '../components/Form'
import Teams from '../components/Teams'

function ClassicMode() {
  const { players, setPlayers, handleChange, deletePlayer } = usePlayers([{ name: '', skill: '' }]/*Array.from({ length: 10 }, () => ({ name: '', skill: '' }))*/)
  const [teams, setTeams] = useState([])

  const submitPlayers = () => {
    const valid_players = players
      .filter(player => player.name.trim() !== '' && player.skill.trim() !== '')
      .map(player => ({ name: player.name, skill: Number(player.skill) }))

    const teamsMaker = new TeamsMaker()
    const result = teamsMaker.makeTeams(valid_players)
    setTeams(result)
  }

  return (
    <div className='main-container'>
      <Form 
        players={players} 
        handleChange={handleChange} 
        deletePlayer={deletePlayer} 
        submitPlayers={submitPlayers} 
      />
      <Teams
        teams={teams}
      />
    </div>
  )
}

export default ClassicMode
