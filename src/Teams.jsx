import React from 'react'

const Teams = ({ teams }) => {
  return (
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
  )
}

export default Teams
