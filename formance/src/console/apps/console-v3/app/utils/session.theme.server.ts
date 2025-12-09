import { createCookieSessionStorage } from 'react-router';
import { createThemeSessionResolver } from 'remix-themes';

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === 'production';
export const THEME_COOKIE_NAME = '__session_theme';
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: THEME_COOKIE_NAME!,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secrets: [process.env.COOKIE_SECRET!],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: process.env.COOKIE_DOMAIN!, secure: true }
      : {}),
  },
});

export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
