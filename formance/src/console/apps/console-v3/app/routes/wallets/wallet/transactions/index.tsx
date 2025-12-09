import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import {
  NormalizedWalletModel,
  NormalizedWalletTransactionModel,
} from '../../../../utils/sdk/wallets/models';
import { NormalizedGetWalletResponse } from '../../../../utils/sdk/wallets/responses';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import WalletHeader from '../../components/wallet-header';
import { v1Loader } from './wallet-transactions.v1';

import { Cursor } from '@platform/sdks/utils/cursor';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';

import WalletTabs from '../../components/wallet-tabs';
import WalletTransactionsList from '../../components/wallet-transactions-list';

export type Data = {
  wallet: NormalizedGetWalletResponse | undefined;
  walletTransactions: Cursor<NormalizedWalletTransactionModel> | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  wallet: { data: NormalizedWalletModel };
  walletTransactions: { cursor: Cursor<NormalizedWalletTransactionModel> };
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
            await v1Loader(api, request, walletId),
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
  useFeatureFlag(FEATURES.wallets);

  const { organizationId, stackId, region, walletId } = useRouteGuard({
    componentName: 'wallet',
    requiredParams: ['walletId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLET_TRANSACTIONS',
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
        })['WALLET_DETAIL'].to,
      },
      {
        title: 'Transactions',
        to: ROUTES({
          organizationId,
          stackId,
          region,
          walletId,
        })['WALLET_TRANSACTIONS'].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>();

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
        </div>
      </div>

      <div className="col-span-12">
        <WalletTransactionsList
          walletTransactions={
            data.walletTransactions
              .cursor as unknown as Cursor<NormalizedWalletTransactionModel>
          }
          version={data.version}
        />
      </div>
    </AppContentGrid>
  );
}
