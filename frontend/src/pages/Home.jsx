import { Link } from 'react-router-dom'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

import '@/css/home.css'

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Nav />
      
      <main className='flex flex-col justify-center items-center flex-1 text-center px-4 h-full'>
        <h1 className='text-5xl font-extrabold mb-4'>
          Generador de equipos de fútbol
        </h1>
        <h2 className='text-xl font-semibold mb-6'>
          Armá partidos balanceados de forma simple y rápida
        </h2>
        <p className='text-lg mb-10 max-w-md'>
          Puntuá a tus amigos por habilidad y dejá que el sistema forme equipos equilibrados en segundos. <br />
          Registrate para guardar tus partidos y acceder a estadísticas.
        </p>

        <div className='w-full max-w-sm space-y-4'>
          <ul className='modos space-y-3'>
            <li>
              <Link
                to='/armar'
                className='block bg-white rounded-xl shadow hover:bg-blue-100 px-6 py-3 font-extrabold text-center font-medium transition'
              >
                Armar
              </Link>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Home
