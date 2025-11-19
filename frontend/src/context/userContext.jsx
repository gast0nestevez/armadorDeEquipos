import { createContext, useState, useEffect } from 'react'
import { config } from '../../constants'

export const UserContext = createContext()

const API_BASE_URL = config.apiUrl

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.error('No token')
      setLoading(false)
      return
    }

    const validate = async () => {
      const url = `${API_BASE_URL}/auth/validate`
      const options = { 
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

      try {
        const response = await fetch(url, options)
        console.log('api response: ', response)

        if (!response.ok) {
          localStorage.removeItem('token')
          setUser(null)
        }
        
        const data = await response.json()
        setUser(data.user)
        console.log('User data: ', data)
      } catch (err) {
        console.error(err)
        localStorage.removeItem('token')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    validate()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  )
}
