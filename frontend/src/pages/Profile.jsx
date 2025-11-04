import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Nav from '../components/Nav'
import Loader from '../components/Loader'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [matches, setMatches] = useState([])
  const [loadingMatches, setLoadingMatches] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }

    try {
      const decoded = jwtDecode(token)
      console.log(decoded)
      setUser(decoded)
    } catch (err) {
      console.error('Invalid token: ', err)
      localStorage.removeItem('token')
      navigate('/')
    }
  }, [navigate])

  if (!user) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <p className='text-gray-600 text-lg animate-pulse'>Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Nav />

      <main className='flex flex-col items-center flex-1 p-6 w-full max-w-3xl'>
        {/* Perfil del usuario */}
        <div className='bg-white rounded-xl shadow-lg p-8 w-full text-center mb-6'>
          <h1 className='text-2xl font-bold mb-2'>{user.name.split(' ')[0]}</h1>
        </div>

        {/* Tus partidos */}
        <div className='bg-white rounded-xl shadow-lg p-6 w-full'>
          <h2 className='text-xl font-semibold mb-4'>Tus partidos</h2>
          {loadingMatches ? (
            <p className='text-gray-600 animate-pulse'>Cargando partidos...</p>
          ) : matches.length === 0 ? (
            <p className='text-gray-600'>No has jugado ningún partido todavía.</p>
          ) : (
            <ul className='space-y-3'>
              {matches.map(match => (
                <li key={match.id} className='p-4 border rounded-lg flex justify-between items-center'>
                  <div>
                    <p className='font-bold'>{match.opponent}</p>
                    <p className='text-gray-500 text-sm'>{new Date(match.date).toLocaleDateString()}</p>
                  </div>
                  <div className='text-gray-700 font-semibold'>{match.result}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className='block w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition cursor-pointer'
          onClick={() => {
            localStorage.removeItem('token')
            navigate('/')
          }}
        >
          Cerrar sesión
        </button>
      </main>
    </div>
  )
}

export default Profile
