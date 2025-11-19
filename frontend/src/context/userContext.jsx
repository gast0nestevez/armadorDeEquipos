import { createContext, useState, useEffect } from 'react'
import { config } from '../../constants'

export const UserContext = createContext()

const API_BASE_URL = config.apiUrl

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token')
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
        if (!response.ok) {
          localStorage.removeItem('token')
          setUser(null)
        }
        
        const data = await response.json()
        setUser(data.user)
      } catch (err) {
        console.error(err)
        localStorage.removeItem('token')
        setUser(null)
      }
    }

    validate()
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
