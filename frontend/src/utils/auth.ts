import type { CredentialResponse } from '@react-oauth/google';

import { googleLogout } from '@react-oauth/google';

import type { User } from '#context/userContext.tsx';

import { api } from '#utils/api.ts';
import { saveSession } from '#utils/session.ts';

type AuthResponseData = {
  user: User;
  token: string;
};

type SetUser = (user: User) => void;

const authenticate: (
  path: string,
  body: Record<string, unknown>,
  setUser: SetUser
) => Promise<void> = async (
  path: string,
  body: Record<string, unknown>,
  setUser: SetUser
): Promise<void> => {
  const { user, token }: AuthResponseData = await api.post<AuthResponseData>(path, body, {
    authenticated: false,
  });

  saveSession(user, token);
  setUser(user);
};

const handleGoogleLogin: (
  credentialResponse: CredentialResponse,
  setUser: SetUser
) => Promise<void> = (credentialResponse: CredentialResponse, setUser: SetUser): Promise<void> =>
  authenticate('/auth/google', { googleToken: credentialResponse.credential }, setUser);

const handleGoogleLogout: (clearContext: () => void) => void = (clearContext: () => void): void => {
  googleLogout();
  clearContext();
};

export { handleGoogleLogin, handleGoogleLogout };
