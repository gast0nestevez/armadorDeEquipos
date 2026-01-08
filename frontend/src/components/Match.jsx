import { useState } from 'react'
import { Trophy, Minus, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

import Env from '@/utils/env'
import Loader from '@/components/Loader'
import { capitalize } from '@/utils/capitalize'

const API_BASE_URL = Env.getString('VITE_API_BASE_PATH')

const Match = ({ match, setMatches }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [goals1, setGoals1] = useState(match.goals1 ?? 0)
  const [goals2, setGoals2] = useState(match.goals2 ?? 0)
  const [result, setResult] = useState(match.result ?? '')
  const [date, setDate] = useState(match.date ?? '')
  const [loading, setLoading] = useState(false)

  const resultButtonClasses = (type, currentResult) => {
    const isActive = currentResult === type

    const base = 'flex justify-center items-center l-2 px-2 py-1 rounded-md transition border cursor-pointer'

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

  const formatDate = (isoDate) => {
    if (!isoDate) return ''
    const [year, month, day] = isoDate.split('-')
    return `${day}/${month}/${year}`
  }

  const expandMatch = (e) => {
    // Avoid buttons and inputs
    if (['DIV', 'H3', 'SPAN', 'UL', 'LI'].includes(e.target.tagName)) {
      setShowDetails(!showDetails)
      setShowActions(false)
    }
  }

  const saveChanges = async () => {
    setLoading(true)
    const url = `${API_BASE_URL}/match/${match._id}`
    const body = {
      goals1,
      goals2,
      result,
      date
    }
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(body)
    }

    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Something went wrong during update')
      const { data: updatedMatch } = await response.json()

      setMatches(prevMatches => prevMatches.map(m => m._id === match._id ? updatedMatch : m))
      setShowActions(false)
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  const deleteMatch = async (matchId) => {
    let userChoice = confirm('¿Seguro que querés eliminar este partido?')
    if (!userChoice) return

    setLoading(true)
    const url = `${API_BASE_URL}/match/${matchId}`
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }

    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Something went wrong during fetch')
      
      setMatches(prevMatches => prevMatches.filter(m => m._id !== matchId))
      setLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  if (loading)
    return (
      <div className='flex justify-center items-center'>
        <Loader />
      </div>
    )

  return (
    <div
      className={`flex flex-col justify-center p-4 cursor-pointer ${showDetails ? 'gap-[15px]' : ''}`}
      onClick={(e) => expandMatch(e)}
    >
      {!showActions && (
        <div className='text-center text-gray-600 text-sm mb-2'>
          {match.date ? formatDate(match.date) : 'Sin fecha'}
        </div>
      )}
      {showActions && (
        <div className='flex justify-center items-center'>
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='bg-white shadow-sm border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 text-center'
          />
        </div>
      )}
      
      <div className='flex justify-between gap-1'>
        <div className='grow max-w-1/3'>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className='overflow-hidden'
              >
                <h3 className='font-semibold text-gray-800 mb-2 text-nowrap'>Equipo 1</h3>
                <ul className='space-y-1'>
                  {match.players
                    .filter((p) => p.team === 1)
                    .map((p) => (
                      <li key={p._id} className='text-gray-700 truncate'>
                        {capitalize(p.name)}
                      </li>
                    ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className='flex justify-center items-center font-semibold text-2xl text-nowrap'>
          {!showActions ? (
            <span>
              {match.goals1} - {match.goals2}
            </span>
          ) : (
            <div className='flex items-center gap-1'>
              <input
                type='number'
                value={goals1}
                onChange={(e) => setGoals1(Number(e.target.value))}
                className='w-8 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
              <span>-</span>
              <input
                type='number'
                value={goals2}
                onChange={(e) => setGoals2(Number(e.target.value))}
                className='w-8 text-center bg-white shadow-sm border border-gray-200 rounded-lg p-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
              />
            </div>
          )}
        </div>

        <div className='grow max-w-1/3'>
          <AnimatePresence>
            {showDetails && (
              <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className='overflow-hidden'
              >
                <h3 className='font-semibold text-gray-800 mb-2 text-right text-nowrap'>Equipo 2</h3>
                <ul className='space-y-1'>
                  {match.players
                    .filter((p) => p.team === 2)
                    .map((p) => (
                      <li key={p._id} className='text-gray-700 text-right truncate'>
                        {capitalize(p.name)}
                      </li>
                    ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className={`flex flex-1 flex-col sm:flex-row ${showActions ? 'justify-between' : 'justify-center'} items-center gap-3`}>
        {showActions && (
          <div className='flex justify-center items-center gap-[10px]'>
            <button className={resultButtonClasses('Win', result)} onClick={() => setResult('Win')}>
              <Trophy />
            </button>

            <button className={resultButtonClasses('Draw', result)} onClick={() => setResult('Draw')}>
              <Minus />
            </button>

            <button className={resultButtonClasses('Lose', result)} onClick={() => setResult('Lose')}>
              <X />
            </button>
          </div>
        )}

        {showDetails && (
          <button
            className='px-3 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow-sm border border-gray-200 text-gray-700 text-center transition cursor-pointer hover:shadow-md hover:bg-blue-600'
            onClick={showActions ? saveChanges : () => setShowActions(true)}
          >
            {showActions ? 'Listo' : 'Editar'}
          </button>
        )}

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
