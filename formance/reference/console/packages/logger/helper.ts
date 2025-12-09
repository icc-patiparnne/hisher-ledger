import { api } from '@opentelemetry/sdk-node';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { get, isString, noop } from 'lodash-es';
import * as Sentry from '@sentry/react';

export const getErrorDetails = (e: unknown) => {
  const data = JSON.stringify(e);
  const config = get(e, 'response.config', get(e, 'config'));

  return {
    url: get(config, 'url'),
    data,
  };
};
export const getErrorStatusText = (e: unknown) =>
  get(e, 'response.statusText', get(e, 'statusText', get(e, 'errorCode', '')));

export const throwError = (
  statusCode: number,
  statusText: string,
  details?: any,
  activeSpan?: api.Span
) => {
  const otel = api.trace.getActiveSpan()?.spanContext() ||
    activeSpan?.spanContext() || {
      traceId: '',
      spanId: '',
    };
  let message = 'Unexpected error';
  try {
    message = JSON.parse(statusText);
  } catch {
    message = isString(statusText) ? statusText : message;
  }

  throw new Response(
    JSON.stringify({
      statusCode,
      url: details?.url,
      data: details?.data,
      traceId: otel.traceId,
      spanId: otel.spanId,
      statusText: message,
    })
  );
};

export const logError = (e: AxiosError | unknown, fulltrace = false) => {
  const statusText = get(
    e,
    'response.statusText',
    get(e, 'statusText', 'Internal platform error')
  );
  const statusCode = get(e, 'response.status', get(e, 'status', 422));
  const config: AxiosRequestConfig<any> | undefined = get(
    e,
    'response.config',
    get(e, 'config')
  );
  const data = get(e, 'response.data', get(e, 'data'));

  const trace = api.trace.getActiveSpan()?.spanContext();
  const log = {
    spanId: trace?.spanId || 'unknown',
    traceId: trace?.traceId || 'unknown',
    statusCode,
    statusText,
    url: get(config, 'url'),
    method: get(config, 'method'),
    data: data
      ? data
      : e instanceof TypeError
      ? `[${e.name}]: ${e.message} [Stack]: ${e.stack}`
      : e,
  };

  // LINT_EXCEPTION_REASON: debug mode
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(log, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );

  if (fulltrace) {
    console.log('DEBUG_FULLTRACE', JSON.stringify(e));
  }

  return log;
};

export type DeserializedLog = {
  spanId: string;
  traceId: string;
  data?: any;
  url: string;
  statusCode: string;
  statusText: string;
};

export type SeverityLevel =
  | 'fatal'
  | 'error'
  | 'warning'
  | 'log'
  | 'info'
  | 'debug';
export const getLevel = (code?: number | string): SeverityLevel => {
  const handler = (c: number) => {
    if (c >= 500 && c <= 599) {
      return 'fatal';
    } else {
      if (c >= 400 && c <= 499) {
        return 'error';
      } else {
        if (c >= 300 && c <= 308) {
          return 'info';
        }

        return 'log';
      }
    }
  };
  if (!code && code !== '') {
    return 'log';
  } else {
    if (typeof code === 'string') {
      if (code === 'unknown' || code === '') {
        return 'warning';
      } else {
        const codeNumber = Number(code);

        return handler(codeNumber);
      }
    } else {
      return handler(code);
    }
  }
};

export const deserializeError = (log: unknown): DeserializedLog => {
  const defaultLog = {
    spanId: '',
    traceId: '',
    url: '',
    data: {},
    statusCode: '422',
    statusText: 'Could not retrieve logs',
  };
  const data = get(log, 'data');

  if (log) {
    try {
      const parsedLog = data ? JSON.parse(data) : defaultLog;

      return {
        spanId: parsedLog.spanId,
        traceId: parsedLog.traceId,
        url: parsedLog.url,
        data: parsedLog.data,
        statusCode: parsedLog.statusCode,
        statusText: parsedLog.statusText,
      };
    } catch (e) {
      return {
        ...defaultLog,
        data: JSON.stringify(log),
      };
    }
  }

  return defaultLog;
};

export const debugLog = (item: unknown, label?: string, force = false) => {
  const customLabel = `#DEBUG_DATA_${label}` || '#DEBUG_DATA';
  if (force) {
    console.info(customLabel, item);
  } else {
    if (typeof process !== 'undefined') {
      if (process.env.NODE_ENV === 'development' || process.env.DEBUG === '1') {
        console.info(customLabel, item);
      }
    }
  }
};

export const initSentry = (
  dsn: string,
  environment: string,
  release: string,
  app: string
) => {
  const client = Sentry.getClient();

  if (!client) {
    Sentry.init({
      dsn,
      environment,
      release,
      integrations: [
        Sentry.extraErrorDataIntegration(),
        Sentry.replayIntegration({
          // Additional SDK configuration goes in here, for example:
          maskAllText: true,
          blockAllMedia: true,
        }),
        Sentry.functionToStringIntegration(),
        Sentry.captureConsoleIntegration(),
        Sentry.httpClientIntegration(),
      ],
      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      sendDefaultPii: true,
    });
    console.info(`[${app}]: Sentry initialized.`);
  } else {
    console.info(`[${app}]: Sentry already initialized.`);
  }
};

export const debugLogger = (
  debug: string,
  method: string,
  key: string = '',
  value: any = ''
) => {
  try {
    if (debug === 'true') {
      console.info(JSON.stringify({ key, value, method }));
    }
  } catch (e) {
    noop();
  }
};
