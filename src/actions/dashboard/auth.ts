'use server';

import { cookies } from 'next/headers';

import { DASHBOARD_API_CONFIG } from '@/lib/api/dashboard/config';
import { DASHBOARD_ENDPOINTS } from '@/lib/api/dashboard/endpoints';
import { forwardBackendCookies } from '@/lib/api/dashboard/cookie-bridge';
import { dashboardLoginSchema } from '@/lib/validations/dashboard/auth';

import type { DashboardLoginResponse } from '@/types/dashboard';

export interface DashboardActionResult {
  success: boolean;
  messageKey?: string;
  errors?: Record<string, string[]>;
}

function url(path: string): string {
  const base = DASHBOARD_API_CONFIG.baseUrl.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function dashboardLoginAction(formData: FormData): Promise<DashboardActionResult> {
  const parsed = dashboardLoginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const body = new URLSearchParams();
  body.set('username', parsed.data.username.trim());
  body.set('password', parsed.data.password.trim());

  let res: Response;
  try {
    res = await fetch(url(DASHBOARD_ENDPOINTS.auth.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body,
      cache: 'no-store',
      credentials: 'include',
    });
  } catch {
    return { success: false, messageKey: 'networkError' };
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const detail =
      payload && typeof payload === 'object' && 'detail' in payload
        ? String((payload as { detail: unknown }).detail)
        : undefined;
    return { success: false, messageKey: detail || 'loginFailed' };
  }

  await forwardBackendCookies(res);

  // Ensure session cookie landed; otherwise the upstream didn't return one.
  const store = await cookies();
  if (!store.get(DASHBOARD_API_CONFIG.sessionCookieName)?.value) {
    // Treat body as-is; some backends return the user in the response.
    const payload = (await res.json().catch(() => null)) as DashboardLoginResponse | null;
    if (!payload?.user) {
      return { success: false, messageKey: 'loginFailed' };
    }
  }

  return { success: true };
}

export async function dashboardLogoutAction(): Promise<void> {
  const store = await cookies();
  const all = store.getAll();
  const cookieHeader = all.map((c) => `${c.name}=${c.value}`).join('; ');
  const csrf = store.get(DASHBOARD_API_CONFIG.csrfCookieName)?.value;

  try {
    await fetch(url(DASHBOARD_ENDPOINTS.auth.logout), {
      method: 'POST',
      headers: {
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        ...(csrf ? { 'X-CSRF-Token': csrf } : {}),
        Accept: 'application/json',
      },
      cache: 'no-store',
      credentials: 'include',
    });
  } catch {
    // fall through — we still clear local cookies
  }

  store.delete(DASHBOARD_API_CONFIG.sessionCookieName);
  store.delete(DASHBOARD_API_CONFIG.csrfCookieName);
}
