import httpRequest from '@platform/http/request';
import {
  debugLogger,
  getErrorDetails,
  getErrorStatusText,
  throwError,
} from '@platform/logger/helper';
import { Errors } from '@platform/remix';
import { Authenticator } from '@platform/remix/server';
import { HTTPClient } from '@platform/sdks/formance/src/lib/http';
import { SDKError } from '@platform/sdks/formance/src/models/errors';
import { SDK } from '@platform/sdks/formance/src/sdk';
import { get, isString, omit } from 'lodash-es';
import { redirect } from 'react-router';
import { TFeature, useFeatureFlagServerSide } from '../hooks/useFeatureFlag';
import { TRouteParamsWithSearchParams } from '../types/routes';
import { NormalizedSDK } from './sdk/sdk';

import { api as traceApi } from '@opentelemetry/sdk-node';
import { TModuleGateway } from '@platform/utils';
import {
  commitAuthSession,
  getAuthenticator,
  getAuthSession,
  sessionAuthConfig,
} from './session.auth.server';
import {
  GATEWAY_COOKIE_NAME,
  GatewaySession,
  getGatewaySession,
} from './session.gateway.server';

export type WithContext = never;

export type Context = {
  apiUrl: string;
} & Pick<TRouteParamsWithSearchParams, 'organizationId' | 'stackId' | 'region'>;

export const getContext = (request: Request): Context => {
  const url = new URL(request.url);
  const { MICRO_STACK, API_URL } = process.env!;

  const isMicroStack = MICRO_STACK === '1';

  if (MICRO_STACK && API_URL) {
    const organizationId =
      (isMicroStack ? 'formance' : url.pathname.split('/')[1]) ||
      url.searchParams.get('orgId') ||
      '';
    const stackId =
      (isMicroStack ? 'localhost' : url.pathname.split('/')[2]) ||
      url.searchParams.get('stackId') ||
      '';
    const region =
      (isMicroStack ? 'localhost' : url.searchParams.get('region')) || '';

    const apiUrl = !isMicroStack
      ? process.env
          .API_URL!.replace('#{stackId}', stackId)
          .replace('#{organizationId}', organizationId)
          .replace('#{region}', region)
      : process.env.API_URL!;

    return {
      organizationId,
      stackId,
      region,
      apiUrl,
    };
  }

  return {
    organizationId: '',
    stackId: '',
    region: '',
    apiUrl: '',
  };
};

export const getFormanceSDK = async (
  authenticator: Authenticator,
  apiUrl: string,
  sdkVersions: CallbackContext['sdkVersions'],
  accessToken?: string
): Promise<NormalizedSDK> => {
  const token = accessToken
    ? accessToken
    : (await authenticator.getParsedSession())?.access_token;

  debugLogger(process.env.DEBUG!, 'getFormanceSDK', 'token', token);

  const httpClient = new HTTPClient({
    fetcher: async (request: any) => {
      const headers: Record<string, string> = {
        ...Object.fromEntries(request.headers.entries()),
        Authorization: `Bearer ${token}`,
      };

      let requestData = request.body;
      if (request.method === 'POST' && request.body) {
        const bodyText = await request.clone().text();
        try {
          // Try to parse as JSON first
          requestData = JSON.parse(bodyText);
        } catch {
          // If not valid JSON, use as string
          requestData = bodyText;
        }
      }

      const axiosConfig = {
        method: request.method,
        url: request.url,
        headers,
        data: requestData,
        timeout: 5000,
        signal: request.signal,
      };
      const urlPath = new URL(request.url).pathname;
      const pathParts = urlPath
        .split('/')
        .filter((part) => part && part !== 'api');
      let spanName = 'SDK:request';

      if (pathParts.length >= 2) {
        const endpoint = pathParts.slice(2).join('_');
        spanName = `SDK:${endpoint}`;
      }

      const axiosResponse = (await httpRequest<any>(
        axiosConfig,
        undefined,
        undefined,
        undefined,
        spanName,
        true
      )) as any;

      return new Response(
        JSON.stringify(
          axiosResponse.status !== 204 ? axiosResponse.data : { data: '' }
        ),
        {
          status: axiosResponse.status === 204 ? 200 : axiosResponse.status,
          statusText: axiosResponse.statusText,
          headers: new Headers(axiosResponse.headers as Record<string, string>),
        }
      );
    },
  });

  const sdk = new SDK({
    serverURL: apiUrl.split('/api')[0],
    httpClient,
  });

  return new NormalizedSDK(sdk, sdkVersions);
};

