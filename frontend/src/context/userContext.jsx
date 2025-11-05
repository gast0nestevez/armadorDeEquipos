import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Each time a user opens the page we call the server to validate jwt
  // Otherwise any user could just create a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        // validate in back
        setUser(decoded)
      } catch(err) {
        console.log(err)
        localStorage.removeItem('token')
      }
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
