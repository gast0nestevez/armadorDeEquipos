import React, { useState } from 'react'

const Form = ({ players, handleChange, deletePlayer, submitPlayers }) => {
  return (
    <div className="inputs">
      <h1>Jugadores</h1>
      {players.map((player, index) => (
        <div key={index} className='player-input'>
          <label htmlFor={index}>{index+1}</label>
          <input
            type="text"
            placeholder="Nombre"
            maxLength="25"
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
      <button className='action-button' onClick={submitPlayers}>Armar equipos</button>
    </div>
  )
}

export default Form
