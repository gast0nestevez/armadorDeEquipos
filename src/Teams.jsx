import React from 'react'

function capitalize(s) {
  return String(s[0]).toUpperCase() + String(s).slice(1)
}

const Teams = ({ teams }) => {
  const copyToClipboard = () => {
    let teamsString = ''

    teams.forEach((team, index) => {
      teamsString += `Equipo ${index + 1}:\n`
      if (team.players.length === 0) {
        teamsString += '  Sin jugadores\n'
      } else {
        team.players.forEach((player) => {
          teamsString += `  - ${capitalize(player.name)}\n`
        })
      }
      teamsString += '\n'
    })
    
    navigator.clipboard.writeText(teamsString)
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
      
      <button className='copy-button' onClick={copyToClipboard}>Copiar equipos</button>
    </div>
  )
}

export default Teams
