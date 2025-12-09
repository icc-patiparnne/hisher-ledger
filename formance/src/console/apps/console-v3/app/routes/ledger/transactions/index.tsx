import { LoaderFunction, useLoaderData } from 'react-router';
import { AppContentGrid } from '../../../components/app-content';
import AppErrorBoundary from '../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../hooks/useFeatureFlag';
import { withContext } from '../../../utils/auth.server';
import { ROUTES } from '../../../utils/routes';
import { NormalizedSDK } from '../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../utils/session.gateway.server';
import LedgerTransactionsList from '../components/ledger-transactions-list';

import { Cursor } from '@platform/sdks/utils/cursor';
import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { useRouteGuard } from '../../../hooks/useRouteGuard';
import { useRouteUpdate } from '../../../hooks/useRouteUpdate';

import {
  NormalizedLedgerModel,
  NormalizedTransactionModel,
} from '../../../utils/sdk/ledger/models';
import {
  NormalizedListLedgersResponse,
  NormalizedListTransactionsResponse,
} from '../../../utils/sdk/ledger/responses';
import { v1Loader } from './index.v1';
import { v2Loader } from './index.v2';

export type Data = {
  allLedgers: NormalizedListLedgersResponse;
  ledgerTransactions: NormalizedListTransactionsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  allLedgers: { cursor: Cursor<NormalizedLedgerModel> };
  ledgerTransactions:
    | { cursor: Cursor<NormalizedTransactionModel> }
    | undefined;
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

export default function LedgersTransactions() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region } = useRouteGuard({
    componentName: 'ledger-transactions',
  });

  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_TRANSACTIONS',
    breadcrumbs: [
      {
        title: 'Ledger',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_OVERVIEW'].to,
      },
      {
        title: 'Transactions',
        to: ROUTES({ organizationId, stackId, region })[
          'LEDGER_TRANSACTIONS_INDEX'
        ].to,
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as LoaderData;

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <LedgerTransactionsList
          ledgerTransactions={data?.ledgerTransactions?.cursor}
          allLedgers={data?.allLedgers?.cursor}
          showLedgerColumn={false}
          version={data?.version}
        />
      </div>
    </AppContentGrid>
  );
}
