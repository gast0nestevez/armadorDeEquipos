const Match = ({ players }) => (
  <div className='flex justify-between'>
    <div>
      <h3 className='font-semibold text-gray-800 mb-2'>Equipo 1</h3>
      <ul className='space-y-1'>
        {players
          .filter((p) => p.team === 1)
          .map((p) => (
            <li key={p._id} className='text-gray-700'>
              {p.name}
            </li>
          ))}
      </ul>
    </div>

    <div className='flex flex-col'>
      <h3 className='font-semibold text-gray-800 mb-2'>Equipo 2</h3>
      <ul className='space-y-1'>
        {players
          .filter((p) => p.team === 2)
          .map((p) => (
            <li key={p._id} className='text-gray-700'>
              {p.name}
            </li>
          ))}
      </ul>
    </div>
  </div>
)

export default Match
