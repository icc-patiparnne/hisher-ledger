import { createCookieSessionStorage } from 'react-router';

import { SessionFlashData } from '@platform/remix';
import {
  getModule,
  MODULES_GATEWAY_DEFAULT_VERSION,
  TModuleGateway,
} from '@platform/utils';
import { CallbackContext } from './auth.server';
import { normalizeVersion } from './version';

export type GatewaySession = {
  featuresDisabled: string[];
  servicesVersion: { name: string; version: string }[];
};

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === 'production';
export const GATEWAY_COOKIE_NAME = `__session_gateway_${
  process.env.COOKIE_DOMAIN || process.env.NODE_ENV
}`;
const {
  getSession: getGatewaySession,
  commitSession: commitGatewaySession,
  destroySession: destroyGatewaySession,
} = createCookieSessionStorage<GatewaySession, SessionFlashData>({
  cookie: {
    name: GATEWAY_COOKIE_NAME,
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

export type LoaderWrapperProps<T> = T & {
  version: string;
};

export const getServiceVersionFromContext = (
  context: CallbackContext,
  service: TModuleGateway
): string => {
  const version = context?.sdkVersions?.[service];
  if (version && version !== '') {
    return version;
  }

  return MODULES_GATEWAY_DEFAULT_VERSION[service];
};

export function wrapLoaderWithProps<T>(
  data: T,
  version: string
): LoaderWrapperProps<T> {
  return {
    ...data,
    version,
  };
}

export const getServiceVersion = (service: {
  name: string;
  version: string;
}): string => {
  const semverRegex =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

  const normalized = normalizeVersion(service.version);
  const [, major] = normalized.match(semverRegex) ?? [];
  const module = getModule(service.name);

  return (
    major || MODULES_GATEWAY_DEFAULT_VERSION[module?.gateway as TModuleGateway]
  );
};

export { commitGatewaySession, destroyGatewaySession, getGatewaySession };
