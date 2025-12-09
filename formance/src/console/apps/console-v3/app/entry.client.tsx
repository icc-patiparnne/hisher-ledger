/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */
import { HydratedRouter } from 'react-router/dom';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

// import { initSentry } from '@platform/logger/helper';

function initializeSentry() {
  // Get environment variables from Remix's window.ENV
  const env = (window as any).ENV || {};
  if (
    env.SENTRY_DSN &&
    env.SENTRY_RELEASE &&
    env.SENTRY_ENVIRONMENT &&
    (env.SENTRY == '1' || env.SENTRY == 'true')
  ) {
    // initSentry(
    //   env.SENTRY_DSN,
    //   env.SENTRY_ENVIRONMENT,
    //   env.SENTRY_RELEASE,
    //   'console-v3'
    // );
  }
}

// Try to initialize Sentry immediately, or wait for window.ENV to be available
if ((window as any).ENV) {
  initializeSentry();
} else {
  // Wait for window.ENV to be set by the script tag
  const checkENV = () => {
    if ((window as any).ENV) {
      initializeSentry();
    } else {
      setTimeout(checkENV, 10);
    }
  };
  checkENV();
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter />
    </StrictMode>
  );
});
