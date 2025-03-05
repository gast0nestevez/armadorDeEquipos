import { useState } from 'react'
import './App.css'
import TeamsMaker from './algorithm'

function App() {
  const [players, setPlayers] = useState([{ name: '', skill: '' }])
  const [teams, setTeams] = useState([])

  const handleChange = (index, field, value) => {
    const newPlayers = [...players]
    newPlayers[index][field] = value
    setPlayers(newPlayers)
  
    // Automatically add a new player if the last one is fully filled
    if (
      index === players.length - 1 && 
      newPlayers[index].name.trim() !== '' &&
      newPlayers[index].skill.trim() !== ''
    ) {
      setPlayers([...newPlayers, { name: '', skill: '' }])
    }
  }

  const submitPlayers = () => {
    const filtered_players = players
      .filter(player => player.name.trim() !== '' && player.skill.trim() !== '')
      .map(player => ({ name: player.name, skill: Number(player.skill) }))
    //console.log('displaying players...', filtered_players)
  
    const teamsMaker = new TeamsMaker()
    const result = teamsMaker.makeTeams(filtered_players)
    //console.log(result)
    setTeams(result)

    return
  }

  return (
    <>
    <div className='main-container'>
      <div className="inputs">
        {players.map((player, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Nombre"
              value={player.name}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
            />
            <input
              type="number"
              placeholder="Puntaje"
              value={player.skill}
              onChange={(e) => handleChange(index, 'skill', e.target.value)}
            />
          </div>
        ))}
        
        <button onClick={submitPlayers}>
          Submit
        </button>
      </div>

      <div className="teams">
        {teams.length > 0 && teams.map((team, index) => (
          <div key={index} className="team-container">
            <h3>Equipo {index + 1} ({team.skill})</h3>
            <ul>
              {team.players.map((player, i) => (
                <li key={i}>{player.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

    </div>
    </>
  )
}

export default App
