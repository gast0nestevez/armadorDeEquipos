import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

import NavButtons from '@/components/NavButtons'

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className='relative bg-white shadow-md'>
      <div className='flex justify-between items-center p-4 w-full'>
        <h2 className='text-xl font-bold'>
          <Link to='/'>Armador</Link>
        </h2>

        {/* menu icon for mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='md:hidden focus:outline-none cursor-pointer'
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* desktop buttons */}
        <NavButtons
          setIsOpen={setIsOpen}
        />
      </div>

      {/* mobile menu */}
      {isOpen && (
        <NavButtons
          variant='mobile'
          setIsOpen={setIsOpen}
        />
      )}
    </nav>
  )
}

export default Nav
