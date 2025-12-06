import { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { config } from '../../constants'
import TeamCard from './TeamCard'
import useFlashMessage from '../hooks/useFlashMessage'

const API_BASE_URL = config.apiUrl

const capitalize = (s) => String(s[0]).toUpperCase() + String(s).slice(1)

const Teams = ({ teams, loading }) => {
  const { user } = useContext(UserContext)
  const copyMessage = useFlashMessage()
  const saveMessage = useFlashMessage()

  const playersNotEmpty = teams[0].players.length > 0 || teams[1].players.length > 0
  
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

  const copyToClipboard = () => {
    copyMessage.trigger()
    navigator.clipboard.writeText(teamsToString())
  }

  const mapTeamsToPlayers = (teams) =>
    teams.flatMap((team, index) =>
      team.players.map(p => ({
        name: capitalize(p.name),
        skill: p.skill,
        team: index + 1
      }))
    )

  const saveMatch = async () => {
    saveMessage.trigger()
    const players = mapTeamsToPlayers(teams)

    const url = `${API_BASE_URL}/match`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ players })
    }
    
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Something went wrong during posting match')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='teams flex flex-col justify-between p-6 bg-blue-100 min-h-full w-full'>
      <h1 className='text-3xl font-bold mb-4 text-center'>Equipos</h1>
      <div className='flex justify-center gap-6 overflow-hidden'>
        {teams.map((team, index) => (
          <TeamCard
            index={index}
            players={team.players}
            loading={loading}
          />
        ))}
      </div>

      <div className='flex justify-around mt-6 text-center' id='see-teams'>
        {playersNotEmpty && 
          <button
            onClick={copyToClipboard}
            className='bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 cursor-pointer'
          >
            Copiar
          </button>
        }

        {copyMessage.visible && ( <div className='flash-message'>Equipos copiados!</div> )}

        {user && playersNotEmpty && 
          <button
            onClick={saveMatch}
            className='bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 cursor-pointer'
          >
            Guardar partido
          </button>
        }
        {saveMessage.visible && ( <div className='flash-message'>Partido guardado!</div> )}
      </div>
    </div>
  )
}

export default Teams
