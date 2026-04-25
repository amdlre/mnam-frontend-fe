export type ThemePreference = 'light' | 'dark' | 'system';

/**
 * Cookie name where the user's theme preference is persisted.
 * Stored as plain text: 'light' | 'dark' | 'system'.
 *
 * Using a cookie (instead of localStorage) lets the server read the
 * preference during SSR and emit the correct `class="dark"` on <html>
 * before any JS runs, so there's no FOUC and no inline init <script>
 * (which would trip React 19's "script inside React component" warning).
 */
export const THEME_COOKIE_NAME = 'mnam.theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isThemePreference(value: string | undefined | null): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}
