import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const MobileAuthMenu = ({ user, onLogin, onLogout, onError, setIsOpen }) => {
  return (
    <div className='md:hidden fixed left-0 right-0 top-[64px] bg-white border-t shadow-lg h-full bg-gray-900 z-50'>
      {!user ? (
        <div className='flex justify-center items-center mt-6 google-login-wrapper'>
          <GoogleLogin
            theme='outline'
            size='large'
            shape='rectangular'
            onSuccess={onLogin}
            onError={onError}
          />
        </div>
      ) : (
        <ul className='flex flex-col px-4 divide-y divide-gray-400'>
          <li>
            <Link
              to='/perfil'
              className='block hover:text-blue-500 py-3 font-bold text-center black-text'
              onClick={() => setIsOpen(false)}
            >
              Perfil
            </Link>
          </li>
          <li>
            <button
              className='block hover:text-blue-500 py-3 font-bold text-center w-full black-text'
              onClick={onLogout}
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

export default MobileAuthMenu
