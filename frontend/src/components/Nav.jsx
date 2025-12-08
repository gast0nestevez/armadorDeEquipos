import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import NavButtons from '@/components/NavButtons'
import { UserContext } from '@/context/userContext'
import { handleGoogleLogin, handleGoogleError } from '@/utils/googleOAuth'

const Nav = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='relative bg-white shadow-md'>
      <div className='flex justify-between items-center p-4 w-full'>
        <h2 className='text-xl font-bold'>
          <Link to='/'>Armador</Link>
        </h2>

        {/* menu icon for mobile */}
        <button
          onClick={toggleMenu}
          className='md:hidden focus:outline-none cursor-pointer'
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* desktop buttons */}
        <NavButtons
          user={user}
          onLogin={(credentialResponse) =>
            handleGoogleLogin(
              credentialResponse,
              setUser,
              setIsOpen,
              navigate
            )}
          onError={handleGoogleError}
          setIsOpen={setIsOpen}
        />
      </div>

      {/* mobile menu */}
      {isOpen && (
        <NavButtons
          user={user}
          onLogin={(credentialResponse) =>
            handleGoogleLogin(
              credentialResponse,
              setUser,
              setIsOpen,
              navigate
            )}
          onError={handleGoogleError}
          variant='mobile'
          setIsOpen={setIsOpen}
        />
      )}
    </nav>
  )
}

export default Nav
