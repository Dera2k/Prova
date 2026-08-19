import * as tokenStorage from '@/features/auth/tokenStorage';

const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ApiErrorBody {
  success: false;
  statusCode: number;
  message: string | string[];
  error: string;
}

export class ApiError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(body: ApiErrorBody) {
    super(Array.isArray(body.message) ? body.message.join(', ') : body.message);
    this.statusCode = body.statusCode;
    this.errorCode = body.error;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean; // attach access token — default true
}

// Set by AuthContext once it initializes, so client.ts can trigger a
// logout when refresh fails without importing AuthContext directly
// (that would create a circular dependency: context uses client, client
// would use context).
let onRefreshFailure: (() => void) | null = null;
export function setOnRefreshFailure(handler: () => void) {
  onRefreshFailure = handler;
}

async function rawRequest<T>(path: string, options: RequestOptions, token: string | null): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiError(json ?? {
      success: false,
      statusCode: response.status,
      message: 'Unexpected error',
      error: 'UNKNOWN',
    });
  }

  return json as T;
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) return null;

  try {
    const result = await rawRequest<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { method: 'POST', body: { refreshToken } },
      null,
    );
    await tokenStorage.setTokens(result.accessToken, result.refreshToken);
    return result.accessToken;
  } catch {
    await tokenStorage.clearTokens();
    onRefreshFailure?.();
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const needsAuth = options.auth ?? true;
  let token = needsAuth ? await tokenStorage.getAccessToken() : null;

  try {
    return await rawRequest<T>(path, options, token);
  } catch (err) {
    // Access token expired mid-session — refresh once, retry once.
    // Deliberately not a retry loop: if the refreshed token also gets a
    // 401, something is wrong server-side and looping would hide that.
    if (err instanceof ApiError && err.statusCode === 401 && needsAuth) {
      token = await refreshAccessToken();
      if (token) {
        return rawRequest<T>(path, options, token);
      }
    }
    throw err;
  }
}