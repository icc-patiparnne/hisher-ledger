import { get, isEmpty } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import {
  isRouteErrorResponse,
  Link,
  useOutletContext,
  useParams,
  useRouteError,
  useSearchParams,
  useSubmit,
} from 'react-router';

import { deserializeError, getLevel } from '@platform/logger/helper';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  FormanceIcon,
  PreviewJson,
  TBadgeProps,
} from '@platform/ui';
import { EXTERNAL_LINKS } from '@platform/utils';
import * as Sentry from '@sentry/react';
import { CurrentContext } from '../root';
import { AUTH_ACTION_LOGOUT } from '../routes/auth/constants';
import { ACTIONS_ROUTES } from '../utils/actions';
import { ROUTES } from '../utils/routes';
import { AppContentGrid } from './app-content';

export default function AppErrorBoundary() {
  const error = useRouteError();
  const { organizationId, stackId } = useParams();
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');
  const logDeserialized = deserializeError(error);
  const statusCode = String(logDeserialized?.statusCode);
  const [env, setEnv] = useState<string | null>(null);
  const [portalUi, setPortalUi] = useState<string | null>(null);
  const outletContext = useOutletContext<CurrentContext>();
  const submit = useSubmit();
  const logout = () => {
    const form = new FormData();
    submit(form, {
      method: 'post',
      action: ACTIONS_ROUTES({})[AUTH_ACTION_LOGOUT].to,
    });
  };

  const url = get(logDeserialized, 'url', '') || '';
  const refreshTokenExpired =
    logDeserialized?.statusCode == '400' &&
    url.includes('/oauth/token?grant_type=refresh_token');

  const userInfoForbidden =
    logDeserialized?.statusCode == '403' && url.includes('/userinfo');

  const shouldLogout =
    logDeserialized?.statusCode == '401' ||
    refreshTokenExpired ||
    userInfoForbidden;
  const traceId = get(logDeserialized, 'traceId', '') || '';
  const spanId = get(logDeserialized, 'spanId', '') || '';

  useEffect(() => {
    Sentry.captureMessage(
      `ErrorBoundary:${traceId}_${logDeserialized?.statusCode}_${logDeserialized?.statusText}`,
      {
        level: getLevel(logDeserialized.statusCode),
        extra: { details: error },
        user: outletContext?.currentUser,
        tags: {
          env: outletContext?.env.SENTRY_ENVIRONMENT,
          app_version: outletContext?.env.SENTRY_RELEASE,
          otel_trace_id: traceId,
          status_code: logDeserialized.statusCode,
          context: isRouteErrorResponse(error) ? 'backend' : 'frontend',
        },
      }
    );
    if (typeof localStorage !== 'undefined') {
      setEnv(localStorage.getItem('ENV'));
      setPortalUi(localStorage.getItem('PORTAL_UI'));
    }
    if (shouldLogout) {
      logout();
    }
  }, []);
  const statusCodeMap: Record<
    string,
    { title: string; description: any; badge: TBadgeProps['variant'] }
  > = {
    '': {
      title: 'Something went wrong',
      description: () => (
        <CardDescription>
          <span>Please try again later. </span>
          <span>
            If the issue persists, get help with{' '}
            <Link
              className="underline underline-offset-8"
              to={EXTERNAL_LINKS.COMMUNITY_HELP.to}
            >
              Community Help
            </Link>
          </span>
        </CardDescription>
      ),
      badge: 'destructive',
    },
    '400': {
      title: 'Bad Request',
      description: () => (
        <CardDescription>
          <span>The request was invalid. Please try again. </span>
          <br />
          <span>
            If the issue persists, get help with{' '}
            <Link
              className="underline underline-offset-8"
              to={EXTERNAL_LINKS.COMMUNITY_HELP.to}
            >
              Community Help
            </Link>
          </span>
        </CardDescription>
      ),
      badge: 'destructive',
    },
    '401': {
      title: 'Unauthorized',
      description: () => (
        <CardDescription>
          <span>You are not authorized to access this resource. </span>
          <span>
            If the issue persists, get help with{' '}
            <Link to={EXTERNAL_LINKS.COMMUNITY_HELP.to}>Community Help</Link>
          </span>
        </CardDescription>
      ),
      badge: 'destructive',
    },
    '422': {
      title: 'Unprocessable Entity',
      description: () => (
        <CardDescription>
          <span>
            Something went wrong with your request. Please try again.{' '}
          </span>
        </CardDescription>
      ),
      badge: 'destructive',
    },
    '403': {
      title: 'Access Denied',
      description: () => (
        <CardDescription>
          <span>You are not authorized to access this resource. </span>
        </CardDescription>
      ),
      badge: 'destructive',
    },
  };

  const hasTraceId = !isEmpty(traceId) && !isEmpty(spanId);

  return (
    <div className="container">
      <AppContentGrid className="h-full place-content-center space-y-2">
        <div className="col-span-12">
          <Card>
            <CardHeader className="text-center">
              {statusCode && (
                <Badge
                  className="mx-auto mb-1"
                  variant={statusCodeMap[statusCode]?.badge}
                >
                  {statusCode}
                </Badge>
              )}

              <CardTitle className="flex items-center justify-center gap-2">
                <span>{statusCodeMap[statusCode]?.title}</span>
              </CardTitle>
              {statusCodeMap[statusCode]?.description()}
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <FormanceIcon size="xl" />
              </div>
              {hasTraceId && (
                <div>
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Trace ID</p>
                      <Chip
                        variant="primary"
                        copyMode="click"
                        label={traceId}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">Span ID</p>
                      <Chip
                        variant="secondary"
                        copyMode="click"
                        label={spanId}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center gap-2">
              {organizationId && stackId && region && (
                <Link
                  to={
                    ROUTES({ organizationId, stackId, region })[
                      'GLOBAL_OVERVIEW'
                    ].to
                  }
                >
                  <Button>
                    See{' '}
                    {
                      ROUTES({ organizationId, stackId, region })[
                        'GLOBAL_OVERVIEW'
                      ].title
                    }
                  </Button>
                </Link>
              )}

              {portalUi && (
                <Link to={portalUi}>
                  <Button variant="slate">Go on portal</Button>
                </Link>
              )}
              {hasTraceId &&
                outletContext?.env?.SENTRY_ENVIRONMENT === 'development' && (
                  <Link
                    to={`https://light-monster.eu.signoz.cloud/trace/${traceId}?spanId=${logDeserialized?.spanId}`}
                  >
                    <Button variant="info">See on signoz</Button>
                  </Link>
                )}
              <Link to={EXTERNAL_LINKS.COMMUNITY_HELP.to}>
                <Button variant="slate">Community Help</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        {env && env === 'development' && (
          <PreviewJson
            className="col-span-12"
            json={{ log: logDeserialized }}
            defaultUnfoldAll={true}
          />
        )}
      </AppContentGrid>
    </div>
  );
}
