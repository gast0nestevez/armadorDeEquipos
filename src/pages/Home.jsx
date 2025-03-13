import { BrowserRouter, Routes, Route } from 'react-router-dom'
import '../css/classic.css'
import Layout from './Layout'
import ClassicMode from './ClassicMode'

function Home() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} />
        <Route path='/clasico' element={<ClassicMode />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Home
