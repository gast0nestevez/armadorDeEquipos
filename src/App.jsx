import { useState } from 'react'
import './App.css'
import TeamsMaker from './algorithm'
import Form from './Form'
import Teams from './Teams'

function App() {
  const [players, setPlayers] = useState([{ name: '', skill: '' }])
  const [teams, setTeams] = useState([])

  const submitPlayers = () => {
    const filtered_players = players
      .filter(player => player.name.trim() !== '' && player.skill.trim() !== '')
      .map(player => ({ name: player.name, skill: Number(player.skill) }))

    const teamsMaker = new TeamsMaker()
    const result = teamsMaker.makeTeams(filtered_players)
    setTeams(result)
  }

  return (
    <div className='main-container'>
      <Form players={players} setPlayers={setPlayers} submitPlayers={submitPlayers} />
      <Teams teams={teams} />
    </div>
  )
}

export default App
