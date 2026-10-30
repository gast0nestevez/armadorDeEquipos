import type { CredentialResponse } from '@react-oauth/google';

import { GoogleLogin } from '@react-oauth/google';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Footer } from '#components/Footer.tsx';
import { Loader } from '#components/Loader.tsx';
import { Nav } from '#components/Nav.tsx';
import { UserContext } from '#context/userContext.tsx';
import { useSeo } from '#hooks/useSeo.ts';
import { handleGoogleLogin } from '#utils/auth.ts';
import { getErrorMessage } from '#utils/errors.ts';

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
        <div className='bg-white p-8 rounded-lg shadow-md w-80'>
          <h1 className='text-xl font-semibold mb-4 text-center'>Iniciar sesión</h1>

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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export { Auth };
