import { useOutletContext } from 'react-router';

import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';

import { ROUTES } from '../../../../utils/routes';

import { MODULES_NAMES } from '@platform/utils';
import { TConnectivityAccountContext } from '.';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import PaymentsCashPoolsList from '../../cash-pools/components/payments-cash-pools-list';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function ConnectivityAccountPools() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentAccountId } = useRouteGuard({
    componentName: 'connectivity-account-pools',
    requiredParams: ['paymentAccountId'],
  });

  const context = useOutletContext<TConnectivityAccountContext>();
  const { paymentsAccountPools, version } = context;

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_ACCOUNT_POOLS',
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
        title: 'Pools',
      },
    ],
  });

  return (
    <div className="col-span-12">
      <PaymentsCashPoolsList
        cashPools={paymentsAccountPools.cursor}
        version={version}
      />
    </div>
  );
}
