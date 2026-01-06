import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Profile from '@/pages/Profile'
import MakeTeams from '@/pages/MakeTeams'

const pageVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.1 } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.1 } }
}

function PageWrapper({ children }) {
  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={pageVariants}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {children}
      <Analytics />
    </motion.div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<PageWrapper><Home /></PageWrapper>} />
        <Route path='login' element={<PageWrapper><Login /></PageWrapper>} />
        <Route path='/armar' element={<PageWrapper><MakeTeams /></PageWrapper>} />
        <Route path='/perfil' element={<PageWrapper><Profile /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  )
}

export default App
