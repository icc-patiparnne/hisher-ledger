import React from 'react';
import { LoaderFunction, useLoaderData } from 'react-router';

import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import {
  NormalizedAccountModel,
  NormalizedLedgerModel,
} from '../../../utils/sdk/ledger/models';
import {
  NormalizedListAccountsResponse,
  NormalizedListLedgersResponse,
} from '../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import LedgerAccountsList from '../components/ledger-accounts-list';
import { v1Loader } from './index.v1';
import { v2Loader } from './index.v2';

export type Data = {
  allLedgers: NormalizedListLedgersResponse;
  ledgerAccounts: NormalizedListAccountsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  allLedgers: { cursor: Cursor<NormalizedLedgerModel> };
  ledgerAccounts: { cursor: Cursor<NormalizedAccountModel> } | undefined;
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
        MODULES_GATEWAYS.LEDGER
      );

      switch (version) {
        case '1': {
          return wrapLoaderWithProps<Data>(
            await v1Loader(api, request),
            version
          );
        }
        case '2':
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, request),
            version
          );
      }
    },
    authenticator,
    request,
    [MODULES_GATEWAYS.LEDGER],
    FEATURES.ledger
  )) as LoaderData;
};

export default function LedgersAccounts() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledgers-accounts',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_ACCOUNTS',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'Accounts',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_ACCOUNTS_INDEX']
          .to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as LoaderData;

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <LedgerAccountsList
          ledgerAccounts={data?.ledgerAccounts?.cursor}
          allLedgers={data?.allLedgers?.cursor}
          version={data?.version}
        />
      </div>
    </AppContentGrid>
  );
}
