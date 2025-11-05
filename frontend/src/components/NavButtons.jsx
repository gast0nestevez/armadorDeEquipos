import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const NavButtons = ({ user, onLogin, onError, variant='desktop', setIsOpen }) => {
  const isMobile = variant === 'mobile'

  const containerClass = isMobile
    ? 'd:hidden fixed left-0 right-0 top-[64px] bg-white border-t shadow-lg h-full z-50'
    : 'hidden md:flex items-center gap-6'

  const ulClass = isMobile
    ? 'flex flex-col px-4 divide-y divide-gray-400'
    : 'flex gap-6'

  const linkClass = isMobile
    ? 'block py-3 font-bold text-center black-text'
    : 'hover:text-blue-100'
  
  return (
    <div className={containerClass}>
      {!user ? (
        <div className='flex justify-center items-center'>
          <GoogleLogin
            theme='outline'
            size='large'
            shape='rectangular'
            onSuccess={onLogin}
            onError={onError}
          />
        </div>
      ) : (
        <ul className={ulClass}>
          <li>
            <Link
              to='/perfil'
              className={linkClass}
              onClick={() => setIsOpen(false)}
            >
              Mis Partidos
            </Link>
          </li>
        </ul>
      )}
    </div>
  )
}

export default NavButtons
