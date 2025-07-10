import { Link } from "react-router-dom"
import Nav from '../components/Nav'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
      <Nav />
      
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 h-full">
        <h1 className="text-5xl font-extrabold mb-4">
          Armá tus equipos
        </h1>
        <p className="text-lg text-gray-700 mb-10 max-w-md">
          Puntuá a tus amigos y generá equipos balanceados en segundos.
        </p>

        <div className="w-full max-w-sm space-y-4">
          <div className="text-xl font-semibold text-gray-800 mb-2">Modos</div>

          <ul className="modos space-y-3">
            <li>
              <Link
                to="/clasico"
                className="block bg-white rounded-xl shadow hover:bg-blue-100 px-6 py-3 text-center font-medium transition"
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
