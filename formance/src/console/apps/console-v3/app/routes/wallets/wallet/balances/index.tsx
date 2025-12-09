import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { GetWalletSummaryResponse } from '@platform/sdks/formance/src/models/components';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { NormalizedWalletModel } from '../../../../utils/sdk/wallets/models';
import { NormalizedGetWalletResponse } from '../../../../utils/sdk/wallets/responses';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import WalletActions from '../../components/wallet-actions';
import WalletBalancesList from '../../components/wallet-balances-list';
import WalletHeader from '../../components/wallet-header';
import WalletTabs from '../../components/wallet-tabs';
import { v1Loader } from './wallet-balances.v1';

export type Data = {
  wallet: NormalizedGetWalletResponse | undefined;
  walletSummary: GetWalletSummaryResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  wallet: { data: NormalizedWalletModel };
  walletSummary: GetWalletSummaryResponse;
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.walletId, 'params.walletId is required');
  const walletId = params.walletId;

  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.WALLETS
      );
      switch (version) {
        case '1':
        default:
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, walletId),
            version
          );
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  )) as LoaderData;
};

export default function Wallet() {
  const { organizationId, stackId, region, walletId } = useRouteGuard({
    componentName: 'wallet',
    requiredParams: ['walletId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLET_BALANCES',
    breadcrumbs: [
      {
        title: 'Wallets',
      },
      {
        title: 'All Wallets',
        to: ROUTES({ organizationId, stackId, region })['WALLETS_ALL'].to,
      },
      {
        title: walletId,
        to: ROUTES({
          organizationId,
          stackId,
          region,
          walletId,
        })['WALLET_BALANCES'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

  const walletBalances = data.walletSummary.data
    .balances as unknown as GetWalletSummaryResponse['data']['balances'];

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <WalletHeader
          wallet={data.wallet.data as unknown as NormalizedWalletModel}
        />
      </div>

      <div className="col-span-12">
        <div className="flex items-center justify-between">
          <WalletTabs
            organizationId={organizationId}
            stackId={stackId}
            region={region}
            walletId={walletId}
          />
          <WalletActions walletBalances={walletBalances} />
        </div>
      </div>

      <div className="col-span-12">
        <WalletBalancesList
          walletBalances={walletBalances}
          version={data.version}
          serverSide={false}
        />
      </div>
    </AppContentGrid>
  );
}
