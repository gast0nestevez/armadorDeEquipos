import { googleLogout, CredentialResponse } from '@react-oauth/google';

import { Env } from '@/utils/env';

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

type User = {
  [key: string]: unknown;
};

type AuthResponseData = {
  user: User;
  token: string;
};

type SetUser = (user: User) => void;

const handleGoogleLogin = async (
  credentialResponse: CredentialResponse,
  setUser: SetUser,
): Promise<void> => {
  const googleToken: string | undefined = credentialResponse.credential;

  const url: string = `${API_BASE_URL}/auth/googleLogin`;
  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ googleToken }),
  };

  try {
    const response: Response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Something went wrong during fetch');
    }

    const { data }: { data: AuthResponseData } = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setUser(data.user);
  } catch (err) {
    console.error('Error while login: ', err);
  }
};

const handleGoogleError = (): void => {
  console.error('Google error: ');
};

const handleGoogleLogout = (clearContext: () => void): void => {
  googleLogout();
  clearContext();
};

const handleEmailLogin = async (
  email: string,
  password: string,
  setUser: SetUser,
): Promise<void> => {
  const url: string = `${API_BASE_URL}/auth/login`;
  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  };

  try {
    const response: Response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Something went wrong during login');
    }

    const { data }: { data: AuthResponseData } = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setUser(data.user);
  } catch (err) {
    console.error('Error while login: ', err);
    throw new Error('Credenciales Inválidas');
  }
};

const handleEmailRegister = async (
  email: string,
  password: string,
  setUser: SetUser,
): Promise<void> => {
  const url: string = `${API_BASE_URL}/auth/register`;
  const options: RequestInit = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  };

  try {
    const response: Response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Something went wrong during register');
    }

    const { data }: { data: AuthResponseData } = await response.json();
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    setUser(data.user);
  } catch (err) {
    console.error('Error while login: ', err);
    throw new Error('Credenciales Inválidas');
  }
};

export {
  handleGoogleLogin,
  handleGoogleError,
  handleGoogleLogout,
  handleEmailLogin,
  handleEmailRegister
};
