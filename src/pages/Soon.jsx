import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import '../css/home.css'

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Nav />
      
      <main className='flex flex-col justify-center items-center flex-1 text-3xl text-center px-4 h-full'>
        Próximamente
      </main>
    </div>
  )
}

export default Home
