import { Link } from 'react-router-dom'

const Nav = () => {
  return (
    <nav className='bg-white shadow-md'>
      <div className='flex justify-between items-center p-4 w-full'>
        <h2 className='text-xl font-bold'>
          <Link to='/'>Armador</Link>
        </h2>
        <ul className='flex gap-6'>
          <li>
            <Link to='#' className='hover:text-blue-100'>Guardá tus partidos!</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Nav
