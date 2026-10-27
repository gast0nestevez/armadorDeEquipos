import { Env } from '#utils/env.ts';
import { clearSession, getToken } from '#utils/session.ts';

type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

type RequestOptions = {
  authenticated?: boolean;
};

type ErrorBody = {
  error?: string | { code?: string; message?: string };
};

type SuccessBody<T> = {
  data: T;
};

const API_BASE_URL: string = Env.getString('VITE_API_BASE_PATH');

const SESSION_EXPIRED_EVENT: string = 'session-expired';
const NETWORK_ERROR_CODE: string = 'NETWORK_ERROR';
const SESSION_EXPIRED_CODE: string = 'SESSION_EXPIRED';
const UNKNOWN_ERROR_CODE: string = 'UNKNOWN_ERROR';

class ApiError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const parseError: (response: Response) => Promise<ApiError> = async (
  response: Response
): Promise<ApiError> => {
  try {
    const { error }: ErrorBody = (await response.json()) as ErrorBody;

    if (typeof error === 'string') {
      return new ApiError(error, response.status, UNKNOWN_ERROR_CODE);
    }

    return new ApiError(
      error?.message ?? response.statusText,
      response.status,
      error?.code ?? UNKNOWN_ERROR_CODE
    );
  } catch {
    return new ApiError(response.statusText, response.status, UNKNOWN_ERROR_CODE);
  }
};

const request: <T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  options?: RequestOptions
) => Promise<T> = async <T>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  { authenticated = true }: RequestOptions = {}
): Promise<T> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (authenticated) {
    headers.Authorization = `Bearer ${getToken()}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Network error', 0, NETWORK_ERROR_CODE);
  }

  if (!response.ok) {
    const error: ApiError = await parseError(response);

    if (authenticated && (response.status === 401 || response.status === 403)) {
      clearSession();
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
      throw new ApiError(error.message, response.status, SESSION_EXPIRED_CODE);
    }

    throw error;
  }

  return ((await response.json()) as SuccessBody<T>).data;
};

const api = {
  get: <T>(path: string, options?: RequestOptions): Promise<T> =>
    request<T>('GET', path, undefined, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('POST', path, body, options),
  put: <T>(path: string, body: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('PUT', path, body, options),
  delete: <T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> =>
    request<T>('DELETE', path, body, options),
};

export { api, ApiError, NETWORK_ERROR_CODE, SESSION_EXPIRED_CODE, SESSION_EXPIRED_EVENT };
