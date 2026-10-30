import type { CredentialResponse } from '@react-oauth/google';

import { GoogleLogin } from '@react-oauth/google';
import { BarChart3, Bookmark, Share2, Trophy } from 'lucide-react';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Footer } from '#components/Footer.tsx';
import { Loader } from '#components/Loader.tsx';
import { Nav } from '#components/Nav.tsx';
import { UserContext } from '#context/userContext.tsx';
import { useSeo } from '#hooks/useSeo.ts';
import { handleGoogleLogin } from '#utils/auth.ts';
import { getErrorMessage } from '#utils/errors.ts';

type Benefit = {
  Icon: typeof Trophy;
  text: string;
};

const BENEFITS: Benefit[] = [
  { Icon: Trophy, text: 'Guardá los resultados de todos tus partidos' },
  { Icon: BarChart3, text: 'Mirá tus estadísticas y la evolución de tu rendimiento' },
  { Icon: Bookmark, text: 'Guardá tus formaciones y pasalas a partido en un toque' },
  { Icon: Share2, text: 'Compartí partidos y formaciones con tus amigos' },
];

const Auth = () => {
  useSeo({
    title: 'Ingresar | Armador de Equipos',
    description: 'Ingresá con Google para guardar tus partidos y ver tus estadísticas.',
    path: '/login',
    indexable: false,
  });

  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generalError, setGeneralError] = useState<string>('');

  const onSuccessGoogle: (credentialResponse: CredentialResponse) => Promise<void> = async (
    credentialResponse: CredentialResponse
  ): Promise<void> => {
    setIsLoading(true);
    setGeneralError('');

    try {
      await handleGoogleLogin(credentialResponse, setUser);
      await navigate('/');
    } catch (error) {
      setGeneralError(
        getErrorMessage(error, 'Error al iniciar sesión con Google. Intenta nuevamente.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onErrorGoogle: () => void = (): void => {
    setGeneralError('Error al iniciar sesión con Google. Intenta nuevamente.');
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <Loader />
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav />

      <div className='flex justify-center items-center h-full'>
        <div className='bg-white p-8 rounded-lg shadow-md w-80 sm:w-96'>
          <h1 className='text-xl font-semibold mb-2 text-center'>Iniciar sesión</h1>

          <p className='mb-4 text-sm text-center text-gray-600'>
            Armar equipos no necesita cuenta. Ingresá para llevar el historial de tu grupo.
          </p>

          <ul className='mb-6 space-y-3'>
            {BENEFITS.map(
              ({ Icon, text }: Benefit): React.JSX.Element => (
                <li key={text} className='flex items-start gap-3 text-sm text-gray-700'>
                  <Icon size={18} className='mt-0.5 shrink-0 text-blue-600' aria-hidden='true' />
                  {text}
                </li>
              )
            )}
          </ul>

          {generalError && (
            <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
              {generalError}
            </div>
          )}

          <div className='flex justify-center'>
            <GoogleLogin
              theme='outline'
              size='large'
              shape='rectangular'
              onSuccess={(e) => void onSuccessGoogle(e)}
              onError={onErrorGoogle}
            />
          </div>

          <p className='mt-4 text-xs text-center text-gray-500'>
            Usamos Google solo para identificarte (mail y nombre). No publicamos nada.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export { Auth };
