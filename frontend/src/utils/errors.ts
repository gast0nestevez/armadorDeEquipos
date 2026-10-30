import { ApiError, NETWORK_ERROR_CODE, SESSION_EXPIRED_CODE } from '#utils/api.ts';

const ERROR_MESSAGES: Record<string, string> = {
  [NETWORK_ERROR_CODE]: 'No pudimos conectar con el servidor. Revisá tu conexión.',
  [SESSION_EXPIRED_CODE]: 'Tu sesión expiró. Volvé a iniciar sesión.',
  INVALID_GOOGLE_TOKEN: 'No pudimos validar tu cuenta de Google',
  MATCH_NOT_FOUND: 'El partido ya no existe',
  FORMATION_NOT_FOUND: 'La formación ya no existe',
};

const getErrorMessage: (err: unknown, fallback: string) => string = (
  err: unknown,
  fallback: string
): string => (err instanceof ApiError ? (ERROR_MESSAGES[err.code] ?? fallback) : fallback);

export { getErrorMessage };
