import { useState } from 'react'
import { Trophy, Minus, X } from 'lucide-react'
import { config } from '../../constants'

const API_BASE_URL = config.apiUrl

const Match = ({ match, setMatches }) => {
  const [showActions, setShowActions] = useState(false)
  const [goals1, setGoals1] = useState(match.goals1)
  const [goals2, setGoals2] = useState(match.goals2)
  const [result, setResult] = useState(match.result)

  const resultButtonClasses = (type, currentResult) => {
    const isActive = currentResult === type

    const base = 'l-2 px-2 py-1 rounded-md transition flex items-center justify-center border cursor-pointer'

    const styles = {
      Win: isActive
        ? 'bg-green-500 border-green-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
      Draw: isActive
        ? 'bg-yellow-500 border-yellow-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
      Lose: isActive
        ? 'bg-red-500 border-red-600 text-white'
        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-100',
    }

    return `${base} ${styles[type]}`
  }

  const saveChanges = async () => {
    const url = `${API_BASE_URL}/match/${match._id}`
    const body = {
      goals1,
      goals2,
      result
    }
    const options = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }


    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Error actualizando partido')
      const data = await response.json()

      setMatches(prev => prev.map(m => m._id === match._id ? data.updatedMatch : m))
      setShowActions(false)
    } catch (err) {
      console.error(err)
    }
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

  return (
    <div className='flex flex-col gap-[15px]'>
      <div className='flex justify-between'>
        <div>
          <h3 className='font-semibold text-gray-800 mb-2'>Equipo 1</h3>
          <ul className='space-y-1'>
            {match.players
              .filter((p) => p.team === 1)
              .map((p) => (
                <li key={p._id} className='text-gray-700'>
                  {p.name}
                </li>
              ))}
          </ul>
        </div>

        <div className='flex justify-center items-center font-semibold text-2xl'>
          {!showActions ?
            <span>{ match.goals1 } - { match.goals2 }</span>
          : (
            <div className='flex items-center gap-3'>
              <input
                type='number'
                value={goals1}
                onChange={(e) => setGoals1(Number(e.target.value))}
                className='w-14 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <span>-</span>
              <input
                type='number'
                value={goals2}
                onChange={(e) => setGoals2(Number(e.target.value))}
                className='w-14 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
          )}
        </div>

        <div className='flex flex-col'>
          <h3 className='font-semibold text-gray-800 mb-2 text-right'>Equipo 2</h3>
          <ul className='space-y-1'>
            {match.players
              .filter((p) => p.team === 2)
              .map((p) => (
                <li key={p._id} className='text-gray-700 text-right'>
                  {p.name}
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className={`flex ${showActions ? 'justify-between' : 'justify-center'} items-center`}>
        {showActions && (
          <div className='flex justify-center items-center gap-[10px]'>
            <button
              className={resultButtonClasses('Win', result)}
              onClick={() => setResult('Win')}
            >
              <Trophy />
            </button>

            <button
              className={resultButtonClasses('Draw', result)}
              onClick={() => setResult('Draw')}
            >
              <Minus />
            </button>

            <button
              className={resultButtonClasses('Lose', result)}
              onClick={() => setResult('Lose')}
            >
              <X />
            </button>
          </div>
        )}

        <button
          className='px-3 py-1 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700 transition cursor-pointer hover:shadow-md hover:bg-gray-50'
          onClick={showActions ? saveChanges : () => setShowActions(true)}
        >
          {showActions ? 'Listo' : 'Editar'}
        </button>

        {showActions && (
          <div>
            <button
              className='cursor-pointer bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-fit'
              onClick={() => deleteMatch(match._id)}
              tabIndex='-1'
              >
                Borrar partido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Match
