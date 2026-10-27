import { Menu, X } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

import { UserContext } from '#context/userContext.tsx';
import { handleGoogleLogout } from '#utils/auth.ts';

type NavItem = {
  to: string;
  label: string;
};

type NavLinksProps = {
  items: readonly NavItem[];
  vertical: boolean;
  onNavigate: () => void;
  onLogout?: () => void;
};

const LINK_CLASS: string = 'transition-colors duration-200 ease-in-out hover:text-blue-100';

const GUEST_ITEMS: readonly NavItem[] = [
  { to: '/armar', label: 'Armar' },
  { to: '/login', label: 'Ingresar' },
];

const USER_ITEMS: readonly NavItem[] = [
  { to: '/armar', label: 'Armar' },
  { to: '/partidos', label: 'Partidos' },
  { to: '/formaciones', label: 'Formaciones' },
];

const NavLinks = ({ items, vertical, onNavigate, onLogout }: NavLinksProps) => (
  <ul className={vertical ? 'flex flex-col gap-1 p-2' : 'flex items-center gap-6'}>
    {items.map(
      ({ to, label }: NavItem): React.JSX.Element => (
        <li key={to}>
          <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }: { isActive: boolean }): string =>
              `${LINK_CLASS} ${vertical ? 'block rounded-md px-3 py-3' : ''} ${isActive ? 'font-semibold underline underline-offset-8' : ''}`
            }
          >
            {label}
          </NavLink>
        </li>
      )
    )}
    {onLogout && (
      <li>
        <button
          type='button'
          onClick={onLogout}
          className={`${LINK_CLASS} cursor-pointer ${vertical ? 'block w-full rounded-md px-3 py-3 text-left' : ''}`}
        >
          Cerrar sesión
        </button>
      </li>
    )}
  </ul>
);

const Nav = () => {
  const { user, clearContext } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect((): (() => void) | undefined => {
    if (!menuOpen) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    const handlePointerDown = (event: PointerEvent): void => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return (): void => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [menuOpen]);

  const closeMenu = (): void => {
    setMenuOpen(false);
  };

  const logout = (): void => {
    closeMenu();
    handleGoogleLogout(clearContext);
  };

  return (
    <nav aria-label='Principal' ref={navRef} className='relative shadow-md'>
      <div className='flex w-full items-center justify-between p-4'>
        <Link to='/' className={`text-xl font-bold ${LINK_CLASS}`}>
          Armador
        </Link>

        {user ? (
          <>
            <div className='hidden md:block'>
              <NavLinks
                items={USER_ITEMS}
                vertical={false}
                onNavigate={closeMenu}
                onLogout={logout}
              />
            </div>
            <button
              ref={toggleRef}
              type='button'
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls='nav-menu'
              onClick={() => {
                setMenuOpen(!menuOpen);
              }}
              className={`md:hidden cursor-pointer p-1 ${LINK_CLASS}`}
            >
              {menuOpen ? (
                <X size={24} aria-hidden='true' />
              ) : (
                <Menu size={24} aria-hidden='true' />
              )}
            </button>
          </>
        ) : (
          <NavLinks items={GUEST_ITEMS} vertical={false} onNavigate={closeMenu} />
        )}
      </div>

      {user && menuOpen && (
        <div
          id='nav-menu'
          className='md:hidden absolute inset-x-0 top-full z-40 border-t border-white/10 bg-[#333] shadow-md'
        >
          <NavLinks items={USER_ITEMS} vertical={true} onNavigate={closeMenu} onLogout={logout} />
        </div>
      )}
    </nav>
  );
};

export { Nav };
