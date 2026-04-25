'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  isThemePreference,
  type ThemePreference,
} from '@/lib/theme';

function readThemeCookie(): ThemePreference {
  if (typeof document === 'undefined') return 'system';
  const match = document.cookie
    .split('; ')
    .map((c) => c.split('='))
    .find(([k]) => k === THEME_COOKIE_NAME);
  const value = match ? decodeURIComponent(match[1] ?? '') : '';
  return isThemePreference(value) ? value : 'system';
}

function writeThemeCookie(value: ThemePreference) {
  document.cookie = `${THEME_COOKIE_NAME}=${value}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; samesite=lax`;
}

function applyTheme(pref: ThemePreference) {
  const root = document.documentElement;
  const resolved =
    pref === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : pref;
  root.classList.toggle('dark', resolved === 'dark');
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setThemeState(readThemeCookie());
    setMounted(true);
  }, []);

  // Re-apply when the OS preference changes and the user is on "system".
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    writeThemeCookie(next);
    applyTheme(next);
  }, []);

  return { theme, setTheme, mounted };
}
