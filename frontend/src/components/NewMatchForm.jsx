import { useState } from 'react'
import { Trophy, Minus, X } from 'lucide-react'
import { config } from '../../constants'

const API_BASE_URL = config.apiUrl

const Match = ({ setMatches, formSubmited }) => {
  const [playerCount, setPlayerCount] = useState(10)
  const [players, setPlayers] = useState([])
  const [goals1, setGoals1] = useState(null)
  const [goals2, setGoals2] = useState(null)
  const [result, setResult] = useState(null)

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

  const handleChange = (index, name, team) => {
    const newPlayers = [...players]
    newPlayers[index] = { name, team }
    setPlayers(newPlayers)
  }

  const addMatch = async () => {
    players
      .filter(player => player && player.name && player.name.trim() !== '')
      .map(player => ({ name: player.name, team: player.team }))

    const url = `${API_BASE_URL}/match`
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        players,
        goals1,
        goals2,
        result
      })
    }
    
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Error while saving match')
      
      const data = await response.json()
      setMatches(prev => [data, ...prev])
      
      // Clean form states
      setPlayers([])
      setGoals1(null)
      setGoals2(null)
      setResult(null)
      formSubmited()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className='flex flex-col justify-center p-4 max-w-4xl mx-auto'>
      <div className='flex flex-col items-center gap-2 py-2'>
        <label className='font-semibold text-gray-800'>Cantidad de jugadores</label>
        <select
          className='w-16 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
          value={playerCount}
          onChange={(e) => setPlayerCount(Number(e.target.value))}
        >
          {[...Array(15)].map((_, i) => (
            <option key={i} value={2*i + 2}>
              {2*i + 2}
            </option>
          ))}
        </select>
      </div>

      <div className='flex flex-col md:flex-row justify-between gap-4 md:gap-6'>
        <div className='flex-1'>
          <h3 className='font-semibold mb-3 text-gray-800 text-center md:text-left'>Equipo 1</h3>
          <ul className='space-y-2'>
            {[...Array(playerCount/2)].map((_, index) => (
              <input
                type='text'
                key={index}
                placeholder='Nombre'
                maxLength='25'
                className='w-full text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                onChange={(e) => handleChange(index, e.target.value, 1)}
              />
            ))}
          </ul>
        </div>

        <div className='flex md:flex-col justify-center items-center gap-3 md:gap-4 py-4 md:py-0'>
          <div className='flex items-center gap-2 text-3xl'>
            <input
              type='number'
              min='0'
              value={goals1}
              className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              onChange={(e) => setGoals1(e.target.value)}
            />
            <span className='font-bold text-gray-600'>-</span>
            <input
              type='number'
              min='0'
              value={goals2}
              className='w-12 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              onChange={(e) => setGoals2(e.target.value)}
            />
          </div>
        </div>

        <div className='flex-1'>
          <h3 className='font-semibold mb-3 text-gray-800 text-center md:text-right'>Equipo 2</h3>
          <ul className='space-y-2'>
            {[...Array(playerCount/2)].map((_, index) => (
              <input
                type='text'
                key={index}
                placeholder='Nombre'
                maxLength='25'
                className='w-full text-center bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                onChange={(e) => handleChange(index+playerCount/2, e.target.value, 2)}
              />
            ))}
          </ul>
        </div>
      </div>

      <div className='flex flex-col justify-center items-center gap-4 mt-4'>
        <div className='flex justify-center items-center gap-3'>
          <button
            className={resultButtonClasses('Win', result)}
            onClick={() => setResult('Win')}
          >
            <Trophy size={24} />
          </button>

          <button
            className={resultButtonClasses('Draw', result)}
            onClick={() => setResult('Draw')}
          >
            <Minus size={24} />
          </button>

          <button
            className={resultButtonClasses('Lose', result)}
            onClick={() => setResult('Lose')}
          >
            <X size={24} />
          </button>
        </div>

        <button
          className='w-full md:w-auto px-6 py-3 rounded-lg bg-blue-500 text-white font-semibold transition cursor-pointer hover:bg-blue-600'
          onClick={() => addMatch()}
        >
          Listo
        </button>
      </div>
    </div>
  )
}

export default Match
