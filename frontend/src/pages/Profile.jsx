import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Nav from '../components/Nav'
import Loader from '../components/Loader'
import { UserContext } from '../context/userContext'

const Profile = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [loadingMatches, setLoadingMatches] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/')
      return
    }
  }, [])

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

      <main className='flex flex-col items-center flex-1 w-full px-4 py-8'>
        <div className='bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl text-center mb-8'>
          <h1 className='text-3xl font-bold mb-2'>{user.name.split(' ')[0]}</h1>
        </div>

        <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl mb-8'>
          <h2 className='text-xl font-semibold mb-4'>Tus partidos</h2>
          {loadingMatches ? (
            <div className='flex justify-center items-center'>
              <Loader />
            </div>
          ) : (
            <p className='text-gray-600'>Partidos</p>
          )}
        </div>

        <button
          className='bg-gray-300 text-gray-800 py-2.5 px-6 rounded-lg font-bold hover:bg-gray-400 transition cursor-pointer'
          onClick={() => {
            localStorage.removeItem('token')
            setUser(null)
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
