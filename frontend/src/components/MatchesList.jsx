import { Trophy, Minus, X } from 'lucide-react'
import Match from './Match'
import Loader from './Loader'
import { config } from '../../constants'

const API_BASE_URL = config.apiUrl

const MatchesList = ({ matches, setMatches, loadingMatches }) => {
  const matchesStats = (matches) => {
    const stats = { Win: 0, 'Draw': 0, 'Lose': 0 }
    matches.forEach(m => {
      if (m.result) stats[m.result] = stats[m.result] + 1
    })
    return stats
  }
  
  const matchBackgroundColor = (result) => {
    switch (result) {
      case 'Win':
        return 'border-l-4 border-l-green-500'
      case 'Draw':
        return 'border-l-4 border-l-yellow-400'
      case 'Lose':
        return 'border-l-4 border-l-red-400'
      default:
        return 'bg-white'
    }
  }

  const resultButtonClasses = (type, currentResult) => {
    const isActive = currentResult === type

    const base = 'l-2 px-2 py-1 rounded-md transition flex items-center justify-center border cursor-pointer'

    const styles = {
      Win: isActive
        ? 'bg-green-500 border-green-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
      Draw: isActive
        ? 'bg-gray-500 border-gray-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
      Lose: isActive
        ? 'bg-red-500 border-red-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
    }

    return `${base} ${styles[type]}`
  }

  const updateMatchResult = async (matchId, result) => {
    const url = `${API_BASE_URL}/match/${matchId}`
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ result })
    }

    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Error updating match result')

      const data = await response.json()

      setMatches(prev => prev.map(m => m._id === matchId ? data.updatedMatch : m))
    } catch (err) {
      console.error(err)
    }
  }

  const deleteMatch = async (matchId) => {
    const url = `${API_BASE_URL}/match/${matchId}`
    const options = {
      method: 'DELETE',
    }

    let userChoice = confirm('¿Seguro que querés eliminar este partido?')
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
  
  const stats = matchesStats(matches)
  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Tus partidos</h2>
      {!loadingMatches && 
        <div className='flex gap-4 mb-4 text-sm'>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 text-green-800 border border-green-300'>
            G {stats['Win']}
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-300'>
            E {stats.Draw}
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 text-red-800 border border-red-300'>
            P {stats.Lose}
          </div>
        </div>
      }
      {/*
      <div className='mb-4 text-sm text-gray-700'>
        G: {stats.Win} — E: {stats.Draw} — P: {stats.Lose}
      </div>
      */}

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
            className={`flex flex-col gap-[15px] border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition ${matchBackgroundColor(match.result)}`}
            >
              <Match
                players={match.players}
                goals1={match.goals1}
                goals2={match.goals2}
              />
              <div className='flex justify-between'>
                <div className='flex justify-center items-center gap-[10px]'>
                  <button
                    className={resultButtonClasses('Win', match.result)}
                    onClick={() => updateMatchResult(match._id, 'Win')}
                  >
                    <Trophy />
                  </button>

                  <button
                    className={resultButtonClasses('Draw', match.result)}
                    onClick={() => updateMatchResult(match._id, 'Draw')}
                  >
                    <Minus />
                  </button>

                  <button
                    className={resultButtonClasses('Lose', match.result)}
                    onClick={() => updateMatchResult(match._id, 'Lose')}
                  >
                    <X />
                  </button>
                </div>

                <div>
                  <button
                    className='cursor-pointer bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-fit'
                    onClick={() => deleteMatch(match._id)}
                    tabIndex='-1'
                    >
                      Borrar partido
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MatchesList
