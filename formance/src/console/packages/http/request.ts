import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { get } from 'lodash-es';
import { api as traceApi } from '@opentelemetry/sdk-node';

export default async <T>(
  config: AxiosRequestConfig,
  dataPath?: string,
  onSuccess?: (_data?: any) => void,
  onError?: (e: AxiosError) => void,
  spanName?: string,
  returnFullResponse?: boolean
): Promise<T> => {
  const controller = new AbortController();
  const name = spanName || 'http:request';
  const urlSplit = config.url?.split('://')
    ? config.url?.split('://')[1]
    : undefined;
  const otelCurrentContext = traceApi.context.active();
  const otelCurrentSpan = traceApi.trace.getSpan(otelCurrentContext);
  otelCurrentSpan?.updateName(name);
  otelCurrentSpan?.setAttribute(
    'stack',
    (urlSplit && urlSplit.split('.') ? urlSplit.split('.')[0] : 'unknown') || ''
  );

  return axios<T>({ ...config, withCredentials: true })
    .then<T>(async (response) => {
      if (returnFullResponse) {
        return response as T;
      }

      if (response.status >= 200 && response.status < 400) {
        const data = dataPath ? get(response, dataPath) : response.data;
        otelCurrentSpan?.setAttribute('data', JSON.stringify(data));

        if (onSuccess) {
          onSuccess(data);
        }
        if (data) {
          return data;
        }

        return {};
      }
    })
    .catch<any>((e: AxiosError) => {
      controller.abort();
      if (returnFullResponse) {
        return e.response as T;
      }
      const data = dataPath ? get(e.response, dataPath) : e.response?.data;
      otelCurrentSpan?.setAttribute('data', JSON.stringify(data));
      if (onError) {
        return onError(e);
      } else {
        throw e;
      }
    });
};
