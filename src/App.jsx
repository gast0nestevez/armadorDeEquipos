import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './css/classic.css'
import Home from './pages/Home'
import ClassicMode from './pages/ClassicMode'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/clasico' element={<ClassicMode />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
