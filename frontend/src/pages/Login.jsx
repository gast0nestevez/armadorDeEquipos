import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'

import Nav from '@/components/Nav'
import Loader from '@/components/Loader'
import Footer from '@/components/Footer'
import { UserContext } from '@/context/userContext'
import {
  handleEmailLogin,
  handleEmailRegister,
  handleGoogleLogin,
  handleGoogleError
} from '@/utils/auth'

const Auth = () => {
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)

  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [generalError, setGeneralError] = useState('')

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))

    // Clean error field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    setGeneralError('')
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.email.trim()) {
      newErrors.email = 'El correo es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Por favor ingresá un correo válido'
    }

    if (!form.password.trim()) {
      newErrors.password = 'La contraseña es requerida'
    } else if (form.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (mode === 'register') {
      if (!form.confirmPassword.trim()) {
        newErrors.confirmPassword = 'Debe confirmar la contraseña'
      } else if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = 'Las contraseñas no coinciden'
      }
    }

    return newErrors
  }

  const onSuccessGoogle = async (credentialResponse) => {
    setIsLoading(true)
    setGeneralError('')

    try {
      await handleGoogleLogin(credentialResponse, setUser)
      navigate('/')
    } catch (error) {
      console.error(error)
      setGeneralError('Error al iniciar sesión con Google. Intenta nuevamente.')
    }
    
    setIsLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      mode === 'login'
      ? await handleEmailLogin(form.email, form.password, setUser)
      : await handleEmailRegister(form.email, form.password, setUser)

    } catch (e) {
      console.error(e)
      const errorMessage = e.message || 'Ocurrió un error. Intenta nuevamente.'
      setGeneralError(errorMessage)
      return
    } finally {
      setIsLoading(false)
    }
    
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader />
      </div>
    )
  }

  return (
    <div className='flex flex-col bg-gray-100 min-h-screen'>
      <Nav />

      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-8 rounded-lg shadow-md w-80'>
          <h1 className='text-xl font-semibold mb-4 text-center'>
            {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>

          {generalError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-3'>
            <div>
              <input
                type='email' 
                name='email'
                placeholder='Mail'
                value={form.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                />
              {errors.email && (
                <p className='text-red-600 text-xs mt-1'>{errors.email}</p>
              )}
            </div>

            <div>
              <input
                type='password'
                name='password'
                placeholder='Contraseña'
                value={form.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                />
              {errors.password && (
                <p className='text-red-600 text-xs mt-1'>{errors.password}</p>
              )}
            </div>

            {mode === 'register' && (
              <div>
                <input
                  type='password'
                  name='confirmPassword'
                  placeholder='Repetir contraseña'
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded ${
                    errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  />
                {errors.confirmPassword && (
                  <p className='text-red-600 text-xs mt-1'>{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type='submit'
              className='w-full bg-black text-white py-2 rounded hover:opacity-90 cursor-pointer'
              >
              {mode === 'login' ? 'Entrar' : 'Registrarse'}
            </button>
          </form>

          <div className='my-4 text-center text-sm text-gray-500'>
            o continuar con
          </div>

          <div className='flex justify-center'>
            <GoogleLogin
              theme='outline'
              size='large'
              shape='rectangular'
              onSuccess={onSuccessGoogle}
              onError={handleGoogleError}
              />
          </div>

          <button
            className='mt-4 text-sm text-center w-full text-gray-600 hover:underline cursor-pointer'
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login')
              setErrors({})
              setGeneralError('')
            }}
            >
            {mode === 'login'
              ? 'No tenés cuenta? Registrate'
              : 'Ya tenés cuenta? Iniciá sesión'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Auth
