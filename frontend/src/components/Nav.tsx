import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { UserContext } from '#context/userContext.tsx';

const LINK_CLASS: string = 'transition-colors duration-200 ease-in-out hover:text-blue-100';

const Nav = () => {
  const { user } = useContext(UserContext);

  return (
    <nav aria-label='Principal' className='shadow-md'>
      <div className='flex w-full items-center justify-between p-4'>
        <Link to='/' className={`text-xl font-bold ${LINK_CLASS}`}>
          Armador
        </Link>
        <Link to={user ? '/perfil' : '/login'} className={LINK_CLASS}>
          {user ? 'Mis Partidos' : 'Ingresar'}
        </Link>
      </div>
    </nav>
  );
};

export { Nav };
