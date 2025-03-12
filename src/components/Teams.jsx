import React, { useState } from 'react'

function capitalize(s) {
  return String(s[0]).toUpperCase() + String(s).slice(1)
}

const Teams = ({ teams }) => {
  const [copyMessageVisible, setCopyMessageVisible] = useState(false)

  const teamsToString = () => {
    return teams.map((team, index) => 
      `Equipo ${index + 1}:\n` + 
      (team.players.length === 0 
        ? '  Sin jugadores\n' 
        : team.players.map(player => `  - ${capitalize(player.name)}`).join('\n'))
    ).join('\n\n')
  }

  const showMessage = () => {
    setCopyMessageVisible(true)
    setTimeout(() => {
      setCopyMessageVisible(false)
    }, 2000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(teamsToString())
    showMessage()
  }

  return (
    <div className="teams-details">
      <div className="teams">
        {teams.length === 0 ? (
          <div className="team-container">
            <h3>Acá van a estar tus equipos</h3>
          </div>
        ) : (
          teams.map((team, index) => (
            <div key={index} className="team-container">
              <h3>Equipo {index + 1}</h3>
              <ul>
                {team.players.map((player, i) => (
                  <li key={i}>{capitalize(player.name)}</li>
                ))}
                {team.players.length === 0 && <li>Sin jugadores</li>}
              </ul>
            </div>
          ))
        )}
      </div>

      <button className='action-button copy-button' onClick={copyToClipboard}>Copiar equipos</button>

      {copyMessageVisible && (
        <div className="copy-message">
          Equipos copiados correctamente!
        </div>
      )}
    </div>
  )
}

export default Teams
