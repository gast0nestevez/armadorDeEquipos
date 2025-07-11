import { useState } from 'react'
import Loader from './Loader'

function capitalize(s) {
  return String(s[0]).toUpperCase() + String(s).slice(1)
}

const Teams = ({ teams, loading }) => {
  const [copyMessageVisible, setCopyMessageVisible] = useState(false)

  const teamsToString = () => {
    return teams.map((team, index) => 
      `Equipo ${index + 1}:\n` + 
      (team.players.length === 0 
        ? 'Sin jugadores\n' 
        : team.players
            .sort()
            .map(player => `  - ${capitalize(player.name)}`)
            .join('\n'))
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
    <div className="teams w-full p-6 bg-blue-100 min-h-full flex flex-col justify-between">
      <h1 className="text-3xl font-bold mb-4 text-center">Equipos</h1>
      <div className="flex justify-center gap-6 flex-wrap">
        {teams.map((team, index) => (
          <div key={index} className="bg-white shadow-md rounded-xl p-6 w-48 text-center">
            <h3 className="text-xl font-bold mb-2">Equipo {index + 1}</h3>
            {loading ? (
              <Loader />
            ) : (
              <ul className="text-gray-700">
                {team.players.length > 0 ? (
                  team.players
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((player, i) => (
                      <li key={i} className='py-1'>{capitalize(player.name)}</li>
                    ))
                ) : (
                  <li>Sin jugadores</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 text-center" id='see-teams'>
        <button
          onClick={copyToClipboard}
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 cursor-pointer"
        >
          Copiar equipos
        </button>
        {copyMessageVisible && (
          <div className="copy-message">Equipos copiados correctamente!</div>
        )}
      </div>
    </div>
  )
}


export default Teams
