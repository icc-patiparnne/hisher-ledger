import React from 'react';
import { useLoaderData } from 'react-router';

import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { ROUTES } from '../../../utils/routes';
import {
  NormalizedConnectorConfigsModel,
  NormalizedPaymentAccountModel,
} from '../../../utils/sdk/payments/models';
import {
  NormalizedListAllAvailableConnectorsResponse,
  NormalizedListPaymentsAccountsResponse,
} from '../../../utils/sdk/payments/responses';
import { LoaderWrapperProps } from '../../../utils/session.gateway.server';
import PaymentAccountsList from './components/payment-accounts-list';
import { getPaymentsAccountsLoader } from './loader';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export type Data = {
  paymentsAccounts: NormalizedListPaymentsAccountsResponse | undefined;
  connectorsConfig: NormalizedListAllAvailableConnectorsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  paymentsAccounts: { cursor: Cursor<NormalizedPaymentAccountModel> };
  connectorsConfig: { data: NormalizedConnectorConfigsModel };
}>;

export const loader = getPaymentsAccountsLoader();

export default function ConnectivityAccounts() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'connectivity-accounts',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_ACCOUNTS',
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
    ],
  });

  const data = useLoaderData<LoaderData>();

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <PaymentAccountsList
          connectorsConfig={data?.connectorsConfig?.data}
          paymentsAccounts={
            data?.paymentsAccounts
              .cursor as unknown as Cursor<NormalizedPaymentAccountModel>
          }
          serverSide={true}
          version={data.version}
        />
      </div>
    </AppContentGrid>
  );
}
