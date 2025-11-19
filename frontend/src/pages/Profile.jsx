import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import Nav from '../components/Nav'
import Loader from '../components/Loader'
import { UserContext } from '../context/userContext'
import { config } from '../../constants'

const API_BASE_URL = config.apiUrl

const Profile = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [matches, setMatches] = useState([])
  const [loadingMatches, setLoadingMatches] = useState(false)

  const handleGoogleLogout = () => {
    googleLogout()
    localStorage.removeItem('token')
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    const fetchMatches = async () => {
      setLoadingMatches(true)
      const url = `${API_BASE_URL}/match/${user.userId}`
      console.log('url', url)
      try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Error fetching matches')
        const data = await response.json()
        setMatches(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoadingMatches(false)
      }
    }

    fetchMatches()
  }, [user])

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-gray-600 text-lg animate-pulse'>Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />

      <main className='flex flex-col items-center flex-1 w-full px-4 py-8 bg-gray-100'>
        <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>{user.name.split(' ')[0]}</h1>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Tus partidos</h2>
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

                    <div className='flex flex-col'>
                      <h3 className='font-semibold text-gray-800 mb-2'>Equipo 2</h3>
                      <ul className='space-y-1'>
                        {match.players
                          .filter((p) => p.team === 2)
                          .map((p) => (
                            <li key={p._id} className='text-gray-700'>
                              {p.name}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className='bg-gray-300 text-gray-800 py-2.5 px-6 rounded-lg font-bold hover:bg-gray-400 transition cursor-pointer'
          onClick={handleGoogleLogout}
        >
          Cerrar sesión
        </button>
      </main>
    </div>
  )
}

export default Profile
