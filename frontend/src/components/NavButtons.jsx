import { useContext } from 'react'
import { Link } from 'react-router-dom'

import { UserContext } from '@/context/userContext'

const NavButtons = ({ setIsOpen, variant='desktop' }) => {
  const { user } = useContext(UserContext)

  const isMobile = variant === 'mobile'

  const containerClass = isMobile
    ? 'd:hidden fixed left-0 right-0 top-[64px] bg-white border-t shadow-lg h-full z-50'
    : 'hidden md:flex items-center gap-6'

  const ulClass = isMobile
    ? 'flex flex-col px-4 divide-y divide-gray-400 bg-gray-200 active:bg-gray-300'
    : 'flex gap-6'

  const linkClass = isMobile
    ? 'block py-3 font-bold text-center black-text'
    : 'hover:text-blue-100'
  
  return (
    <div className={containerClass}>
      <ul className={ulClass}>
        {!user ? (
          <li>
            <Link
              to='/login'
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              Ingresar
            </Link>
          </li>
        ) : (
          <li>
            <Link
              to='/perfil'
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              Mis Partidos
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default NavButtons
