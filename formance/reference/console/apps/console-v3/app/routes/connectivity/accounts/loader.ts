import { MODULES_GATEWAYS } from '@platform/utils';
import { LoaderFunction } from 'react-router';
import { FEATURES } from '../../../hooks/useFeatureFlag';
import { withContext } from '../../../utils/auth.server';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import { v1Loader } from './accounts.v1';
import { v3Loader } from './accounts.v3';
import { Data, LoaderData } from './index';

export const getPaymentsAccountsLoader =
  (): LoaderFunction =>
  async ({ request }): Promise<LoaderData> => {
    const authenticator = getAuthenticator(request);

    return (await withContext<LoaderData>(
      async (api: NormalizedSDK, context) => {
        const version = getServiceVersionFromContext(
          context,
          MODULES_GATEWAYS.PAYMENTS
        );

        switch (version) {
          case '3': {
            return wrapLoaderWithProps<Data>(
              await v3Loader(api, request),
              version
            );
          }
          default:
            return wrapLoaderWithProps<Data>(
              await v1Loader(api, request),
              version
            );
        }
      },
      authenticator,
      request,
      [MODULES_GATEWAYS.PAYMENTS],
      FEATURES.payments
    )) as LoaderData;
  };
