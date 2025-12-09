import { LoaderFunction, useLoaderData } from 'react-router';

import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import React from 'react';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedTransferInitiationModel } from '../../../../utils/sdk/payments/models';
import { NormalizedListTransferInitiationsResponse } from '../../../../utils/sdk/payments/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import PaymentTransfersList from '../components/payment-transfers-list';
import TransfersActions from '../components/transfers-actions';
import TransfersTabs from '../components/transfers-tabs';
import { v1Loader } from './transfers.v1';
import { v3Loader } from './transfers.v3';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  paymentTransfers: NormalizedListTransferInitiationsResponse | undefined;
};

type LoaderData = LoaderWrapperProps<{
  paymentTransfers: { cursor: Cursor<NormalizedTransferInitiationModel> };
}>;

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
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

export default function ConnectivityTransfers() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-transfers',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_TRANSFERS',
    breadcrumbs: [
      {
        title: 'Connectivity',
        to: ROUTES({ organizationId, stackId, region })['CONNECTIVITY_OVERVIEW']
          .to,
      },
      {
        title: 'All Transfers',
        to: ROUTES({ organizationId, stackId, region })[
          'CONNECTIVITY_TRANSFERS'
        ].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  const transfersWaitingForValidation =
    data.paymentTransfers.cursor.data.filter(
      (transfer) => transfer.status === 'WAITING_FOR_VALIDATION'
    );

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <div className="flex justify-between items-center">
          <TransfersTabs
            organizationId={organizationId}
            stackId={stackId}
            region={region}
            waitingForValidationTransfers={transfersWaitingForValidation.length}
          />
          <TransfersActions />
        </div>
      </div>

      <div className="col-span-12">
        <PaymentTransfersList
          paymentTransfers={
            data.paymentTransfers
              .cursor as unknown as Cursor<NormalizedTransferInitiationModel>
          }
          version={data.version}
        />
      </div>
    </AppContentGrid>
  );
}
