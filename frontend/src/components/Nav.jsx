import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { Menu, X } from 'lucide-react'
import { config } from '../../constants'
import { UserContext } from '../context/userContext'
import AuthButtons from './AuthButtons'
import MobileAuthMenu from './MobileAuthMenu'
import '../css/home.css'

const API_BASE_URL = config.apiUrl

const Nav = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessageVisible, setErrorMessageVisible] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleGoogleLogin = async (credentialResponse) => {
    const idToken = credentialResponse.credential

    // Send token to backend
    const url = `${API_BASE_URL}/auth`
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

      const decoded = jwtDecode(result.token)
      setUser(decoded)
    } catch (err) {
      console.error('Error in backend: ', err)
    }
    
    setIsOpen(false)
    navigate('/')
  }

  const handleGoogleError = (err) => {
    console.error(err)
  }

  const handleGoogleLogout = () => {
    googleLogout()
    localStorage.removeItem('token')
    setIsOpen(false)
    setUser(null)
    navigate('/')
  }

  return (
    <nav className='relative bg-white shadow-md'>
      <div className='flex justify-between items-center p-4 w-full'>
        <h2 className='text-xl font-bold'>
          <Link to='/'>Armador</Link>
        </h2>

        {/* menu icon for mobile */}
        <button onClick={toggleMenu} className='md:hidden focus:outline-none'>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* desktop buttons */}
        <AuthButtons
          user={user}
          onLogin={handleGoogleLogin}
          onLogout={handleGoogleLogout}
          onError={handleGoogleError}
        />
      </div>

      {/* mobile menu */}
      {isOpen && (
        <MobileAuthMenu
          user={user}
          onLogin={handleGoogleLogin}
          onLogout={handleGoogleLogout}
          onError={handleGoogleError}
          setIsOpen={setIsOpen}
          errorMessageVisible={errorMessageVisible}
        />
      )}
    </nav>
  )
}

export default Nav
