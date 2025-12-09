import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import {
  NormalizedWalletHoldModel,
  NormalizedWalletModel,
} from '../../../../utils/sdk/wallets/models';
import { NormalizedGetWalletResponse } from '../../../../utils/sdk/wallets/responses';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import WalletHeader from '../../components/wallet-header';
import { v1Loader } from './wallet-holds.v1';

import { GetWalletSummaryResponse } from '@platform/sdks/formance/src/models/components';
import { Cursor } from '@platform/sdks/utils/cursor';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';

import WalletActions from '../../components/wallet-actions';
import WalletHoldsList from '../../components/wallet-holds-list';
import WalletTabs from '../../components/wallet-tabs';

export type Data = {
  wallet: NormalizedGetWalletResponse | undefined;
  walletSummary: GetWalletSummaryResponse | undefined;
  walletHolds: Cursor<NormalizedWalletHoldModel> | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  wallet: { data: NormalizedWalletModel };
  walletSummary: GetWalletSummaryResponse;
  walletHolds: { cursor: Cursor<NormalizedWalletHoldModel> };
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
  const { organizationId, stackId, region, walletId } = useRouteGuard({
    componentName: 'wallet',
    requiredParams: ['walletId'],
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLET_HOLDS',
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
        })['WALLET_HOLDS'].to,
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
          <WalletActions
            walletBalances={
              data.walletSummary?.data
                .balances as unknown as GetWalletSummaryResponse['data']['balances']
            }
            isHoldsList
          />
        </div>
      </div>

      <div className="col-span-12">
        <WalletHoldsList
          walletHolds={
            data.walletHolds
              .cursor as unknown as Cursor<NormalizedWalletHoldModel>
          }
          version={data.version}
        />
      </div>
    </AppContentGrid>
  );
}
