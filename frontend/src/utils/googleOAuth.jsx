import { googleLogout } from '@react-oauth/google'
import { config } from '../../constants'

const API_BASE_URL = config.apiUrl

export const handleGoogleLogin = async (credentialResponse, setUser, setIsOpen, navigate) => {
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
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)
    setUser(data.user)
  } catch (e) {
    console.error('Error while login: ', e)
  }
  
  setIsOpen(false)
  navigate('/')
}

export const handleGoogleError = (err) => {
  console.error('Google error: ', err)
}

export const handleGoogleLogout = (clearContext, navigate) => {
  googleLogout()
  clearContext()
  navigate('/')
}
