import { Trash2 } from 'lucide-react'
import Match from './Match'
import Loader from './Loader'
import { config } from '../../constants'

const API_BASE_URL = config.apiUrl

const MatchesList = ({ matches, setMatches, loadingMatches }) => {
  const deleteMatch = async (matchId) => {
    const url = `${API_BASE_URL}/match/${matchId}`
    const options = {
      method: 'DELETE',
    }

    let userChoice = confirm("¿Seguro que querés eliminar este partido?")
    if (userChoice) {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error('Something went wrong during fetch')
          
        setMatches(prevMatches => prevMatches.filter(m => m._id !== matchId))
      } catch (err) {
        console.error(err)
      }
    }
  }
  
  return (
    <div>
      {loadingMatches ? (
        <div className='flex justify-center items-center'>
          <Loader />
        </div>
      ) : matches.length === 0 ? (
        <p className='text-gray-600'>Todavía no guardaste ningún partido</p>
      ) : (
        <ul className='space-y-4'>
          {matches.map((match) => (
            <li
            key={match._id}
            className='flex flex-col gap-[15px] border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition'
            >
              <Match players={match.players} />
              <button 
                className='cursor-pointer bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-fit'
                onClick={() => deleteMatch(match._id)}
                tabIndex='-1'
                >
                  Borrar partido
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MatchesList
