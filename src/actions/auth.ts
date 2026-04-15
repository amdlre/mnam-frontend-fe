'use server';

import { redirect } from 'next/navigation';

import { api, ApiException } from '@/lib/api/fetcher';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { setAuthTokens, clearAuthTokens } from '@/lib/auth/tokens';
import { loginSchema, registerSchema } from '@/lib/validations/auth';

import type { AuthTokens } from '@/types/auth';

export interface ActionResult {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export async function loginAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const response = await api.post<AuthTokens>(ENDPOINTS.auth.login, parsed.data, {
      noAuth: true,
    });

    await setAuthTokens(response.data.access_token, response.data.refresh_token);
  } catch (error) {
    if (error instanceof ApiException) {
      return {
        success: false,
        message: error.message,
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: 'حدث خطأ غير متوقع',
    };
  }

  redirect('/dashboard');
}

export async function registerAction(formData: FormData): Promise<ActionResult> {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    password_confirmation: formData.get('password_confirmation') as string,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const response = await api.post<AuthTokens>(ENDPOINTS.auth.register, parsed.data, {
      noAuth: true,
    });

    await setAuthTokens(response.data.access_token, response.data.refresh_token);
  } catch (error) {
    if (error instanceof ApiException) {
      return {
        success: false,
        message: error.message,
        errors: error.errors,
      };
    }
    return {
      success: false,
      message: 'حدث خطأ غير متوقع',
    };
  }

  redirect('/dashboard');
}

export async function logoutAction(): Promise<void> {
  try {
    await api.post(ENDPOINTS.auth.logout);
  } finally {
    await clearAuthTokens();
  }
  redirect('/login');
}
