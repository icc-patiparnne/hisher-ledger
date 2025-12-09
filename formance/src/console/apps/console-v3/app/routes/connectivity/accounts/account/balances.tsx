import { useOutletContext } from 'react-router';

import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';

import { ROUTES } from '../../../../utils/routes';

import { MODULES_NAMES } from '@platform/utils';
import { TConnectivityAccountContext } from '.';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import PaymentAccountBalancesList from '../components/payment-account-balances-list';

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export default function ConnectivityAccountBalances() {
  useFeatureFlag(FEATURES.payments);

  const { organizationId, stackId, region, paymentAccountId } = useRouteGuard({
    componentName: 'connectivity-account-balances',
    requiredParams: ['paymentAccountId'],
  });

  const context = useOutletContext<TConnectivityAccountContext>();
  const { paymentsAccountBalances, version } = context;

  useRouteUpdate({
    moduleName: MODULES_NAMES.CONNECTIVITY,
    routeId: 'CONNECTIVITY_ACCOUNT_BALANCES',
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
        title: 'Balances',
      },
    ],
  });

  return (
    <div className="col-span-12">
      <PaymentAccountBalancesList
        paymentAccountBalances={paymentsAccountBalances?.cursor}
        version={version}
      />
    </div>
  );
}
