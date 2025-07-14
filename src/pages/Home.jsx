import { Link } from 'react-router-dom'
import Nav from '../components/Nav'
import '../css/home.css'

const Home = () => {
  return (
    <div className='flex flex-col min-h-screen bg-gray-100'>
      <Nav />
      
      <main className='flex flex-col justify-center items-center flex-1 text-center px-4 h-full'>
        <h1 className='text-5xl font-extrabold mb-4'>
          Armá tus equipos
        </h1>
        <p className='text-lg mb-10 max-w-md'>
          Puntuá a tus amigos y generá equipos balanceados en segundos.
        </p>

        <div className='w-full max-w-sm space-y-4'>
          <div className='text-xl font-semibold mb-2'>Modos</div>

          <ul className='modos space-y-3'>
            <li>
              <Link
                to='/armar'
                className='block bg-white rounded-xl shadow hover:bg-blue-100 px-6 py-3 text-center font-medium transition'
              >
                Por habilidad
              </Link>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Home
