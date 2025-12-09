import React from 'react';
import { LoaderFunction, redirect, useLoaderData } from 'react-router';
import invariant from 'tiny-invariant';

import { AppContentGrid } from '../../../../components/app-content';
import AppErrorBoundary from '../../../../components/app-error-boundary';
import { FEATURES, useFeatureFlag } from '../../../../hooks/useFeatureFlag';
import { useRouteGuard } from '../../../../hooks/useRouteGuard';
import { withContext } from '../../../../utils/auth.server';
import { ROUTES } from '../../../../utils/routes';
import {
  NormalizedLedgerModel,
  NormalizedStatsModel,
} from '../../../../utils/sdk/ledger/models';
import {
  NormalizedGetBalancesAggregatedResponse,
  NormalizedGetLedgerResponse,
  NormalizedGetLedgerStatsResponse,
} from '../../../../utils/sdk/ledger/responses';
import { NormalizedSDK } from '../../../../utils/sdk/sdk';
import { getAuthenticator } from '../../../../utils/session.auth.server';
import {
  getServiceVersionFromContext,
  LoaderWrapperProps,
  wrapLoaderWithProps,
} from '../../../../utils/session.gateway.server';
import LedgerHeader from '../../components/ledger-header';
import { v2Loader } from './aggregate-balances.v2';

import { MODULES_GATEWAYS, MODULES_NAMES } from '@platform/utils';
import { useRouteUpdate } from '../../../../hooks/useRouteUpdate';
import LedgerAggregateBalancesList from '../../components/ledger-aggregate-balances-list';
import LedgerTabs from '../../components/ledger-tabs';

export type Data = {
  ledger: NormalizedGetLedgerResponse | undefined;
  ledgerStats: NormalizedGetLedgerStatsResponse | undefined;
  ledgerAggregateBalances: NormalizedGetBalancesAggregatedResponse | undefined;
};

export type LoaderData = LoaderWrapperProps<{
  ledger: { data: NormalizedLedgerModel };
  ledgerStats: { data: NormalizedStatsModel };
  ledgerAggregateBalances: NormalizedGetBalancesAggregatedResponse;
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

      const { organizationId, stackId, region } = context;

      switch (version) {
        case '1': {
          return redirect(
            ROUTES({ organizationId, stackId, region, ledgerName })[
              'LEDGER_ACCOUNTS'
            ].to
          );
        }

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

export default function LedgerAggregateBalances() {
  useFeatureFlag(FEATURES.ledger);

  const { organizationId, stackId, region, ledgerName } = useRouteGuard({
    componentName: 'ledger-aggregate-balances',
    requiredParams: ['ledgerName'],
  });

  const data = useLoaderData<LoaderData>() as unknown as LoaderData;
  useRouteUpdate({
    moduleName: MODULES_NAMES.LEDGER,
    routeId: 'LEDGER_AGGREGATE_BALANCES',
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
        title: 'Aggregate Balances',
      },
    ],
  });

  const { ledger, ledgerStats, ledgerAggregateBalances } = data;

  return (
    <AppContentGrid>
      <div className="col-span-12">
        <LedgerHeader ledger={ledger?.data} ledgerStats={ledgerStats?.data} />
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
        <LedgerAggregateBalancesList
          ledgerAggregateBalances={ledgerAggregateBalances}
          version={data?.version}
        />
      </div>
    </AppContentGrid>
  );
}
