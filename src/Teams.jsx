import React from 'react'

function capitalize(s) {
  return String(s[0]).toUpperCase() + String(s).slice(1);
}

const Teams = ({ teams }) => {
  return (
    <div className="teams">
      {teams.length === 0 ? (
        <div className="team-container">
          <h3>Todavía no armaste equipos :(</h3>
        </div>
      ) : (
        teams.map((team, index) => (
          <div key={index} className="team-container">
            <h3>Equipo {index + 1}</h3>
            <ul>
              {team.players.map((player, i) => (
                <li key={i}>{capitalize(player.name)}</li>
              ))}
              {team.players.length === 0 && <li>No players</li>}
            </ul>
          </div>
        ))
      )}
    </div>
  )
}

export default Teams
