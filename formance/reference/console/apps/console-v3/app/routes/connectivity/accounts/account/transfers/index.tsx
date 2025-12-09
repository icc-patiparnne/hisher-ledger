import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import AppErrorBoundary from '../../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../../utils/auth.server';
import { ROUTES } from '../../../../../utils/routes';

import { NormalizedTransferInitiationModel } from '../../../../../utils/sdk/payments/models';
import { NormalizedListTransferInitiationsResponse } from '../../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../../utils/session.gateway.server';
import PaymentTransfersList from '../../../transfers/components/payment-transfers-list';
import { v1Loader } from './transfers.v1';
import { v3Loader } from './transfers.v3';

export type Data = {
  paymentsAccountTransfers:
    | NormalizedListTransferInitiationsResponse
    | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  paymentsAccountTransfers: {
    cursor: Cursor<NormalizedTransferInitiationModel>;
  };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.paymentAccountId, 'params.paymentAccountId is required');
  const paymentAccountId = params.paymentAccountId;
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
            await v3Loader(api, request, paymentAccountId),
            version
          );
        }
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, request, paymentAccountId),
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

export default function PaymentAccountTransfers() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentAccountId } = useRouteGuard({
    componentName: 'connectivity-account-transfers',
    requiredParams: ['paymentAccountId'],
  });

  const loaderData = useLoaderData<LoaderData>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_ACCOUNT_TRANSFERS',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Accounts',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_ACCOUNTS']
          .to,
      },
      {
        title: paymentAccountId,
      },
      {
        title: 'Transfers',
      },
    ],
  });

  return (
    <div className="col-span-12">
      <PaymentTransfersList
        paymentTransfers={
          loaderData.paymentsAccountTransfers
            ?.cursor as unknown as Cursor<NormalizedTransferInitiationModel>
        }
        version={loaderData.version}
      />
    </div>
  );
}
