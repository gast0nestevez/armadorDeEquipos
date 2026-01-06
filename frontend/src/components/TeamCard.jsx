import Loader from '@/components/Loader'
import { capitalize } from '@/utils/capitalize'

const TeamCard = ({ index, players, loading }) => (
  <div className='flex flex-col bg-white shadow-md rounded-xl p-6 w-48 text-center'>
    <h3 className='text-xl font-bold mb-2'>Equipo {index + 1}</h3>

    {loading ? (
      <div>
        <Loader />
      </div>
    ) : (
      <ul className='py-1 max-h-full overflow-y-auto'>
        {players.length > 0 ? (
          players
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((player, i) => (
              <li key={i} className='py-1 truncate'>
                {capitalize(player.name)}
              </li>
            ))
        ) : (
          <li>Sin jugadores</li>
        )}
      </ul>
    )}
  </div>
)

export default TeamCard