const getErrorStatusCode = (e: unknown) =>
  e instanceof SDKError
    ? e.statusCode
    : get(e, 'response.status', get(e, 'status', 422));

export type CallbackContext = Context & {
  sdkVersions: { [key: string]: string };
};

const makeRequestWithContext = async <T>(
  context: Context,
  authenticator: Authenticator,
  sdkVersions: any,
  callback: (
    api: NormalizedSDK,
    context: CallbackContext,
    auth: Authenticator
  ) => unknown,
  type: 'action' | 'loader' = 'loader'
) => {
  // eslint-disable-next-line no-console
  console.info(`Refreshing token for ${type}`);
  const refresh = await authenticator.refreshToken(
    context.organizationId,
    context.stackId,
    context.apiUrl.replace('/api', ''),
    true,
    true
  );

  if (refresh && refresh.cookie) {
    // eslint-disable-next-line no-console
    console.info(`Token refreshed: ${type}`);
    const apiRefreshed = await getFormanceSDK(
      authenticator,
      context.apiUrl,
      sdkVersions,
      refresh.cookie.access_token
    );

    const cookieName = sessionAuthConfig.cookie.name;
    const session = await getAuthSession(
      authenticator.request.headers.get('Cookie')
    );
    authenticator.session = session;
    authenticator.masterToken = refresh.cookie.master_token;
    const data = (await callback(
      apiRefreshed,
      { ...context, sdkVersions },
      authenticator
    )) as T;

    try {
      debugLogger(
        process.env.DEBUG!,
        'makeRequestWithContext',
        'refresh.cookie',
        omit(refresh.cookie, ['id_token', 'email', 'version'])
      );

      session.set(
        // @ts-expect-error remix session
        cookieName,
        omit(refresh.cookie, ['id_token', 'email', 'version'])
      );

      return {
        ...data,
        headers: {
          'Set-Cookie': await commitAuthSession(session),
        },
      };
    } catch (e) {
      debugLogger(process.env.DEBUG!, 'makeRequestWithContext', 'error', e);
    }
  } else {
    // eslint-disable-next-line no-console
    console.info('Unable to refresh token...Redirecting to portal ui...');

    return redirect(process.env.PORTAL_UI!);
  }
};

