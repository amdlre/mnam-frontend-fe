import { api } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { getAccessToken } from './tokens';

import type { User } from '@/types/auth';

export async function getCurrentUser(): Promise<User | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const response = await api.get<User>(ENDPOINTS.auth.me);
    return response.data;
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getAccessToken();
  return !!token;
}
