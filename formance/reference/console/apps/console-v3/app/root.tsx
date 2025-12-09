import React, { useEffect, useState } from 'react';

import { get, isEmpty } from 'lodash-es';
import {
  data,
  Links,
  LinksFunction,
  LoaderFunctionArgs,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
} from 'react-router';
import {
  PreventFlashOnWrongTheme,
  Theme,
  ThemeProvider,
  useTheme,
} from 'remix-themes';

import httpRequest from '@platform/http/request';
import { logError, throwError } from '@platform/logger/helper';
import { CurrentUser, Errors } from '@platform/remix';
import {
  Footer,
  Gtm,
  PylonWidget,
  SidebarProvider,
  SonnerToaster,
  TailwindIndicator,
  TTheme,
} from '@platform/ui';

import '../style.css';

import AppErrorBoundary from './components/app-error-boundary';
import { withContext } from './utils/auth.server';
import { getAuthenticator } from './utils/session.auth.server';
import { themeSessionResolver } from './utils/session.theme.server';

import { formatFeatureFlagFromEnv } from '@platform/utils';
import { generatePylonEmailHash } from '@platform/utils/pylon.server';

import { AppContentNav } from './components/app-content';
import { AppSidebarLeft } from './components/app-sidebar-left';
import { AppSidebarRight } from './components/app-sidebar-right';
import { PageProvider } from './components/contexts/page-context';
import Header from './components/header';
import {
  Gateway,
  mergeDisabledFeatures,
  TFeature,
} from './hooks/useFeatureFlag';
import { useMicroStack } from './hooks/useMicroStack';
import {
  commitGatewaySession,
  GATEWAY_COOKIE_NAME,
  getGatewaySession,
  getServiceVersion,
} from './utils/session.gateway.server';
import { logTelemetryInfo } from './utils/telemetry.server';

export const links: LinksFunction = () => [
  {
    type: 'image/png',
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/favicons/apple-touch-icon.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '32x32',
    href: '/favicons/favicon-32x32.png',
  },
  {
    rel: 'icon',
    type: 'image/png',
    sizes: '16x16',
    href: '/favicons/favicon-16x16.png',
  },
  {
    type: 'application/manifest+json',
    rel: 'manifest',
    href: '/favicons/site.webmanifest',
  },
];

export type CurrentContext = {
  theme: Theme;
  env: {
    API_URL?: string;
    NODE_ENV?: string;
    MICRO_STACK?: string;
    PORTAL_UI?: string;
    OTEL_TRACES?: string;
    OTEL_SERVICE_NAME?: string;
    OTEL_TRACES_EXPORTER_OTLP_ENDPOINT?: string;
    OTEL_TRACES_EXPORTER?: string;
    SENTRY_ENVIRONMENT?: string;
    SENTRY_RELEASE?: string;
    SENTRY_DSN?: string;
    SENTRY?: string;
    TELEMETRY?: string;
  };
  currentUser?: CurrentUser;
  organizationId: string;
  stackId: string;
  region: string;
  isMicroStack: boolean;
  hasBankingBridge: boolean;
  gateway: {
    featuresDisabled: TFeature[];
    servicesVersion: { name: string; version: string; rawVersion: string }[];
  };
  pylonEmailHash?: string;
};
type LoaderData = CurrentContext | Response | unknown;

