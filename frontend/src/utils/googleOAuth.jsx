import { googleLogout } from '@react-oauth/google'

import Env from '@/utils/env'

const API_BASE_URL = Env.getString('VITE_API_BASE_PATH')

export const handleGoogleLogin = async (credentialResponse, setUser) => {
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
}

export const handleGoogleError = (err) => {
  console.error('Google error: ', err)
}

export const handleGoogleLogout = (clearContext) => {
  googleLogout()
  clearContext()
}
