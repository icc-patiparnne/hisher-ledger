import { SessionCookie, SessionFlashData } from '@platform/remix';
import { Authenticator } from '@platform/remix/server';
import { createCookie, createCookieSessionStorage } from 'react-router';
import {
  AUTH_ACTION_LOGIN,
  AUTH_ACTION_LOGOUT,
} from '../routes/auth/constants';
import { ACTIONS_ROUTES } from './actions';

export const CONSOLE_V3_COOKIE_NAME = `__session_console_v3_${
  process.env.COOKIE_DOMAIN || process.env.NODE_ENV
}`;

const {
  getSession: getAuthSession,
  commitSession: commitAuthSession,
  destroySession: destroyAuthSession,
} = createCookieSessionStorage<SessionCookie, SessionFlashData>({
  cookie: createCookie(CONSOLE_V3_COOKIE_NAME, {
    sameSite: 'lax', // this helps with CSRF
    path: '/', // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: [process.env.COOKIE_SECRET!],
    secure: true,
    domain: process.env.COOKIE_DOMAIN,
  }),
});

export const sessionAuthConfig = {
  membershipClient: {
    id: process.env.MEMBERSHIP_CLIENT_ID!,
    secret: process.env.MEMBERSHIP_CLIENT_SECRET!,
    url: process.env.MEMBERSHIP_URL_API!,
  },
  cookie: {
    name: CONSOLE_V3_COOKIE_NAME,
    secret: process.env.COOKIE_SECRET!,
    version: process.env.VERSION!,
  },
  otelTracerServiceName: process.env.OTEL_TRACER_SERVICE_NAME,
  uris: {
    platform: {
      oAuth: process.env.REDIRECT_URI,
      route: ACTIONS_ROUTES({})[AUTH_ACTION_LOGIN].to,
    },
    redirect: {
      error: `${process.env.REDIRECT_URI}${
        ACTIONS_ROUTES({})[AUTH_ACTION_LOGOUT].to
      }`,
      success: '/',
    },
  },
};
export const getAuthenticator = (request: Request) =>
  new Authenticator(sessionAuthConfig, request, {
    commitSession: commitAuthSession,
    getSession: getAuthSession,
    destroySession: destroyAuthSession,
  });

export { commitAuthSession, destroyAuthSession, getAuthSession };
