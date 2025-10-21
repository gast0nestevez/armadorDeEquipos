import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import '../css/home.css'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <nav className='relative bg-white shadow-md'>
      <div className='flex justify-between items-center p-4 w-full'>
        <h2 className='text-xl font-bold'>
          <Link to='/'>Armador</Link>
        </h2>

        {/* menu button */}
        <button
          onClick={toggleMenu}
          className='md:hidden focus:outline-none'
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* desktop links */}
        <ul className='hidden md:flex gap-6'>
          <li>
            <Link to='#' className='hover:text-blue-100'>
              Guardá tus partidos
            </Link>
          </li>
        </ul>
      </div>

      {/* mobile links */}
      {isOpen && (
        <div
          className="md:hidden fixed left-0 right-0 top-[64px] bg-white border-t shadow-lg h-full bg-gray-900 z-50"
        >
          <ul className="flex flex-col px-4 divide-y divide-gray-400">
            <li>
              <Link
                to="/perfil"
                className="block hover:text-blue-500 p-[5px] m-[5px] my-3 black-text font-bold text-center"
                onClick={() => setIsOpen(false)}
              >
                Guardá tus partidos
              </Link>
            </li>
            <li>
              <Link
                to="/perfil"
                className="block hover:text-blue-500 p-[5px] m-[5px] my-3 black-text font-bold text-center"
                onClick={() => setIsOpen(false)}
              >
                ...
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Nav
