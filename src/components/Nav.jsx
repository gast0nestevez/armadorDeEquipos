import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoogleLogin, googleLogout } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { Menu, X } from 'lucide-react'
import '../css/home.css'

const API_BASE_PATH = import.meta.env.VITE_API_BASE_PATH

const Nav = () => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const isLogged = localStorage.getItem('token')

  /* ooooor we could just validate it in the back
  // Each time a user opens the page we call the server to validate jwt
  // Otherwise any user could just create a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch (err) {
        console.error('Invalid token', err)
      }
    }
  }, [])*/
  
  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse.credential

    // Send token to backend
    const url = `${API_BASE_PATH}/auth`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: idToken })
    }
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Something went wrong during fetch')
      
      const result = await response.json()
      localStorage.setItem('token', result.token)
    } catch (err) {
      console.log(err)
      // y aca un error groso en el front
    }
    
    navigate('/')
  }

  const handleGoogleLogout = () => {
    googleLogout()
    localStorage.removeItem('token')
    setIsOpen(false)
    navigate('/')
  }

  return (
    <nav className='relative bg-white shadow-md'>
      <div className='flex justify-between items-center p-4 w-full'>
        <h2 className='text-xl font-bold'>
          <Link to='/'>Armador</Link>
        </h2>

        {/* menu button */}
        <button
          onClick={toggleMenu}
          className='md:hidden focus:outline-none'
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* desktop links */}
        {!isLogged &&
          <div className='max-md:hidden md:block'>
            <GoogleLogin
              theme='outline'
              size='large'
              shape='rectangular'
              onSuccess={handleGoogleLogin}
              onError={error => console.log(error)}
            >
            </GoogleLogin>
          </div>
        }
        {isLogged &&
          <ul className='hidden md:flex gap-6'>
            <li>
              <Link to='/perfil' className='hover:text-blue-100'>
                Perfil
              </Link>
            </li>
            <li>
              <button
                className='hover:text-blue-100 cursor-pointer'
                onClick={handleGoogleLogout}
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        }
      </div>

      {/* mobile links */}
      {isOpen && (
        <div
          className='md:hidden fixed left-0 right-0 top-[64px] bg-white border-t shadow-lg h-full bg-gray-900 z-50'
        >
          {!isLogged &&
            <div className='flex justify-center align-center'>
              <GoogleLogin
                theme='outline'
                size='large'
                shape='rectangular'
                onSuccess={handleGoogleLogin}
                onError={error => console.log(error)}
              >
              </GoogleLogin>
            </div>
          }
          {isLogged && 
            <ul className='flex flex-col px-4 divide-y divide-gray-400'>
              <li>
                <Link
                  to='/perfil'
                  className='block hover:text-blue-500 p-[5px] m-[5px] my-3 black-text font-bold text-center'
                  onClick={() => setIsOpen(false)}
                >
                  Perfil
                </Link>
              </li>
              <li>
                <a 
                  className='block hover:text-blue-500 p-[5px] m-[5px] my-3 black-text font-bold text-center'
                  onClick={handleGoogleLogout}
                >
                  Cerrar sesión
                </a>
              </li>
            </ul>
          }
        </div>
      )}
    </nav>
  )
}

export default Nav
