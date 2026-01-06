import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { useContext } from 'react'

import { handleGoogleLogin, handleGoogleError } from '@/utils/googleOAuth'
import { UserContext } from '@/context/userContext'

const Login = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)

  const onSuccess = async (credentialResponse) => {
    try {
      await handleGoogleLogin(credentialResponse, setUser)
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md'>
        <GoogleLogin
          theme='outline'
          size='large'
          shape='rectangular'
          onSuccess={onSuccess}
          onError={handleGoogleError}
        />
      </div>
    </div>
  )
}

export default Login
