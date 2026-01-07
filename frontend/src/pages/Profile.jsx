import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Env from '@/utils/env'
import { UserContext } from '@/context/userContext'
import { handleGoogleLogout } from '@/utils/auth'
import Nav from '@/components/Nav'
import MatchesList from '@/components/MatchesList'

const API_BASE_URL = Env.getString('VITE_API_BASE_PATH')

const Profile = () => {
  const navigate = useNavigate()
  const { user, clearContext } = useContext(UserContext)
  const [matches, setMatches] = useState([])
  const [loadingMatches, setLoadingMatches] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }

    const fetchMatches = async () => {
      setLoadingMatches(true)
      const url = `${API_BASE_URL}/match`
      const options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
      
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error('Error fetching matches')
        const data = await response.json()
        setMatches(data)
        setLoadingMatches(false)
      } catch (e) {
        console.error(e)
      }
    }

    fetchMatches()
  }, [user, navigate])

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-gray-600 text-lg animate-pulse'>Cargando perfilsrc.</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />

      <main className='flex flex-col items-center flex-1 w-full px-4 py-8 bg-gray-100'>
        <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mb-8'>
          <MatchesList
            matches={matches}
            setMatches={setMatches}
            loadingMatches={loadingMatches}
          />
        </div>

        <button
          className='bg-gray-300 text-gray-800 py-2.5 px-6 rounded-lg font-bold hover:bg-gray-400 transition cursor-pointer'
          onClick={() => handleGoogleLogout(clearContext)}
        >
          Cerrar sesión
        </button>
      </main>
    </div>
  )
}

export default Profile