export async function loader({
  request,
}: LoaderFunctionArgs): Promise<LoaderData> {
  const { getTheme } = await themeSessionResolver(request);
  const theme = getTheme();

  const authenticator = getAuthenticator(request);
  const { MICRO_STACK, PORTAL_UI, BANKING_BRIDGE } = process.env!;

  const isMicroStack = MICRO_STACK === '1';

  const hasBankingBridge = Boolean(BANKING_BRIDGE);

  const req: LoaderData = (await withContext<LoaderData>(
    async (_api, _context, auth) => {
      const { organizationId, stackId, region, apiUrl } = _context;

      if (organizationId && stackId && region) {
        const env: CurrentContext['env'] = {
          API_URL: apiUrl,
          NODE_ENV: process.env.NODE_ENV,
          MICRO_STACK: process.env.MICRO_STACK,
          PORTAL_UI: process.env.PORTAL_UI,
          OTEL_TRACES: process.env.OTEL_TRACES,
          OTEL_TRACES_EXPORTER: process.env.OTEL_TRACES_EXPORTER,
          OTEL_TRACES_EXPORTER_OTLP_ENDPOINT:
            process.env.OTEL_TRACES_EXPORTER_OTLP_ENDPOINT,
          OTEL_SERVICE_NAME: process.env.OTEL_SERVICE_NAME,
          SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
          SENTRY_RELEASE: process.env.SENTRY_RELEASE,
          SENTRY_DSN: process.env.SENTRY_DSN,
          SENTRY: process.env.SENTRY,
          TELEMETRY: process.env.TELEMETRY,
        };
        const manualFeaturesDisabled = formatFeatureFlagFromEnv(
          get(process, 'env.FEATURES_DISABLED')
        );

        const manualVersionServices = JSON.parse(
          get(process, 'env.SERVICES_VERSION', '{}')
        );

        const manualVersionServiceGatewayLike = Object.keys(
          manualVersionServices
        ).map((s) => ({
          name: s,
          version: manualVersionServices[s],
        }));

        const urlVersionServices = `${apiUrl.split('/api')[0]}/versions`;

        //  Feature flag from gateway
        const gatewayServices = await httpRequest<Gateway>(
          {
            url: urlVersionServices,
          },
          undefined,
          undefined,
          undefined,
          'getGatewayVersions'
        ).catch(() => ({
          versions: [],
        }));

        let featuresDisabled;
        let servicesVersion = manualVersionServiceGatewayLike;

        if (gatewayServices && !isEmpty(gatewayServices)) {
          servicesVersion = [...servicesVersion, ...gatewayServices.versions];

          // Feature flag merged with manual (env var) + gateway up services
          featuresDisabled = mergeDisabledFeatures(
            // TODO fix type
            servicesVersion as any,
            manualFeaturesDisabled
          );
        }

        logTelemetryInfo(isMicroStack, apiUrl, process.env.TELEMETRY);

        if (isMicroStack) {
          return {
            theme,
            env,
            organizationId,
            stackId,
            region,
            isMicroStack,
            hasBankingBridge,
            gateway: {
              featuresDisabled,
              servicesVersion,
            },
          };
        } else {
          const isAuth = await auth.isAuthenticated();
          if (isAuth) {
            const currentUser = await auth.getCurrentUser(
              { id: organizationId, name: '' },
              true,
              stackId,
              region
            );

            const pylonEmailHash = generatePylonEmailHash(
              currentUser?.email ?? '',
              process.env.PYLON_IDENTITY_SECRET ?? ''
            );

            return {
              theme,
              env,
              currentUser,
              organizationId,
              stackId,
              region,
              isMicroStack,
              hasBankingBridge,
              gateway: {
                featuresDisabled,
                servicesVersion: servicesVersion.map((service) => ({
                  name: service.name,
                  version: getServiceVersion(service),
                  rawVersion: service.version,
                })),
              },
              pylonEmailHash,
            };
          }
          logError({
            url: 'root',
            statusText: Errors.UNAUTHORIZED,
            statusCode: 401,
          });

          return redirect(PORTAL_UI!);
        }
      } else {
        if (isMicroStack) {
          return throwError(
            422,
            'MICRO_STACK activated. Organization ID and stack ID are missing'
          );
        } else {
          logError({
            url: 'root',
            statusText: 'Organization ID and stack ID are missing',
          });

          return redirect(PORTAL_UI!);
        }
      }
    },
    authenticator,
    request
  )) as LoaderData;

  const gatewaySession = await getGatewaySession(request.headers.get('Cookie'));
  // @ts-expect-error remix session
  gatewaySession.set(GATEWAY_COOKIE_NAME, {
    featuresDisabled: get(req, 'gateway.featuresDisabled'),
    servicesVersion: get(req, 'gateway.servicesVersion'),
  });

  return data(req, {
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': await commitGatewaySession(gatewaySession),
    },
  });
}

