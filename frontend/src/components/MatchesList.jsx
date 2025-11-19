import Match from './Match'
import Loader from './Loader'

const MatchesList = ({ matches, loadingMatches }) => (
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
          className='border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition'
          >
            <Match players={match.players} />
          </li>
        ))}
      </ul>
    )}
  </div>
)

export default MatchesList
