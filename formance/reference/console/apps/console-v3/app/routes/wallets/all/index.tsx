import React from 'react';
import { Link, LoaderFunction, useLoaderData } from 'react-router';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';

import { Cursor } from '@platform/sdks/utils/cursor';
import { Button } from '@platform/ui';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';

import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { NormalizedWalletModel } from '../../../utils/sdk/wallets/models';
import { NormalizedListWalletsResponse } from '../../../utils/sdk/wallets/responses';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import WalletsList from '../components/wallets-list';
import { v1Loader } from './all.v1';

export type Data = {
  allWallets: NormalizedListWalletsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  allWallets: { cursor: Cursor<NormalizedWalletModel> };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData> => {
  const authenticator = getAuthenticator(request);

  return (await withContext<LoaderData>(
    async (api: NormalizedSDK, context) => {
      const version = getServiceVersionFromContext(
        context,
        MODULES_GATEWAYS.WALLETS
      );

      return wrapLoaderWithProps<Data>(await v1Loader(api, request), version);
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.WALLETS],
    FEATURES.wallets
  )) as LoaderData;
};

export default function WalletsAll() {
  useFeatureFlag(FEATURES.wallets);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'wallets-all',
  });

  const data = useLoaderData<LoaderData>();

  useRouteUpdate({
    moduleName: MODULES_NAMES.WALLETS,
    routeId: 'WALLETS_ALL',
    breadcrumbs: [
      {
        title: 'Wallets',
      },
      {
        title: 'All Wallets',
        to: ROUTES({ organizationId, stackId, region })['WALLETS_ALL'].to,
      },
    ],
  });

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <WalletsList
          wallets={
            data?.allWallets.cursor as unknown as Cursor<NormalizedWalletModel>
          }
          version={data?.version}
        >
          <Link
            className="absolute top-4 right-4"
            to={ROUTES({ organizationId, stackId, region })['WALLET_CREATE'].to}
          >
            <Button variant="primary" size="sm">
              Create Wallet
            </Button>
          </Link>
        </WalletsList>
      </div>
    </AppContentGrid>
  );
}
