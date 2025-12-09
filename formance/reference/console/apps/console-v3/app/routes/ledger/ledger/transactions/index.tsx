import { LoaderFunction, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { Cursor } from '@platform/sdks/utils/cursor';
import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';

import {
  NormalizedLedgerModel,
  NormalizedStatsModel,
  NormalizedTransactionModel,
} from '../../../../utils/sdk/ledger/models';
import {
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
  NormalizedListTransactionsResponse,
} from '../../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import LedgerHeader from '../../components/ledger-header';
import LedgerTransactionsList from '../../components/ledger-transactions-list';
import { v1Loader } from './ledger-transactions.v1';
import { v2Loader } from './ledger-transactions.v2';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import LedgerTabs from '../../components/ledger-tabs';

export type Data = {
  ledger: NormalizedGetLedgerResponse | undefined;
  ledgerStats: NormalizedGetLedgerStatsResponse | undefined;
  ledgerTransactions: NormalizedListTransactionsResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  ledger: { data: NormalizedLedgerModel };
  ledgerStats: { data: NormalizedStatsModel };
  ledgerTransactions: { cursor: Cursor<NormalizedTransactionModel> };
}>;

export function ErrorBoundary() {
  return <AppErrorBoundary />;
}

export const loader: LoaderFunction = async ({
  request,
  params,
}): Promise<LoaderData> => {
  invariant(params.ledgerName, 'params.ledgerName is required');
  const ledgerName = params.ledgerName;

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
            await v1Loader(api, request, ledgerName),
            version
          );
        }
        case '2':
        default:
          return wrapLoaderWithProps<Data>(
            await v2Loader(api, request, ledgerName),
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

export default function LedgerTransactions() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName } = useRouteGuard({
    componentName: 'ledger-transactions',
    requiredParams: ['ledgerName'],
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
        title: 'All Ledgers',
        to: ROUTES({ organizationId, stackId, region })['LEDGER_ALL'].to,
      },
      {
        title: ledgerName,
        to: ROUTES({ organizationId, stackId, region, ledgerName })[
          'LEDGER_DETAIL'
        ].to,
      },
      {
        title: 'Transactions',
      },
    ],
  });

  const data = useLoaderData<LoaderData>() as unknown as LoaderData;

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <LedgerHeader
          ledger={data?.ledger?.data}
          ledgerStats={data?.ledgerStats?.data}
        />
      </div>

      <div className="col-span-12">
        <LedgerTabs
          organizationId={organizationId}
          stackId={stackId}
          region={region}
          ledgerName={ledgerName}
          version={data?.version}
        />
      </div>

      <div className="col-span-12">
        <LedgerTransactionsList
          ledgerTransactions={data?.ledgerTransactions?.cursor}
          showLedgerColumn={false}
          version={data?.version}
        />
      </div>
    </AppContentGrid>
  );
}
