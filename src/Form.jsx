import React, { useState } from 'react'

const Form = ({ players, setPlayers, submitPlayers }) => {
  const [disabled, setDisabled] = useState(false)

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

  /*const submitPressed = () => {
    setDisabled(true)
    setTimeout(() => setDisabled(false), 100)
    submitPlayers()
  }*/

  const deletePlayer = (index) => {
    const newPlayers = players.filter((_, playerIndex) => playerIndex !== index)
    setPlayers(newPlayers)
  }

  return (
    <div className="inputs">
      {players.map((player, index) => (
        <div key={index} className='player-input'>
          <label htmlFor={index}>{index+1}</label>
          <input
            type="text"
            placeholder="Nombre"
            id={index}
            value={player.name}
            onChange={(e) => handleChange(index, 'name', e.target.value)}
          />
          <input
            type="number"
            placeholder="Puntaje"
            value={player.skill}
            onChange={(e) => handleChange(index, 'skill', e.target.value)}
          />
          <button className='delete-button' tabIndex="-1" onClick={() => deletePlayer(index)}>
            <img src="delete.png" alt="delete player"/>
          </button>
        </div>
      ))}
      <button className='action-button' disabled={disabled} onClick={submitPlayers}>Armar equipos</button>
    </div>
  )
}

export default Form
