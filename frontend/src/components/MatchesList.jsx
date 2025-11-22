import Match from './Match'
import Loader from './Loader'

const MatchesList = ({ matches, setMatches, loadingMatches }) => {
  const matchesStats = (matches) => {
    const stats = { Win: 0, 'Draw': 0, 'Lose': 0 }
    matches.forEach(m => {
      if (m.result) stats[m.result] = stats[m.result] + 1
    })
    return stats
  }
  
  const matchBorderColor = (result) => {
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
  
  const stats = matchesStats(matches)
  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Tus partidos</h2>
      {!loadingMatches && 
        <div className='flex gap-4 mb-4 text-sm'>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 text-green-800 border border-green-300'>
            G {stats['Win']}
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-100 text-yellow-800 border border-gray-300'>
            E {stats.Draw}
          </div>
          <div className='flex items-center gap-2 px-3 py-1 rounded-md bg-red-100 text-red-800 border border-red-300'>
            P {stats.Lose}
          </div>
        </div>
      }

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
            className={`flex flex-col gap-[15px] border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition ${matchBorderColor(match.result)}`}
            >
              <Match
                match={match}
                setMatches={setMatches}
              />
              
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MatchesList
