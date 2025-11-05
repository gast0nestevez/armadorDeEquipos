import { Link } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

const AuthButtons = ({ user, onLogin, onLogout, onError }) => {
  return (
    <div className='hidden md:flex items-center gap-6'>
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
        <ul className='hidden md:flex gap-6'>
          <li>
            <Link
              to='/perfil'
              className='hover:text-blue-100'
            >
              Perfil
            </Link>
          </li>
          <li>
            <button
              className='hover:text-blue-100 cursor-pointer'
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

export default AuthButtons
