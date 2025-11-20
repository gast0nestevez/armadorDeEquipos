import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { config } from '../../constants'
import { UserContext } from '../context/userContext'
import NavButtons from './NavButtons'
import '../css/home.css'

const API_BASE_URL = config.apiUrl

const Nav = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleGoogleLogin = async (credentialResponse) => {
    const googleToken = credentialResponse.credential

    const url = `${API_BASE_URL}/auth`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ googleToken })
    }

    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error('Something went wrong during fetch')
      
      const data = await response.json()
      localStorage.setItem('token', data.token)
      setUser(data.user)
    } catch (e) {
      console.error('Error while login: ', e)
    }
    
    setIsOpen(false)
    navigate('/')
  }

  const handleGoogleError = (err) => {
    console.error('Google error: ', err)
  }

  return (
    <nav className='relative bg-white shadow-md'>
      <div className='flex justify-between items-center p-4 w-full'>
        <h2 className='text-xl font-bold'>
          <Link to='/'>Armador</Link>
        </h2>

        {/* menu icon for mobile */}
        <button onClick={toggleMenu} className='md:hidden focus:outline-none cursor-pointer'>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* desktop buttons */}
        <NavButtons
          user={user}
          onLogin={handleGoogleLogin}
          onError={handleGoogleError}
          setIsOpen={setIsOpen}
        />
      </div>

      {/* mobile menu */}
      {isOpen && (
        <NavButtons
          user={user}
          onLogin={handleGoogleLogin}
          onError={handleGoogleError}
          variant='mobile'
          setIsOpen={setIsOpen}
        />
      )}
    </nav>
  )
}

export default Nav
