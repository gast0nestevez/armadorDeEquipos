import { useState } from 'react'
import './App.css'

function App() {
  const [players, setPlayers] = useState([{ name: '', skill: '' }])

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

  /*const addPlayer = () => {
    setPlayers([...players, { name: '', skill: '' }])
  }*/

  const submitPlayers = () => {
    const filtered_players = players.filter(player => player.name.trim() !== '' && player.skill.trim() !== '')
    console.log('displaying players...', filtered_players)
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
        {/*<button onClick={addPlayer}>Add Player</button>*/}
        <button onClick={submitPlayers}>
          Submit
        </button>
      </div>

      <div className="equipos">
          <p>Equipos...</p>
      </div>
    </div>
    </>
  )
}

export default App
