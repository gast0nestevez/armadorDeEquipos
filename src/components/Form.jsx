import React, { useState } from 'react'

const Form = ({ players, handleChange, deletePlayer, submitPlayers }) => {
  const [disabled, setDisabled] = useState(false)

  /*const submitPressed = () => {
    const valid_players = players
      .filter(player => player.name.trim() !== '' && player.skill.trim() !== '')
      .map(player => ({ name: player.name, skill: Number(player.skill) }))

    setDisabled(true)
    setTimeout(() => setDisabled(false), 100)
    submitPlayers(valid_players)
  }*/

  return (
    <div className="inputs">
      <h1>Jugadores</h1>
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
