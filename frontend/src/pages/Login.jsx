import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import Loader from '@/components/Loader'
import { UserContext } from '@/context/userContext'
import { handleGoogleLogin, handleGoogleError } from '@/utils/googleOAuth'

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const { setUser } = useContext(UserContext)

  const onSuccess = async (credentialResponse) => {
    setIsLoading(true)

    try {
      await handleGoogleLogin(credentialResponse, setUser)
      navigate('/')
    } catch (error) {
      console.error(error)
    }

    setIsLoading(false)
  }

  if (isLoading) return (
    <div className='flex justify-center items-center min-h-screen'>
      <Loader />
    </div>
  )

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
