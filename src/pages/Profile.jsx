import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import Nav from '../components/Nav'

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

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

      <main className='flex flex-col items-center justify-center flex-1 p-6'>
        <div className='bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center'>
          <h1 className='text-2xl font-bold mb-2'>{user.name}</h1>
          <p className='text-gray-600 mb-6'>{user.email}</p>

          <div className='space-y-3'>
            <button
              className='block w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-bold hover:bg-gray-400 transition'
              onClick={() => {
                localStorage.removeItem('token')
                navigate('/')
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
