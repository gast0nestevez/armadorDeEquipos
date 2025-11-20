const Match = ({ players, goals1, goals2 }) => (
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

    <div className='flex justify-center items-center font-semibold text-2xl'>
      <span>{ goals1 } - { goals2 }</span>
    </div>

    <div className='flex flex-col'>
      <h3 className='font-semibold text-gray-800 mb-2 text-right'>Equipo 2</h3>
      <ul className='space-y-1'>
        {players
          .filter((p) => p.team === 2)
          .map((p) => (
            <li key={p._id} className='text-gray-700 text-right'>
              {p.name}
            </li>
          ))}
      </ul>
    </div>
  </div>
)

export default Match
