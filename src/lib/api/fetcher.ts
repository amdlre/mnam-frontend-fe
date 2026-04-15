import { cookies } from 'next/headers';

import { APP_CONFIG } from '@/constants/config';

// ─── Types ───────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

export interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string>;
  /** Set to true when calling from a Client Component */
  isClient?: boolean;
  /** Skip auth header */
  noAuth?: boolean;
  /** Custom base URL override */
  baseUrl?: string;
}

// ─── Error Class ─────────────────────────────────────────────────
export class ApiException extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor({ message, status, errors }: ApiError) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
  }
}

// ─── Token Retrieval ─────────────────────────────────────────────
async function getAuthToken(isClient: boolean): Promise<string | null> {
  if (isClient) {
    return null;
  }

  try {
    const cookieStore = await cookies();
    return cookieStore.get(APP_CONFIG.auth.cookieName)?.value || null;
  } catch {
    return null;
  }
}

// ─── Main Fetcher ────────────────────────────────────────────────
export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<ApiResponse<T>> {
  const {
    body,
    params,
    isClient = false,
    noAuth = false,
    baseUrl,
    headers: customHeaders,
    ...restOptions
  } = options;

  const base = baseUrl || APP_CONFIG.api.baseUrl;
  const url = new URL(endpoint, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(customHeaders as Record<string, string>),
  };

  if (!noAuth) {
    const token = await getAuthToken(isClient);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url.toString(), {
      ...restOptions,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      if (!response.ok) {
        throw new ApiException({
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
        });
      }
      return {
        data: null as T,
        status: response.status,
        success: true,
      };
    }

    const json = await response.json();

    if (!response.ok) {
      throw new ApiException({
        message: json.message || `HTTP ${response.status}`,
        status: response.status,
        errors: json.errors,
      });
    }

    return {
      data: json.data ?? json,
      message: json.message,
      status: response.status,
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiException) throw error;

    throw new ApiException({
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      status: 0,
    });
  }
}

// ─── Convenience Methods ─────────────────────────────────────────
export const api = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: unknown, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};