export const withContext = async <T>(
  callback: (
    api: NormalizedSDK,
    context: CallbackContext,
    auth: Authenticator
  ) => unknown,
  authenticator: Authenticator,
  request: Request,
  services?: TModuleGateway[],
  feature?: TFeature
): Promise<T> => {
  const type = request.method === 'GET' ? 'loader' : 'action';
  const context = getContext(request);
  const otelCurrentContext = traceApi.context.active();
  const otelCurrentSpan = traceApi.trace.getSpan(otelCurrentContext);
  const authenticated = await authenticator.isAuthenticated();
  const isMicroStack = process.env.MICRO_STACK === '1';

  if (!authenticated && !isMicroStack) {
    const authenticator = getAuthenticator(request);
    const init = await authenticator.start();
    const url = new URL(request.url);
    const stateObject = {
      redirectTo: `/${context.organizationId}/${context.stackId}?region=${context.region}`,
      from: url ? url.href : undefined,
    };

    const stateAsBase64 = btoa(JSON.stringify(stateObject));
    if (
      !init.cookie &&
      !init.error &&
      init.openIdConfig &&
      sessionAuthConfig &&
      sessionAuthConfig.uris.platform
    ) {
      // TODO add method on auth.server with URL params to be more elegant
      return redirect(
        `${init.openIdConfig.authorization_endpoint}?client_id=${sessionAuthConfig.membershipClient.id}&state=${stateAsBase64}&redirect_uri=${sessionAuthConfig.uris.platform.oAuth}${sessionAuthConfig.uris.platform.route}&response_type=code&scope=openid+email+offline_access+supertoken+accesses+remember_me+keep_refresh_token`
      ) as T;
    }
  }
  let can = true;
  const gatewaySession = await getGatewaySession(request.headers.get('Cookie'));
  const parsedGatewaySession = gatewaySession.get(
    // @ts-expect-error remix session
    GATEWAY_COOKIE_NAME!
  ) as unknown as GatewaySession;

  if (parsedGatewaySession && feature) {
    // this is not a hook
    // eslint-disable-next-line react-hooks/rules-of-hooks
    can = useFeatureFlagServerSide(
      feature,
      parsedGatewaySession.featuresDisabled
    );
  }

  if (can) {
    const sdkVersions = parsedGatewaySession?.servicesVersion
      ?.filter((s) => services?.find((service) => s.name === service))
      .reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [currentValue.name]: currentValue.version,
        }),
        {}
      );

    const api = await getFormanceSDK(
      authenticator,
      context.apiUrl,
      sdkVersions
    );

    if (isMicroStack) {
      return (await callback(
        api,
        { ...context, sdkVersions },
        authenticator
      )) as T;
    }

    const session = await authenticator.getParsedSession();

    if (
      context.organizationId !== null &&
      context.organizationId !== undefined &&
      isString(context.organizationId) &&
      context.stackId !== null &&
      context.stackId !== undefined &&
      isString(context.stackId)
    ) {
      otelCurrentSpan?.setAttribute(
        'sdk.versions',
        JSON.stringify(sdkVersions)
      );
      otelCurrentSpan?.setAttribute('app.version', session.version || '');
      otelCurrentSpan?.setAttribute('user', session.email);

      if (type === 'action') {
        try {
          return (await makeRequestWithContext(
            context,
            authenticator,
            sdkVersions,
            callback,
            type
          )) as T;
        } catch (err) {
          const statusCode = getErrorStatusCode(err);
          const statusText = getErrorStatusText(err);
          const data = getErrorDetails(err);
          otelCurrentSpan?.setAttribute('data', JSON.stringify(data));

          return throwError(statusCode, statusText, data, otelCurrentSpan);
        }
      }

      try {
        return (await callback(
          api,
          {
            ...context,
            sdkVersions,
          },
          authenticator
        )) as T;
      } catch (e: unknown) {
        const statusCode = getErrorStatusCode(e);
        const statusText = getErrorStatusText(e);
        const eData = getErrorDetails(e);

        if (process.env.MICRO_STACK === '1') {
          otelCurrentSpan?.setAttribute('data', JSON.stringify(eData));

          return throwError(statusCode, statusText, eData, otelCurrentSpan);
        } else {
          if (statusCode === 401 || statusCode === 403 || statusCode === 400) {
            try {
              otelCurrentSpan?.setAttribute('data', JSON.stringify(eData));
              otelCurrentSpan?.setAttribute(
                'sdk.error.message',
                e instanceof SDKError ? e.message : ''
              );

              return (await makeRequestWithContext(
                context,
                authenticator,
                sdkVersions,
                callback,
                type
              )) as T;
            } catch (error) {
              const errorStatusCode = getErrorStatusCode(error);
              const errorStatusText = getErrorStatusText(error);
              const errorData = getErrorDetails(error);
              otelCurrentSpan?.setAttribute('data', JSON.stringify(errorData));

              return throwError(
                errorStatusCode,
                errorStatusText,
                getErrorDetails(error),
                otelCurrentSpan
              );
            }
          } else {
            otelCurrentSpan?.setAttribute(
              'data',
              JSON.stringify(getErrorDetails(e))
            );
            otelCurrentSpan?.setAttribute(
              'sdk.error.message',
              e instanceof SDKError ? e.message : ''
            );

            return throwError(
              statusCode,
              statusText,
              getErrorDetails(e),
              otelCurrentSpan
            );
          }
        }
      }
    }
    otelCurrentSpan?.setAttribute('http.status_code', 422);
    otelCurrentSpan?.setAttribute('http.status_text', Errors.CONTEXT_MISSING);

    return throwError(422, Errors.CONTEXT_MISSING, undefined, otelCurrentSpan);
  } else {
    const errorLabel =
      'Forbidden: Feature flag is enabled. You can not access to this feature';

    otelCurrentSpan?.setAttribute('http.status_code', 422);
    otelCurrentSpan?.setAttribute('http.status_text', errorLabel);

    return throwError(403, errorLabel, undefined, otelCurrentSpan);
  }
};
