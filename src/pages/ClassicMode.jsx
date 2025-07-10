import { useState } from 'react'
import TeamsMaker from '../algorithm'
import usePlayers from '../hooks/usePlayers'
import Nav from '../components/Nav'
import Form from '../components/Form'
import Teams from '../components/Teams'

function ClassicMode() {
  const { players, setPlayers, handleChange, deletePlayer } = usePlayers([{ name: '', skill: '' }])
  const [teams, setTeams] = useState([{ players: [], skill: '' }, { players: [], skill: '' }])
  const [loading, setLoading] = useState(false)

  const submitPlayers = () => {
    setLoading(true)

    const valid_players = players
      .filter(player => player.name.trim() !== '' && player.skill.trim() !== '')
      .map(player => ({ name: player.name, skill: Number(player.skill) }))

    const teamsMaker = new TeamsMaker()
    
    setTimeout(() => {
      // Scroll to teams in phone
      if (window.innerWidth < 500) {
        const section = document.getElementById('see-teams')
        if (section) section.scrollIntoView({ behavior: "smooth" })
      }

      const result = teamsMaker.makeTeams(valid_players)
      setTeams(result)
      setLoading(false)
    }, 10)
  }

  return (
    <div className='main-container flex flex-col min-h-full max-h-full'>
      <Nav />
      <div className="flex flex-col md:flex-row flex-1 h-full overflow-hidden">
        <Form 
          players={players} 
          handleChange={handleChange} 
          deletePlayer={deletePlayer} 
          submitPlayers={submitPlayers} 
        />
        <Teams
          teams={teams}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default ClassicMode