export function ErrorBoundary() {
  return (
    <html lang="en" className="h-full">
      <head>
        <title>Console - Formance</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Links />
      </head>
      <body className="font-primary antialiased bg-muted-lighter text-foreground h-full overflow-x-hidden">
        <main className="h-full">
          <AppErrorBoundary />
        </main>
        <Scripts />
      </body>
    </html>
  );
}

export function App() {
  const context = useLoaderData<CurrentContext>();
  const [theme, setTheme] = useTheme();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  const { isMicroStack } = useMicroStack(context);

  useEffect(() => {
    if (context?.env?.NODE_ENV) {
      localStorage.setItem('ENV', context?.env?.NODE_ENV);
      localStorage.setItem('PORTAL_UI', context?.env?.PORTAL_UI ?? '');
    }

    if (isMicroStack) {
      localStorage.removeItem('PORTAL_UI');
      navigate(
        `/${context.organizationId}/${context.stackId}?region=${context.region}`
      );
      setReady(true);
    } else {
      setReady(true);
    }
  }, []);

  const isProduction = context?.env?.NODE_ENV === 'production';
  const telemetryEnabled = context?.env?.TELEMETRY !== 'false';
  const shouldLoadGtm = isMicroStack
    ? telemetryEnabled // Default true for microstack, opt-out with false
    : isProduction; // Always true in production for cloud
  const shouldLoadPylon = isProduction && !isMicroStack; // Cloud only

  return (
    <html lang="en" className={theme ?? ''} data-theme={theme}>
      <head>
        {context && context?.organizationId && context?.stackId ? (
          <title>{`${context?.organizationId}/${context?.stackId} - Console - Formance`}</title>
        ) : (
          <title>Console - Formance</title>
        )}

        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(context.theme)} />
        <Links />
      </head>

      <body className="font-primary antialiased bg-muted-lighter text-foreground [--header-height:3rem]">
        {context && (
          <PageProvider>
            <Header context={context} />

            <main
              id="app-layout"
              className="mt-[var(--header-height)] flex-grow"
            >
              {ready && (
                <>
                  <SidebarProvider id="app-layout-left">
                    <AppSidebarLeft context={context} />

                    <div className="w-full flex flex-col min-h-[calc(100vh-var(--header-height))] pr-[calc(var(--sidebar-width-icon)+1px)]">
                      <AppContentNav isMicroStack={isMicroStack} />

                      <div className="w-full flex flex-col flex-grow">
                        <div className="flex-grow">
                          <Outlet context={context} />
                        </div>

                        <Footer
                          theme={(theme || 'light') as TTheme}
                          setTheme={(t) => setTheme(t as Theme)}
                          hasContainer={false}
                          isMicroStack={isMicroStack}
                        />
                      </div>
                      <AppSidebarRight context={context} />
                    </div>
                  </SidebarProvider>
                </>
              )}
            </main>
          </PageProvider>
        )}

        {shouldLoadGtm && (
          <Gtm gtmId={isMicroStack ? 'GTM-WLNV8HRZ' : 'GTM-T4LQJPT2'} />
        )}

        {shouldLoadPylon && (
          <PylonWidget
            email={context?.currentUser?.email ?? ''}
            emailHash={context?.pylonEmailHash}
            organizationId={context?.organizationId}
            stackId={context?.stackId}
            region={context?.region}
          />
        )}

        <SonnerToaster theme={theme as TTheme} />
        <TailwindIndicator />

        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(context.env)}`,
          }}
        />

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function AppWithProviders() {
  const context = useLoaderData<CurrentContext>();
  useEffect(() => {
    if (context?.env?.NODE_ENV === 'development') {
      // LINT_EXCEPTION_REASON : debug
      // eslint-disable-next-line no-console
      console.info('#CONSOLE_V3', context);
    }
  }, []);

  return (
    <ThemeProvider
      specifiedTheme={context.theme}
      themeAction="/action/set-theme"
    >
      <App />
    </ThemeProvider>
  );
}

export default AppWithProviders;

export const shouldRevalidate = () => false;
