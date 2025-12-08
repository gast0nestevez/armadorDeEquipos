import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserProvider } from '@/context/userContext'
import { Env } from '@/utils/env'
import App from '@/routes/App'

import '@/css/index.css'

const CLIENT_ID = Env.getString('VITE_CLIENT_ID')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <UserProvider>
        <App />
      </UserProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
